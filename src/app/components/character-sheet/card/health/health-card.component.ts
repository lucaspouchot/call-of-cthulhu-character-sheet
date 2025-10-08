import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent } from '../base-card.component';
import { TemporaryModifier } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { CharacterService } from '../../../../services/character.service';
import { DiceRollingService } from '../../../../services/dice-rolling.service';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { InjuryRulesComponent } from '../../../shared/injury-rules/injury-rules.component';

@Component({
  selector: 'app-health-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTranslatePipe, ModalComponent, InjuryRulesComponent],
  templateUrl: './health-card.component.html',
  styleUrl: './health-card.component.css'
})
export class HealthCardComponent extends BaseCardComponent {
  @Output() rollSanityCheck = new EventEmitter<void>();

  showRulesModal = false;

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

  constructor(
    private characterService: CharacterService,
    private diceService: DiceRollingService
  ) {
    super();
  }

  protected getSectionName(): string {
    return 'health';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = {
        hitPoints: { ...this.character.hitPoints, modifiers: [...(this.character.hitPoints.modifiers || [])] },
        sanity: { ...this.character.sanity, modifiers: [...(this.character.sanity.modifiers || [])] },
        magicPoints: { ...this.character.magicPoints, modifiers: [...(this.character.magicPoints.modifiers || [])] },
        luck: { ...this.character.luck, modifiers: [...(this.character.luck.modifiers || [])] },
        healthStatus: { ...this.character.healthStatus }
      };
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.hitPoints = { ...this.originalData.hitPoints };
      this.character.sanity = { ...this.originalData.sanity };
      this.character.magicPoints = { ...this.originalData.magicPoints };
      this.character.luck = { ...this.originalData.luck };
      this.character.healthStatus = { ...this.originalData.healthStatus };
    }
  }

  // Override cancel to close modifiers
  override cancelEdit(): void {
    super.cancelEdit();
    this.showModifiers.hitPoints = false;
    this.showModifiers.sanity = false;
    this.showModifiers.magicPoints = false;
    this.showModifiers.luck = false;
  }

  override toggleEditMode(): void {
    super.toggleEditMode();
    this.showModifiers.hitPoints = true;
    this.showModifiers.sanity = true;
    this.showModifiers.magicPoints = true;
    this.showModifiers.luck = true;
  }

  override saveCharacterData(): void {
    super.saveCharacterData();
    this.showModifiers.hitPoints = false;
    this.showModifiers.sanity = false;
    this.showModifiers.magicPoints = false;
    this.showModifiers.luck = false;
  }

  adjustValue(type: 'hitPoints' | 'sanity' | 'magicPoints' | 'luck', amount: number): void {
    if (this.character) {
      const effectiveMax = this.getEffectiveMaximum(type);
      this.character[type].current = Math.max(0,
        Math.min(effectiveMax, this.character[type].current + amount)
      );
      this.characterChange.emit(this.character);
    }
  }

  getEffectiveMaximum(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints'): number {
    if (!this.character) return 0;
    return this.characterService.getEffectiveMaximum(this.character, type);
  }

  getPercentage(type: 'hitPoints' | 'sanity' | 'magicPoints'): number {
    if (!this.character) return 0;
    const effectiveMax = this.getEffectiveMaximum(type);
    return effectiveMax > 0 ? (this.character[type].current / effectiveMax) * 100 : 0;
  }

  addModifier(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints'): void {
    if (!this.character || !this.newModifier[type].name.trim()) return;

    const modifier: TemporaryModifier = {
      id: Date.now().toString(),
      name: this.newModifier[type].name.trim(),
      value: this.newModifier[type].value,
      description: this.newModifier[type].description.trim(),
      createdAt: new Date()
    };

    if (!this.character[type].modifiers) {
      this.character[type].modifiers = [];
    }
    this.character[type].modifiers.push(modifier);

    // Reset form
    this.newModifier[type] = { name: '', value: 0, description: '' };

    this.characterChange.emit(this.character);
  }

  removeModifier(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints', modifierId: string): void {
    if (!this.character) return;

    if (this.character[type].modifiers) {
      this.character[type].modifiers = this.character[type].modifiers.filter(mod => mod.id !== modifierId);
    }

    this.characterChange.emit(this.character);
  }

  getModifiersSum(type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints'): number {
    if (!this.character) return 0;
    return (this.character[type].modifiers || []).reduce((sum, mod) => sum + mod.value, 0);
  }

  onSanityClick(): void {
    this.rollSanityCheck.emit();
  }

  toggleRulesModal(): void {
    this.showRulesModal = !this.showRulesModal;
  }

  onCloseRulesModal(): void {
    this.showRulesModal = false;
  }

  toggleHealthStatus(status: 'unconscious' | 'dying' | 'majorInjury' | 'temporaryInsanity' | 'indefiniteInsanity'): void {
    if (this.character) {
      this.character.healthStatus[status] = !this.character.healthStatus[status];
      this.characterChange.emit(this.character);
    }
  }

  setConsciousnessStatus(status: 'normal' | 'unconscious' | 'dying'): void {
    if (this.character) {
      this.character.healthStatus.unconscious = status === 'unconscious';
      this.character.healthStatus.dying = status === 'dying';
      this.characterChange.emit(this.character);
    }
  }

  setInsanityStatus(status: 'none' | 'temporary' | 'indefinite'): void {
    if (this.character) {
      this.character.healthStatus.temporaryInsanity = status === 'temporary';
      this.character.healthStatus.indefiniteInsanity = status === 'indefinite';
      this.characterChange.emit(this.character);
    }
  }
}