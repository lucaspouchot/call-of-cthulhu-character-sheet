import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { DiceRollingService } from '../../services/dice-rolling.service';
import { EntityTranslationService } from '../../services/entity-translation.service';
import { CharacterSheet as CharacterModel, Sex, Skill, TemporaryModifier } from '../../models/character.model';
import { DiceRoll } from '../../models/dice.model';
import { OCCUPATIONS } from '../../models/skills.model';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { DynamicTranslatePipe } from '../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule, FormsModule, LanguageSwitcherComponent, DynamicTranslatePipe],
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

  // Editing modes
  editMode = {
    basicInfo: false,
    attributes: false,
    skills: false,
    combat: false,
    personal: false
  };

  // Modifier management
  showModifiers = {
    hitPoints: false,
    sanity: false,
    magicPoints: false,
    luck: false
  };

  newModifier = {
    hitPoints: { name: '', value: 0, description: '' },
    sanity: { name: '', value: 0, description: '' },
    magicPoints: { name: '', value: 0, description: '' },
    luck: { name: '', value: 0, description: '' }
  };

  // Store original values for cancel functionality
  originalCharacter: CharacterModel | null = null;

  // Show recalculation notification
  showRecalculationNotice = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private diceService: DiceRollingService,
    private entityTranslationService: EntityTranslationService
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

  loadCharacter(id: string) {
    const character = this.characterService.getCharacterById(id);
    this.character = character || null;
    if (!this.character) {
      this.router.navigate(['/']);
    }
  }

  toggleEditMode(section: keyof typeof this.editMode) {
    if (this.editMode[section]) {
      this.saveCharacter();
    } else {
      // Store original values before editing
      this.originalCharacter = this.character ? JSON.parse(JSON.stringify(this.character)) : null;
      this.editMode[section] = true;
    }
  }

  cancelEdit(section: keyof typeof this.editMode) {
    if (this.originalCharacter && this.character) {
      // Restore original values
      this.character = JSON.parse(JSON.stringify(this.originalCharacter));
    }
    this.editMode[section] = false;
    this.originalCharacter = null;
  }

  setAttributeValue(attrName: string, value: number) {
    if (!this.character) return;
    const attr = (this.character as any)[attrName];
    if (attr) {
      attr.value = value;
      attr.halfValue = Math.floor(value / 2);
      attr.fifthValue = Math.floor(value / 5);

      // Recalculate derived attributes immediately
      this.recalculateDerivedAttributes();

      // Show notification briefly
      this.showRecalculationNotice = true;
      setTimeout(() => {
        this.showRecalculationNotice = false;
      }, 2000);
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
      // Turn off all edit modes
      Object.keys(this.editMode).forEach(key => {
        this.editMode[key as keyof typeof this.editMode] = false;
      });
    }
  }

  // Method to handle age changes (called when age is modified in personal details)
  onAgeChange() {
    if (this.character) {
      this.recalculateDerivedAttributes();
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
    // Simple alert for now - could be enhanced with a proper modal
    let message = `${roll.description}\nRolled: ${roll.result}`;
    if (roll.target) {
      message += ` vs ${roll.target}%`;
      if (roll.criticalSuccess) {
        message += '\n🎯 CRITICAL SUCCESS!';
      } else if (roll.success) {
        message += '\n✅ SUCCESS';
      } else if (roll.fumble) {
        message += '\n💀 FUMBLE!';
      } else if (roll.criticalFailure) {
        message += '\n❌ CRITICAL FAILURE';
      } else {
        message += '\n❌ FAILURE';
      }
    }
    alert(message);
  }

  adjustSanity(amount: number) {
    if (this.character) {
      const effectiveMax = this.getEffectiveMaximum('sanity');
      this.character.sanity.current = Math.max(0,
        Math.min(effectiveMax, this.character.sanity.current + amount)
      );
      this.saveCharacterState();
    }
  }

  adjustHitPoints(amount: number) {
    if (this.character) {
      const effectiveMax = this.getEffectiveMaximum('hitPoints');
      this.character.hitPoints.current = Math.max(0,
        Math.min(effectiveMax, this.character.hitPoints.current + amount)
      );
      this.saveCharacterState();
    }
  }

  adjustMagicPoints(amount: number) {
    if (this.character) {
      const effectiveMax = this.getEffectiveMaximum('magicPoints');
      this.character.magicPoints.current = Math.max(0,
        Math.min(effectiveMax, this.character.magicPoints.current + amount)
      );
      this.saveCharacterState();
    }
  }

  adjustLuck(amount: number) {
    if (this.character) {
      const effectiveMax = this.getEffectiveMaximum('luck');
      this.character.luck.current = Math.max(0,
        Math.min(effectiveMax, this.character.luck.current + amount)
      );
      this.saveCharacterState();
    }
  }

  // Save character state without recalculating derived attributes
  saveCharacterState() {
    if (this.character) {
      this.characterService.updateCharacter(this.character.id, this.character);
    }
  }

  getHealthPercentage(): number {
    if (!this.character) return 0;
    const effectiveMax = this.getEffectiveMaximum('hitPoints');
    return effectiveMax > 0 ? (this.character.hitPoints.current / effectiveMax) * 100 : 0;
  }

  getSanityPercentage(): number {
    if (!this.character) return 0;
    const effectiveMax = this.getEffectiveMaximum('sanity');
    return effectiveMax > 0 ? (this.character.sanity.current / effectiveMax) * 100 : 0;
  }

  getMagicPointsPercentage(): number {
    if (!this.character) return 0;
    const effectiveMax = this.getEffectiveMaximum('magicPoints');
    return effectiveMax > 0 ? (this.character.magicPoints.current / effectiveMax) * 100 : 0;
  }

  // Methods for managing temporary modifiers
  getEffectiveMaximum(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints'): number {
    if (!this.character) return 0;
    return this.characterService.getEffectiveMaximum(this.character, type);
  }

  toggleModifierView(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints') {
    this.showModifiers[type] = !this.showModifiers[type];
  }

  addModifier(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints') {
    if (!this.character || !this.newModifier[type].name.trim()) return;

    this.characterService.addModifier(this.character.id, type, {
      name: this.newModifier[type].name.trim(),
      value: this.newModifier[type].value,
      description: this.newModifier[type].description.trim()
    });

    // Reset form
    this.newModifier[type] = { name: '', value: 0, description: '' };

    // Reload character to get updated modifiers
    this.loadCharacter(this.character.id);
  }

  removeModifier(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints', modifierId: string) {
    if (!this.character) return;

    this.characterService.removeModifier(this.character.id, type, modifierId);

    // Reload character to get updated modifiers
    this.loadCharacter(this.character.id);
  }

  getModifiersSum(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints'): number {
    if (!this.character) return 0;
    return (this.character[type].modifiers || []).reduce((sum, mod) => sum + mod.value, 0);
  }

  deleteCharacter() {
    if (this.character && confirm('Are you sure you want to delete this character?')) {
      this.characterService.deleteCharacter(this.character.id);
      this.router.navigate(['/']);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getAttributeValue(attrName: string): number {
    if (!this.character) return 0;
    const attr = (this.character as any)[attrName];
    return attr?.value || 0;
  }

  getAttributeHalfValue(attrName: string): number {
    if (!this.character) return 0;
    const attr = (this.character as any)[attrName];
    return attr?.halfValue || 0;
  }

  getAttributeFifthValue(attrName: string): number {
    if (!this.character) return 0;
    const attr = (this.character as any)[attrName];
    return attr?.fifthValue || 0;
  }

  getAttributeNames(): string[] {
    return ['strength', 'constitution', 'power', 'dexterity', 'appearance', 'size', 'intelligence', 'education'];
  }
}
