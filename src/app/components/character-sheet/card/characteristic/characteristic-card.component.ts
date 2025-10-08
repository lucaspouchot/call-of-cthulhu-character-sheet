import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent, CardEditMode } from '../base-card.component';
import { CharacterSheet as CharacterModel } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { DiceRollingService } from '../../../../services/dice-rolling.service';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { SkillTestRulesComponent } from '../../../shared/skill-test-rules/skill-test-rules.component';

@Component({
  selector: 'app-characteristic-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTranslatePipe, ModalComponent, SkillTestRulesComponent],
  templateUrl: './characteristic-card.component.html',
  styleUrl: './characteristic-card.component.css'
})
export class CharacteristicCardComponent extends BaseCardComponent {
  @Input() showRecalculationNotice = false;
  @Output() rollCharacteristicCheck = new EventEmitter<{ attribute: string, value: number }>();

  showRulesModal = false;

  constructor(private diceService: DiceRollingService) {
    super();
  }

  protected getSectionName(): string {
    return 'attributes';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = {
        strength: { ...this.character.strength },
        constitution: { ...this.character.constitution },
        power: { ...this.character.power },
        dexterity: { ...this.character.dexterity },
        appearance: { ...this.character.appearance },
        size: { ...this.character.size },
        intelligence: { ...this.character.intelligence },
        education: { ...this.character.education }
      };
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.strength = { ...this.originalData.strength };
      this.character.constitution = { ...this.originalData.constitution };
      this.character.power = { ...this.originalData.power };
      this.character.dexterity = { ...this.originalData.dexterity };
      this.character.appearance = { ...this.originalData.appearance };
      this.character.size = { ...this.originalData.size };
      this.character.intelligence = { ...this.originalData.intelligence };
      this.character.education = { ...this.originalData.education };
    }
  }

  getAttributeNames(): string[] {
    return ['strength', 'constitution', 'power', 'dexterity', 'appearance', 'size', 'intelligence', 'education'];
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

  setAttributeValue(attrName: string, value: number): void {
    if (!this.character) return;
    const attr = (this.character as any)[attrName];
    if (attr) {
      attr.value = value;
      attr.halfValue = Math.floor(value / 2);
      attr.fifthValue = Math.floor(value / 5);

      this.characterChange.emit(this.character);
    }
  }

  onAttributeClick(attr: string): void {
    if (!this.isInEditMode()) {
      this.rollCharacteristicCheck.emit({
        attribute: attr,
        value: this.getAttributeValue(attr)
      });
    }
  }

  toggleRulesModal(): void {
    this.showRulesModal = !this.showRulesModal;
  }

  onCloseRulesModal(): void {
    this.showRulesModal = false;
  }
}