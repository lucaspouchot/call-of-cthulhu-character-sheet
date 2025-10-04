import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { DiceRollingService } from '../../services/dice-rolling.service';
import { EntityTranslationService } from '../../services/entity-translation.service';
import { TranslationService } from '../../services/translation.service';
import { CharacterSheet as CharacterModel, Sex, Skill } from '../../models/character.model';
import { DiceRoll } from '../../models/dice.model';
import { OCCUPATIONS } from '../../models/skills.model';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { DynamicTranslatePipe } from '../../pipes/dynamic-translate.pipe';
import { CharacteristicCardComponent } from './card/characteristic/characteristic-card.component';
import { HealthCardComponent } from './card/health/health-card.component';
import { MovementCardComponent } from './card/movement/movement-card.component';
import { SkillsCardComponent } from './card/skills/skills-card.component';
import { BasicInfoCardComponent } from './card/basic-info/basic-info-card.component';
import { FortuneCardComponent } from './card/fortune/fortune-card.component';
import { EquipmentCardComponent } from './card/equipment/equipment-card.component';
import { BackgroundCardComponent } from './card/background/background-card.component';

@Component({
  selector: 'app-character-sheet',
  imports: [
    CommonModule,
    FormsModule,
    LanguageSwitcherComponent,
    DynamicTranslatePipe,
    CharacteristicCardComponent,
    HealthCardComponent,
    MovementCardComponent,
    SkillsCardComponent,
    BasicInfoCardComponent,
    FortuneCardComponent,
    EquipmentCardComponent,
    BackgroundCardComponent
  ],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.css'
})
export class CharacterSheetComponent implements OnInit {
  character: CharacterModel | null = null;
  rollHistory: DiceRoll[] = [];
  showDiceHistory = false;

  // Make Sex enum available in template
  sexValues = Sex;

  // Make occupations available in template
  occupations = OCCUPATIONS;

  // Show recalculation notification
  showRecalculationNotice = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private diceService: DiceRollingService,
    private entityTranslationService: EntityTranslationService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    const characterId = this.route.snapshot.paramMap.get('id');
    if (characterId) {
      this.loadCharacter(characterId);
    }

