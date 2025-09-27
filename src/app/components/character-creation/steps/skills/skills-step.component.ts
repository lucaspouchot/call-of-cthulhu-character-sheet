import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { CharacterSheetCreate, StepValidation, Skill } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { DEFAULT_SKILLS, OCCUPATIONS, Occupation, SkillPointFormula } from '../../../../models/skills.model';

@Component({
  selector: 'app-skills-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicTranslatePipe],
  templateUrl: './skills-step.component.html',
  styleUrls: ['./skills-step.component.css']
})
export class SkillsStepComponent implements OnInit, OnDestroy {
  @Input() characterSheet!: CharacterSheetCreate;
  @Output() characterSheetChange = new EventEmitter<CharacterSheetCreate>();
  @Output() stepValidation = new EventEmitter<StepValidation>();

  private destroy$ = new Subject<void>();

  occupationPoints = 0;
  personalPoints = 0;
  occupationPointsSpent = 0;
  personalPointsSpent = 0;

  skills: Skill[] = [];
  occupationSkills: Skill[] = [];
  otherSkills: Skill[] = [];
  currentOccupation?: Occupation;

  constructor() { }

  ngOnInit(): void {
    this.initializeSkills();
    this.calculateSkillPoints();
    this.validateStep();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private validateStep(): void {
    const errors: string[] = [];

    // Check if we have the required data
    if (!this.currentOccupation) {
      errors.push('skills.validation.occupation.required');
    }

    // Check occupation points
    if (this.occupationPointsSpent > this.occupationPoints) {
      errors.push('skills.validation.occupation.overspent');
    }

    // Check personal points
    if (this.personalPointsSpent > this.personalPoints) {
      errors.push('skills.validation.personal.overspent');
    }

    // For completion, all points should be spent (or at least most of them)
    const occupationPointsUsed = this.occupationPointsSpent / this.occupationPoints;
    const personalPointsUsed = this.personalPointsSpent / this.personalPoints;

    const isValid = errors.length === 0 &&
      this.occupationPointsSpent <= this.occupationPoints &&
      this.personalPointsSpent <= this.personalPoints &&
      occupationPointsUsed >= 0.9 && // Allow some flexibility
      personalPointsUsed >= 0.9;

    this.stepValidation.emit({
      isValid: isValid,
      errors: errors
    });
  }

  getRemainingOccupationPoints(): number {
    return this.occupationPoints - this.occupationPointsSpent;
  }

  getRemainingPersonalPoints(): number {
    return this.personalPoints - this.personalPointsSpent;
  }

  isOccupationOverspent(): boolean {
    return this.occupationPointsSpent > this.occupationPoints;
  }

  isPersonalOverspent(): boolean {
    return this.personalPointsSpent > this.personalPoints;
  }

  private initializeSkills(): void {
    // Initialize skills from defaults or existing assignments
    this.skills = DEFAULT_SKILLS.map(skill => {
      const personalValue = this.characterSheet.skillAssignments?.[skill.id]?.personal || 0;
      const occupationValue = this.characterSheet.skillAssignments?.[skill.id]?.occupation || 0;

      // Calculate base value for special skills
      let baseValue = skill.baseValue;
      if (skill.id === 'dodge' && this.characterSheet.dexterity) {
        baseValue = Math.floor(this.characterSheet.dexterity.value / 2);
      } else if (skill.id === 'languageOwn' && this.characterSheet.education) {
        baseValue = this.characterSheet.education.value;
      }

      return {
        ...skill,
        baseValue,
        personalValue,
        occupationValue,
        totalValue: baseValue + personalValue + occupationValue
      };
    });

    // Find current occupation
    if (this.characterSheet.occupation) {
      this.currentOccupation = OCCUPATIONS.find(occ => occ.id === this.characterSheet.occupation);
    }

    // Separate occupation skills from others
    this.separateSkills();
  }

  private separateSkills(): void {
    if (!this.currentOccupation) {
      this.occupationSkills = [];
      this.otherSkills = [...this.skills].sort((a, b) => a.id.localeCompare(b.id));
      return;
    }

    const occupationSkillIds = new Set(this.currentOccupation.occupationSkills);

    this.occupationSkills = this.skills
      .filter(skill => occupationSkillIds.has(skill.id))
      .sort((a, b) => a.id.localeCompare(b.id));

    this.otherSkills = this.skills
      .filter(skill => !occupationSkillIds.has(skill.id))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  private calculateSkillPoints(): void {
    if (!this.currentOccupation || !this.characterSheet.education || !this.characterSheet.intelligence) {
      return;
    }

    // Calculate occupation points
    this.occupationPoints = this.calculatePointsFromFormula(
      this.currentOccupation.occupationSkillPoints,
      this.characterSheet
    );

    // Calculate personal points
    this.personalPoints = this.calculatePointsFromFormula(
      this.currentOccupation.personalSkillPoints,
      this.characterSheet
    );

    // Calculate points already spent
    this.updateSpentPoints();
  }

  private calculatePointsFromFormula(formula: SkillPointFormula, character: CharacterSheetCreate): number {
    switch (formula.type) {
      case 'simple':
        return this.calculateSimpleFormula(formula.formulas[0], character);

      case 'choice':
        // Return the best option from the choices
        return Math.max(...formula.formulas.map(f => this.calculateSimpleFormula(f, character)));

      case 'composite':
        // Required formula + best choice formula
        const required = this.calculateSimpleFormula(formula.formulas[0], character);
        const choice = formula.choiceFormulas ?
          Math.max(...formula.choiceFormulas.map(f => this.calculateSimpleFormula(f, character))) : 0;
        return required + choice;

      default:
        return 0;
    }
  }

  private calculateSimpleFormula(formula: { attribute: string; multiplier: number }, character: CharacterSheetCreate): number {
    const attributeValue = this.getAttributeValueWithAgeModifiers(formula.attribute, character);
    return attributeValue * formula.multiplier;
  }

  private getAttributeValueWithAgeModifiers(attribute: string, character: CharacterSheetCreate): number {
    let baseValue = this.getAttributeValue(attribute, character);

    // Apply age modifiers if they exist
    if (character.ageModifiers) {
      switch (attribute) {
        case 'strength':
          baseValue = Math.max(0, baseValue - (character.ageModifiers.strengthReduction || 0));
          break;
        case 'constitution':
          baseValue = Math.max(0, baseValue - (character.ageModifiers.constitutionReduction || 0));
          break;
        case 'dexterity':
          baseValue = Math.max(0, baseValue - (character.ageModifiers.dexterityReduction || 0));
          break;
        case 'appearance':
          baseValue = Math.max(0, baseValue - (character.ageModifiers.appearanceReduction || 0));
          break;
        case 'size':
          baseValue = Math.max(0, baseValue - (character.ageModifiers.sizeReduction || 0));
          break;
        case 'education':
          const educationModifier = (character.ageModifiers.educationBonus || 0) - (character.ageModifiers.educationReduction || 0);
          baseValue = Math.max(0, baseValue + educationModifier);
          break;
        // Intelligence and Power are not affected by age
      }
    }

    return baseValue;
  }

  private getAttributeValue(attribute: string, character: CharacterSheetCreate): number {
    switch (attribute) {
      case 'strength': return character.strength?.value || 0;
      case 'constitution': return character.constitution?.value || 0;
      case 'dexterity': return character.dexterity?.value || 0;
      case 'appearance': return character.appearance?.value || 0;
      case 'size': return character.size?.value || 0;
      case 'intelligence': return character.intelligence?.value || 0;
      case 'power': return character.power?.value || 0;
      case 'education': return character.education?.value || 0;
      default: return 0;
    }
  }

  private updateSpentPoints(): void {
    this.occupationPointsSpent = this.skills.reduce((sum, skill) => sum + skill.occupationValue, 0);
    this.personalPointsSpent = this.skills.reduce((sum, skill) => sum + skill.personalValue, 0);
  }

  onOccupationPointsChange(skillId: string, value: number): void {
    const skill = this.skills.find(s => s.id === skillId);
    if (!skill) return;

    skill.occupationValue = Math.max(0, value);
    this.updateSkillTotal(skill);

    this.updateSpentPoints();
    this.updateCharacterSheet();
    this.validateStep();
  }

  onPersonalPointsChange(skillId: string, value: number): void {
    const skill = this.skills.find(s => s.id === skillId);
    if (!skill) return;

    skill.personalValue = Math.max(0, value);
    this.updateSkillTotal(skill);

    this.updateSpentPoints();
    this.updateCharacterSheet();
    this.validateStep();
  }

  private updateSkillTotal(skill: Skill): void {
    // Recalculate base value for special skills
    let baseValue = skill.baseValue;
    if (skill.id === 'dodge' && this.characterSheet.dexterity) {
      baseValue = Math.floor(this.characterSheet.dexterity.value / 2);
    } else if (skill.id === 'languageOwn' && this.characterSheet.education) {
      baseValue = this.characterSheet.education.value;
    }

    skill.baseValue = baseValue;
    skill.totalValue = baseValue + skill.personalValue + skill.occupationValue;
  }

  private updateCharacterSheet(): void {
    if (!this.characterSheet.skillAssignments) {
      this.characterSheet.skillAssignments = {};
    }

    this.skills.forEach(skill => {
      this.characterSheet.skillAssignments![skill.id] = {
        occupation: skill.occupationValue,
        personal: skill.personalValue
      };
    });

    this.characterSheetChange.emit(this.characterSheet);
  }

  canAllocateOccupationPoints(skillId: string): boolean {
    if (!this.currentOccupation) return false;
    return this.currentOccupation.occupationSkills.includes(skillId);
  }

  getMaxOccupationPoints(skillId: string): number {
    const skill = this.skills.find(s => s.id === skillId);
    if (!skill || !this.canAllocateOccupationPoints(skillId)) return 0;

    const remaining = this.getRemainingOccupationPoints();
    return remaining + skill.occupationValue;
  }

  getMaxPersonalPoints(skillId: string): number {
    const skill = this.skills.find(s => s.id === skillId);
    if (!skill) return 0;

    const remaining = this.getRemainingPersonalPoints();
    return remaining + skill.personalValue;
  }

  getOccupationPointsFormula(): string {
    if (!this.currentOccupation) return '';
    return this.generateFormulaDisplay(this.currentOccupation.occupationSkillPoints);
  }

  getPersonalPointsFormula(): string {
    if (!this.currentOccupation) return '';
    return this.generateFormulaDisplay(this.currentOccupation.personalSkillPoints);
  }

  private generateFormulaDisplay(formula: SkillPointFormula): string {
    switch (formula.type) {
      case 'simple':
        return this.generateSimpleFormulaDisplay(formula.formulas[0]);

      case 'choice':
        const choices = formula.formulas.map(f => this.generateSimpleFormulaDisplay(f));
        return choices.join(' ou ');

      case 'composite':
        const required = this.generateSimpleFormulaDisplay(formula.formulas[0]);
        if (formula.choiceFormulas) {
          const choices = formula.choiceFormulas.map(f => this.generateSimpleFormulaDisplay(f));
          return `${required} + (${choices.join(' ou ')})`;
        }
        return required;

      default:
        return '';
    }
  }

  private generateSimpleFormulaDisplay(formula: { attribute: string; multiplier: number }): string {
    const attributeValue = this.getAttributeValueWithAgeModifiers(formula.attribute, this.characterSheet);
    const attributeName = this.getAttributeDisplayName(formula.attribute);
    return `${attributeName} (${attributeValue}) × ${formula.multiplier}`;
  }

  private getAttributeDisplayName(attribute: string): string {
    switch (attribute) {
      case 'strength': return 'Force';
      case 'constitution': return 'Constitution';
      case 'dexterity': return 'Dextérité';
      case 'appearance': return 'Apparence';
      case 'size': return 'Taille';
      case 'intelligence': return 'Intelligence';
      case 'power': return 'Pouvoir';
      case 'education': return 'Éducation';
      default: return attribute;
    }
  }

  getOccupationFormulaChips(): Array<{ text: string, value: number, type?: 'required' | 'choice' | 'simple', isFirst?: boolean, isLast?: boolean }> {
    if (!this.currentOccupation) return [];
    return this.generateFormulaChips(this.currentOccupation.occupationSkillPoints);
  }

  getPersonalFormulaChips(): Array<{ text: string, value: number, type?: 'required' | 'choice' | 'simple', isFirst?: boolean, isLast?: boolean }> {
    if (!this.currentOccupation) return [];
    return this.generateFormulaChips(this.currentOccupation.personalSkillPoints);
  }

  private generateFormulaChips(formula: SkillPointFormula): Array<{ text: string, value: number, type?: 'required' | 'choice' | 'simple', isFirst?: boolean, isLast?: boolean }> {
    const chips: Array<{ text: string, value: number, type?: 'required' | 'choice' | 'simple', isFirst?: boolean, isLast?: boolean }> = [];

    switch (formula.type) {
      case 'simple':
        chips.push({ ...this.generateSimpleFormulaChip(formula.formulas[0]), type: 'simple' });
        break;

      case 'choice':
        // For choice, show all options but highlight the best one
        const values = formula.formulas.map(f => this.calculateSimpleFormula(f, this.characterSheet));
        const maxValue = Math.max(...values);
        formula.formulas.forEach((f, index) => {
          const chip = this.generateSimpleFormulaChip(f);
          chip.text += values[index] === maxValue ? ' ✓' : '';
          chips.push({
            ...chip,
            type: 'choice',
            isFirst: index === 0,
            isLast: index === formula.formulas.length - 1
          });
        });
        break;

      case 'composite':
        // Required part
        chips.push({ ...this.generateSimpleFormulaChip(formula.formulas[0]), type: 'required' });

        // Choice part
        if (formula.choiceFormulas && formula.choiceFormulas.length > 0) {
          const choiceValues = formula.choiceFormulas.map(f => this.calculateSimpleFormula(f, this.characterSheet));
          const maxChoiceValue = Math.max(...choiceValues);
          formula.choiceFormulas.forEach((f, index) => {
            const chip = this.generateSimpleFormulaChip(f);
            chip.text += choiceValues[index] === maxChoiceValue ? ' ✓' : '';
            chips.push({
              ...chip,
              type: 'choice',
              isFirst: index === 0,
              isLast: index === formula.choiceFormulas!.length - 1
            });
          });
        }
        break;
    }

    return chips;
  }

  private generateSimpleFormulaChip(formula: { attribute: string; multiplier: number }): { text: string, value: number } {
    const attributeValue = this.getAttributeValueWithAgeModifiers(formula.attribute, this.characterSheet);
    const attributeName = this.getAttributeDisplayName(formula.attribute);
    const calculatedValue = attributeValue * formula.multiplier;

    return {
      text: `${attributeName} (${attributeValue}) × ${formula.multiplier}`,
      value: calculatedValue
    };
  }
}