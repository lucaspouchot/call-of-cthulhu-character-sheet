import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { DiceRollingService } from '../../services/dice-rolling.service';
import { TranslationService } from '../../services/translation.service';
import { CharacterSheet as CharacterModel, Sex, Skill } from '../../models/character.model';
import { DiceRoll } from '../../models/dice.model';
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

  // Editing modes
  editMode = {
    basicInfo: false,
    attributes: false,
    skills: false,
    combat: false,
    personal: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private diceService: DiceRollingService,
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

  loadCharacter(id: string) {
    const character = this.characterService.getCharacterById(id);
    this.character = character || null;
    if (!this.character) {
      this.router.navigate(['/']);
    }
  }

  toggleEditMode(section: keyof typeof this.editMode) {
    this.editMode[section] = !this.editMode[section];
  }

  getSkillTranslation(skill: Skill): string {
    const translationKey = `character.creation.skills.${skill.id}`;
    return this.translationService.getTranslation(translationKey) || skill.id;
  }

  getSexTranslation(sex: Sex): string {
    const translationKey = `character.creation.options.sex.${sex}`;
    return this.translationService.getTranslation(translationKey) || sex;
  }

  getOccupationName(occupationId: string): string {
    const translationKey = `character.creation.occupation.preset.${occupationId}.name`;
    return this.translationService.getTranslation(translationKey) || occupationId;
  }

  saveCharacter() {
    if (this.character) {
      this.characterService.updateCharacter(this.character.id, this.character);
      // Turn off all edit modes
      Object.keys(this.editMode).forEach(key => {
        this.editMode[key as keyof typeof this.editMode] = false;
      });
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
      this.character.sanity.current = Math.max(0,
        Math.min(this.character.sanity.maximum, this.character.sanity.current + amount)
      );
      this.saveCharacter();
    }
  }

  adjustHitPoints(amount: number) {
    if (this.character) {
      this.character.hitPoints.current = Math.max(0,
        Math.min(this.character.hitPoints.maximum, this.character.hitPoints.current + amount)
      );
      this.saveCharacter();
    }
  }

  adjustMagicPoints(amount: number) {
    if (this.character) {
      this.character.magicPoints.current = Math.max(0,
        Math.min(this.character.magicPoints.maximum, this.character.magicPoints.current + amount)
      );
      this.saveCharacter();
    }
  }

  adjustLuck(amount: number) {
    if (this.character) {
      this.character.luck.current = Math.max(0, this.character.luck.current + amount);
      this.saveCharacter();
    }
  }

  getHealthPercentage(): number {
    if (!this.character) return 0;
    return (this.character.hitPoints.current / this.character.hitPoints.maximum) * 100;
  }

  getSanityPercentage(): number {
    if (!this.character) return 0;
    return (this.character.sanity.current / this.character.sanity.maximum) * 100;
  }

  getMagicPointsPercentage(): number {
    if (!this.character) return 0;
    return (this.character.magicPoints.current / this.character.magicPoints.maximum) * 100;
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