    this.diceService.getHistory().subscribe(history => {
      this.rollHistory = history;
    });
  }

  // Callback methods for card components
  onCharacterChange(character: CharacterModel): void {
    this.character = character;
  }

  onRollCharacteristicCheck(event: { attribute: string, value: number }): void {
    this.rollCharacteristicCheck(event.attribute, event.value);
  }

  onRollSkillCheck(skill: Skill): void {
    this.rollSkillCheck(skill);
  }

  onRollSanityCheck(): void {
    this.rollSanityCheck();
  }

  onAgeChange(): void {
    if (this.character) {
      this.recalculateDerivedAttributes();
      this.showRecalculationNotice = true;
      setTimeout(() => {
        this.showRecalculationNotice = false;
      }, 2000);
    }
  }

  loadCharacter(id: string) {
    const character = this.characterService.getCharacterById(id);
    this.character = character || null;
    if (!this.character) {
      this.router.navigate(['/']);
    }
  }

  recalculateDerivedAttributes() {
    if (!this.character) return;

    // Calculate Hit Points (CON + SIZ) / 10
    const newHitPointsMax = Math.floor((this.character.constitution.value + this.character.size.value) / 10);
    const oldEffectiveHitPointsMax = this.getEffectiveMaximum('hitPoints');
    const currentHitPointsRatio = oldEffectiveHitPointsMax > 0 ? this.character.hitPoints.current / oldEffectiveHitPointsMax : 0;
    this.character.hitPoints.maximum = newHitPointsMax;
    // Maintain the same ratio based on effective maximum (with modifiers)
    const newEffectiveHitPointsMax = this.getEffectiveMaximum('hitPoints');
    this.character.hitPoints.current = Math.min(
      Math.floor(newEffectiveHitPointsMax * currentHitPointsRatio),
      newEffectiveHitPointsMax
    );

    // Calculate Sanity (POW)
    const newSanityMax = this.character.power.value;
    const oldEffectiveSanityMax = this.getEffectiveMaximum('sanity');
    const currentSanityRatio = oldEffectiveSanityMax > 0 ? this.character.sanity.current / oldEffectiveSanityMax : 0;
    this.character.sanity.maximum = newSanityMax;
    // Maintain the same ratio based on effective maximum (with modifiers)
    const newEffectiveSanityMax = this.getEffectiveMaximum('sanity');
    this.character.sanity.current = Math.min(
      Math.floor(newEffectiveSanityMax * currentSanityRatio),
      newEffectiveSanityMax
    );

    // Calculate Magic Points (POW / 5)
    const newMagicPointsMax = Math.floor(this.character.power.value / 5);
    const oldEffectiveMagicPointsMax = this.getEffectiveMaximum('magicPoints');
    const currentMagicPointsRatio = oldEffectiveMagicPointsMax > 0 ? this.character.magicPoints.current / oldEffectiveMagicPointsMax : 0;
    this.character.magicPoints.maximum = newMagicPointsMax;
    // Maintain the same ratio based on effective maximum (with modifiers)
    const newEffectiveMagicPointsMax = this.getEffectiveMaximum('magicPoints');
    this.character.magicPoints.current = Math.min(
      Math.floor(newEffectiveMagicPointsMax * currentMagicPointsRatio),
      newEffectiveMagicPointsMax
    );

    // Calculate Movement based on age and attributes
    const move = this.character.age < 40 ? 8 :
      this.character.age < 50 ? 7 :
        this.character.age < 60 ? 6 : 5;

    this.character.movement = {
      normal: move,
      running: move * 5,
      climbing: move / 2,
      swimming: move / 2
    };

    // Update skills that depend on attributes
    this.updateDerivedSkills();
  }

  updateDerivedSkills() {
    if (!this.character) return;

    this.character.skills = this.character.skills.map(skill => {
      let updatedSkill = { ...skill };

      // Update dodge skill (half DEX)
      if (skill.id === 'dodge') {
        updatedSkill.baseValue = this.character!.dexterity.halfValue;
        updatedSkill.totalValue = updatedSkill.baseValue + updatedSkill.personalValue + updatedSkill.occupationValue;
      }

      // Update Language (Own) skill (EDU)
      if (skill.id === 'languageOwn') {
        updatedSkill.baseValue = this.character!.education.value;
        updatedSkill.totalValue = updatedSkill.baseValue + updatedSkill.personalValue + updatedSkill.occupationValue;
      }

      return updatedSkill;
    });
  }

  getSkillTranslation(skill: Skill): string {
    return this.entityTranslationService.getSkillTranslation(skill);
  }

  getSexTranslation(sex: Sex): string {
    return this.entityTranslationService.getSexTranslation(sex);
  }

  getOccupationName(occupationId: string): string {
    return this.entityTranslationService.getOccupationName(occupationId);
  }

  saveCharacter() {
    if (this.character) {
      // Use the service's method to calculate derived attributes properly
      const derivedUpdates = this.characterService.calculateDerivedAttributes(this.character);
      Object.assign(this.character, derivedUpdates);

      this.characterService.updateCharacter(this.character.id, this.character);
    }
  }

  rollSkillCheck(skill: Skill) {
    const skillName = this.getSkillTranslation(skill);
    const roll = this.diceService.rollSkillCheck(skill.totalValue, skillName);
    this.showResultModal(roll);
  }

  rollCharacteristicCheck(attributeName: string, value: number) {
    const roll = this.diceService.rollCharacteristicCheck(value, attributeName);
    this.showResultModal(roll);
  }

  rollLuck() {
    if (this.character) {
      const roll = this.diceService.rollCharacteristicCheck(this.character.luck.current, 'Luck');
      this.showResultModal(roll);
    }
  }

  rollSanityCheck() {
    if (this.character) {
      const roll = this.diceService.rollCharacteristicCheck(this.character.sanity.current, 'Sanity');
      this.showResultModal(roll);
    }
  }

  private showResultModal(roll: DiceRoll) {
    // Use translation service for dynamic text
    const getTranslation = (key: string) => this.translationService.getTranslation(key) || key;

    // Simple alert for now - could be enhanced with a proper modal
    let message = `${roll.description}\n${getTranslation('character.sheet.rolled')}: ${roll.result}`;
    if (roll.target) {
      message += ` ${getTranslation('character.sheet.vs')} ${roll.target}%`;
      if (roll.criticalSuccess) {
        message += `\n🎯 ${getTranslation('character.sheet.critical')}`;
      } else if (roll.extremeSuccess) {
        message += `\n⭐ ${getTranslation('character.sheet.extreme')}`;
      } else if (roll.hardSuccess) {
        message += `\n💪 ${getTranslation('character.sheet.hard')}`;
      } else if (roll.regularSuccess) {
        message += `\n✅ ${getTranslation('character.sheet.regular')}`;
      } else if (roll.fumble) {
        message += `\n💀 ${getTranslation('character.sheet.fumble')}`;
      } else if (roll.failure) {
        message += `\n❌ ${getTranslation('character.sheet.failure')}`;
      }
    }
    alert(message);
  }

  // Save character state without recalculating derived attributes
  saveCharacterState() {
    if (this.character) {
      this.characterService.updateCharacter(this.character.id, this.character);
    }
  }

  // Methods for managing temporary modifiers
  getEffectiveMaximum(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints'): number {
    if (!this.character) return 0;
    return this.characterService.getEffectiveMaximum(this.character, type);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}