import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent } from '../base-card.component';
import { Skill } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { EntityTranslationService } from '../../../../services/entity-translation.service';
import { DiceRollingService } from '../../../../services/dice-rolling.service';
import { SkillManagementService } from '../../../../services/skill-management.service';
import { SKILL_DEFINITIONS } from '../../../../models/skill-definitions.model';
import { SkillSelectorComponent } from '../../../shared/skill-selector/skill-selector.component';

@Component({
  selector: 'app-skills-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTranslatePipe, SkillSelectorComponent],
  templateUrl: './skills-card.component.html',
  styleUrl: './skills-card.component.css'
})
export class SkillsCardComponent extends BaseCardComponent {
  @Output() rollSkillCheck = new EventEmitter<Skill>();

  // Skill modifier management
  showSkillModifiers: { [skillId: string]: boolean } = {};
  newSkillModifier: { [skillId: string]: { name: string, value: number } } = {};

  constructor(
    private entityTranslationService: EntityTranslationService,
    private diceService: DiceRollingService,
    private skillManagementService: SkillManagementService
  ) {
    super();
  }

  protected getSectionName(): string {
    return 'skills';
  }

  /**
   * Get skills to display - filters out specialized skills with no points
   */
  getDisplayedSkills(): Skill[] {
    if (!this.character) {
      return [];
    }

    return this.character.skills;
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = this.character.skills.map(skill => ({
        ...skill,
        modifiers: [...(skill.modifiers || [])]
      }));
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.skills = this.originalData.map((skill: any) => ({
        ...skill,
        modifiers: [...(skill.modifiers || [])]
      }));
    }
  }

  // Override cancel to close modifiers
  override cancelEdit(): void {
    super.cancelEdit();
    this.showSkillModifiers = {};
  }

  getSkillTranslation(skill: Skill): string {
    return this.entityTranslationService.getSkillTranslation(skill);
  }

  onSkillClick(skill: Skill): void {
    if (!this.isInEditMode()) {
      this.rollSkillCheck.emit(skill);
    }
  }

  // Skill modifier methods
  toggleSkillModifierView(skillId: string): void {
    // Don't allow closing in skills edit mode
    if (this.isInEditMode()) {
      return;
    }

    this.showSkillModifiers[skillId] = !this.showSkillModifiers[skillId];

    // Initialize the new modifier object for this skill if it doesn't exist
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
  }

  addSkillModifier(skillId: string): void {
    if (!this.character || !this.newSkillModifier[skillId]?.name.trim()) return;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return;

    // Initialize modifiers array if it doesn't exist
    if (!skill.modifiers) {
      skill.modifiers = [];
    }

    // Add the new modifier
    skill.modifiers.push({
      id: Date.now().toString(),
      name: this.newSkillModifier[skillId].name.trim(),
      value: this.newSkillModifier[skillId].value,
      createdAt: new Date()
    });

    // Recalculate total value
    this.recalculateSkillTotal(skillId);

    // Reset form
    this.newSkillModifier[skillId] = { name: '', value: 0 };

    this.characterChange.emit(this.character);
  }

  removeSkillModifier(skillId: string, modifierIdentifier: string | 'occupation' | 'personal'): void {
    if (!this.character) return;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return;

    // Prevent removal of occupation and personal points
    if (modifierIdentifier === 'occupation' || modifierIdentifier === 'personal') {
      console.warn('Cannot remove occupation or personal skill points - they are permanent');
      return;
    }

    // Only remove temporary modifiers
    if (skill.modifiers) {
      skill.modifiers = skill.modifiers.filter(mod => mod.id !== modifierIdentifier);
    }

    // Recalculate total value
    this.recalculateSkillTotal(skillId);

    this.characterChange.emit(this.character);
  }

  getSkillModifiersSum(skillId: string): number {
    if (!this.character) return 0;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return 0;

    let sum = skill.occupationValue + skill.personalValue;
    if (skill.modifiers) {
      sum += skill.modifiers.reduce((total, mod) => total + mod.value, 0);
    }

    return sum;
  }

  private recalculateSkillTotal(skillId: string): void {
    if (!this.character) return;

    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return;

    skill.totalValue = skill.baseValue + skill.occupationValue + skill.personalValue;
    if (skill.modifiers) {
      skill.totalValue += skill.modifiers.reduce((sum, mod) => sum + mod.value, 0);
    }
  }

  // Getter/Setter methods for new skill modifier form
  getNewSkillModifierName(skillId: string): string {
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
    return this.newSkillModifier[skillId].name;
  }

  setNewSkillModifierName(skillId: string, name: string): void {
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
    this.newSkillModifier[skillId].name = name;
  }

  getNewSkillModifierValue(skillId: string): number {
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
    return this.newSkillModifier[skillId].value;
  }

  setNewSkillModifierValue(skillId: string, value: number): void {
    if (!this.newSkillModifier[skillId]) {
      this.newSkillModifier[skillId] = { name: '', value: 0 };
    }
    this.newSkillModifier[skillId].value = value;
  }

  /**
   * Get existing skill IDs to prevent duplicates
   */
  getExistingSkillIds(): string[] {
    if (!this.character) {
      return [];
    }
    return this.character.skills.map(s => s.id);
  }

  /**
   * Handle skill added from skill selector component
   */
  onSkillAddedFromSelector(skill: Skill): void {
    if (!this.character) {
      return;
    }

    // Check if skill already exists
    const existing = this.character.skills.find(s => s.id === skill.id);
    if (existing) {
      console.error('Skill already exists');
      return;
    }

    // Add skill to character
    this.character.skills.push(skill);

    // Emit change
    this.characterChange.emit(this.character);
  }
}
