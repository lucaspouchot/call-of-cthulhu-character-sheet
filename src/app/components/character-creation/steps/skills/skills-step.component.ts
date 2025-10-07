import { EntityTranslationService } from './../../../../services/entity-translation.service';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { CharacterSheetCreate, StepValidation, Skill } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { DEFAULT_SKILLS } from '../../../../models/skills.model';
import { OCCUPATIONS, Occupation, SkillPointFormula, OccupationSkillSpec } from '../../../../models/occupation.model';
import { TranslationService } from '../../../../services/translation.service';
import { SkillManagementService } from '../../../../services/skill-management.service';
import { SkillSelectorComponent } from '../../../shared/skill-selector/skill-selector.component';

@Component({
  selector: 'app-skills-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicTranslatePipe, SkillSelectorComponent],
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
  selectedCreditRating = 0;

  // New: Track user choices for occupation skills
  choiceSpecs: Array<{ count: number; options: string[]; index: number }> = [];
  selectedChoiceSkills: { [choiceIndex: number]: string[] } = {};

  specializationSpecs: Array<{
    baseSkillId: string;
    suggestedSpecializations?: string[];
    allowCustom: boolean;
    index: number;
  }> = [];
  selectedSpecializations: { [specIndex: number]: string } = {}; // Maps spec index to selected skill ID
  customSpecializationNames: { [specIndex: number]: string } = {}; // For custom specializations

  // Mixed choice specs: choice between simple skills and specializations
  mixedChoiceSpecs: Array<{
    count: number;
    options: Array<
      | string
      | { type: 'specialization'; baseSkillId: string; suggestedSpecializations?: string[]; allowCustom: boolean }
    >;
    index: number;
  }> = [];
  selectedMixedChoices: {
    [mixedChoiceIndex: number]: {
      selectedOption: string | { type: 'specialization'; baseSkillId: string };
      skillId?: string; // For specializations, the actual selected skill ID
    }
  } = {};

  anySkillSpecs: Array<{ count: number; description?: string; index: number }> = [];
  selectedAnySkills: string[] = [];
  anySkillSearchTerm = '';
  anySkillCustomName = '';
  hiddenSkills: Set<string> = new Set<string>(['science', 'languageOther', 'pilot', 'artCraft', 'survival', 'creditRating']);

  constructor(
    private entityTranslationService: EntityTranslationService,
    private translationService: TranslationService,
    private skillManagementService: SkillManagementService
  ) { }

  ngOnInit(): void {
    this.initializeSkills();
    this.initializeCreditRating();
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

    // Initialize occupation skill specs
    this.initializeOccupationSpecs();

    // Separate occupation skills from others
    this.separateSkills();
  }

  private initializeOccupationSpecs(): void {
    if (!this.currentOccupation) {
      return;
    }

    // Reset specs
    this.choiceSpecs = [];
    this.specializationSpecs = [];
    this.anySkillSpecs = [];
    this.mixedChoiceSpecs = [];

    let choiceIndex = 0;
    let specIndex = 0;
    let anyIndex = 0;
    let mixedChoiceIndex = 0;

    // Parse occupation skill specs
    for (const spec of this.currentOccupation.occupationSkills) {
      if (typeof spec !== 'string') {
        if (spec.type === 'choice') {
          this.choiceSpecs.push({
            ...spec,
            index: choiceIndex++
          });
        } else if (spec.type === 'specialization') {
          this.specializationSpecs.push({
            ...spec,
            index: specIndex++
          });
        } else if (spec.type === 'any') {
          this.anySkillSpecs.push({
            ...spec,
            index: anyIndex++
          });
        } else if (spec.type === 'mixedChoice') {
          this.mixedChoiceSpecs.push({
            ...spec,
            index: mixedChoiceIndex++
          });
        }
      }
    }
  }

  private separateSkills(): void {
    if (!this.currentOccupation) {
      this.occupationSkills = [];
      this.otherSkills = [...this.skills].filter(skill => !this.hiddenSkills.has(skill.id)).sort((a, b) => a.id.localeCompare(b.id));
      return;
    }

    // Get direct occupation skill IDs
    const directSkillIds = this.skillManagementService.getDirectOccupationSkills(
      this.currentOccupation.occupationSkills
    );

    const occupationSkillIds = new Set<string>(directSkillIds);

    // Add selected choice skills
    for (const [choiceIndex, selectedSkills] of Object.entries(this.selectedChoiceSkills)) {
      selectedSkills.forEach(skillId => occupationSkillIds.add(skillId));
    }

    // Add selected specialization skills
    for (const skillId of Object.values(this.selectedSpecializations)) {
      if (skillId) {
        occupationSkillIds.add(skillId);
      }
    }

    // Add selected mixed choice skills
    for (const [mixedChoiceIndex, selection] of Object.entries(this.selectedMixedChoices)) {
      if (typeof selection.selectedOption === 'string') {
        // Simple skill selected
        occupationSkillIds.add(selection.selectedOption);
      } else if (selection.skillId) {
        // Specialization selected
        occupationSkillIds.add(selection.skillId);
      }
    }

    // Add selected 'any' skills
    this.selectedAnySkills.forEach(skillId => occupationSkillIds.add(skillId));

    this.occupationSkills = this.skills
      .filter(skill => !this.hiddenSkills.has(skill.id))
      .filter(skill => occupationSkillIds.has(skill.id))
      .sort((a, b) => a.id.localeCompare(b.id));

    this.otherSkills = this.skills
      .filter(skill => !this.hiddenSkills.has(skill.id))
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

    // Update credit rating
    this.characterSheet.creditRating = this.selectedCreditRating;

    // Save custom/specialized skills (those not in DEFAULT_SKILLS)
    const defaultSkillIds = new Set(DEFAULT_SKILLS.map(s => s.id));
    const customSkills = this.skills.filter(skill => !defaultSkillIds.has(skill.id)).map(skill => ({
      id: skill.id,
      baseValue: skill.baseValue,
      personalValue: skill.personalValue,
      occupationValue: skill.occupationValue,
      totalValue: skill.totalValue,
      parentSkillId: skill.parentSkillId,
      customName: skill.customName,
      isCustom: skill.isCustom,
      modifiers: skill.modifiers ? [...skill.modifiers] : undefined
    }));

    if (customSkills.length > 0) {
      this.characterSheet.customSkills = customSkills;
    } else {
      this.characterSheet.customSkills = [];
    }

    this.characterSheetChange.emit(this.characterSheet);
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

  // Credit Rating methods
  private initializeCreditRating(): void {
    if (this.currentOccupation) {
      // Initialize with existing value or minimum for occupation
      this.selectedCreditRating = this.characterSheet.creditRating || this.currentOccupation.creditRating.min;
      // Make sure to set it in the character sheet
      this.characterSheet.creditRating = this.selectedCreditRating;
      this.characterSheetChange.emit(this.characterSheet);
    }
  }

  onCreditRatingChange(value: number): void {
    this.selectedCreditRating = value;
    this.characterSheet.creditRating = value;
    this.characterSheetChange.emit(this.characterSheet);
    this.validateStep();
  }

  getCreditRatingLevel(): string {
    if (this.selectedCreditRating < 1) {
      return this.translationService.getTranslation('creditRating.levels.penniless.name');
    } else if (this.selectedCreditRating >= 1 && this.selectedCreditRating <= 9) {
      return this.translationService.getTranslation('creditRating.levels.poor.name');
    } else if (this.selectedCreditRating >= 10 && this.selectedCreditRating <= 49) {
      return this.translationService.getTranslation('creditRating.levels.average.name');
    } else if (this.selectedCreditRating >= 50 && this.selectedCreditRating <= 89) {
      return this.translationService.getTranslation('creditRating.levels.wealthy.name');
    } else if (this.selectedCreditRating >= 90 && this.selectedCreditRating <= 98) {
      return this.translationService.getTranslation('creditRating.levels.rich.name');
    } else { // >= 99
      return this.translationService.getTranslation('creditRating.levels.superRich.name');
    }
  }

  getCreditRatingDescription(): string {
    if (this.selectedCreditRating < 1) {
      return this.translationService.getTranslation('creditRating.levels.penniless.description');
    } else if (this.selectedCreditRating >= 1 && this.selectedCreditRating <= 9) {
      return this.translationService.getTranslation('creditRating.levels.poor.description');
    } else if (this.selectedCreditRating >= 10 && this.selectedCreditRating <= 49) {
      return this.translationService.getTranslation('creditRating.levels.average.description');
    } else if (this.selectedCreditRating >= 50 && this.selectedCreditRating <= 89) {
      return this.translationService.getTranslation('creditRating.levels.wealthy.description');
    } else if (this.selectedCreditRating >= 90 && this.selectedCreditRating <= 98) {
      return this.translationService.getTranslation('creditRating.levels.rich.description');
    } else { // >= 99
      return this.translationService.getTranslation('creditRating.levels.superRich.description');
    }
  }

  getFinancialInfo(): { spendingLevel: number, cash: number, assets: number } {
    return this.initializeFinanceValues(this.selectedCreditRating);
  }

  private initializeFinanceValues(creditRating: number) {
    // Call of Cthulhu financial calculations based on Credit Rating
    // Using the same logic as getCreditRatingInfo and character.service.ts
    let spendingLevel = 0;
    let cash = 0;
    let assets = 0;

    if (creditRating < 1) {
      // Penniless
      spendingLevel = 0.50;
      cash = 0.50;
      assets = 0;
    } else if (creditRating >= 1 && creditRating <= 9) {
      // Poor
      spendingLevel = 2;
      cash = creditRating * 1;
      assets = creditRating * 10;
    } else if (creditRating >= 10 && creditRating <= 49) {
      // Average
      spendingLevel = 10;
      cash = creditRating * 2;
      assets = creditRating * 50;
    } else if (creditRating >= 50 && creditRating <= 89) {
      // Wealthy
      spendingLevel = 50;
      cash = creditRating * 5;
      assets = creditRating * 500;
    } else if (creditRating >= 90 && creditRating <= 98) {
      // Rich
      spendingLevel = 250;
      cash = creditRating * 20;
      assets = creditRating * 2000;
    } else { // >= 99
      // Super Rich
      spendingLevel = 5000;
      cash = 50000;
      assets = 5000000;
    }

    return {
      spendingLevel,
      cash,
      assets
    };
  }

  // New methods for managing choices and specializations

  /**
   * Handle choice selection toggle
   */
  onChoiceToggle(choiceIndex: number, skillId: string): void {
    if (!this.selectedChoiceSkills[choiceIndex]) {
      this.selectedChoiceSkills[choiceIndex] = [];
    }

    const selectedSkills = this.selectedChoiceSkills[choiceIndex];
    const index = selectedSkills.indexOf(skillId);
    const choice = this.choiceSpecs[choiceIndex];

    if (index > -1) {
      // Deselect
      selectedSkills.splice(index, 1);

      // Clear occupation points from this skill
      const skill = this.skills.find(s => s.id === skillId);
      if (skill) {
        skill.occupationValue = 0;
        this.updateSkillTotal(skill);
      }
    } else {
      // Check if we can select more
      if (selectedSkills.length < choice.count) {
        selectedSkills.push(skillId);
      } else {
        // Replace the first selected skill
        const removedSkillId = selectedSkills.shift();
        const removedSkill = this.skills.find(s => s.id === removedSkillId);
        if (removedSkill) {
          removedSkill.occupationValue = 0;
          this.updateSkillTotal(removedSkill);
        }
        selectedSkills.push(skillId);
      }
    }

    // Re-separate skills to update occupation skills list
    this.separateSkills();

    this.updateSpentPoints();
    this.updateCharacterSheet();
    this.validateStep();
  }

  /**
   * Check if a skill is selected in a choice
   */
  isSkillSelectedInChoice(choiceIndex: number, skillId: string): boolean {
    return this.selectedChoiceSkills[choiceIndex]?.includes(skillId) ?? false;
  }

  /**
   * Check if a skill can be allocated occupation points
   */
  canAllocateOccupationPoints(skillId: string): boolean {
    if (!this.currentOccupation) return false;

    // Check direct skills
    const directSkills = this.skillManagementService.getDirectOccupationSkills(
      this.currentOccupation.occupationSkills
    );
    if (directSkills.includes(skillId)) {
      return true;
    }

    // Check if skill is in a selected choice
    for (const [choiceIndex, selectedSkills] of Object.entries(this.selectedChoiceSkills)) {
      if (selectedSkills.includes(skillId)) {
        return true;
      }
    }

    // Check if skill is a selected specialization
    for (const skillIdInSpec of Object.values(this.selectedSpecializations)) {
      if (skillIdInSpec === skillId) {
        return true;
      }
    }

    // Check if skill is in selected mixed choices
    for (const [mixedChoiceIndex, selection] of Object.entries(this.selectedMixedChoices)) {
      if (typeof selection.selectedOption === 'string' && selection.selectedOption === skillId) {
        return true;
      } else if (selection.skillId === skillId) {
        return true;
      }
    }

    // Check if skill is in selected 'any' skills
    if (this.selectedAnySkills.includes(skillId)) {
      return true;
    }

    return false;
  }

  /**
   * Handle specialization selection
   */
  onSpecializationSelect(specIndex: number, skillId: string): void {
    const oldSkillId = this.selectedSpecializations[specIndex];

    // Clear occupation points from old specialization
    if (oldSkillId) {
      const oldSkill = this.skills.find(s => s.id === oldSkillId);
      if (oldSkill) {
        oldSkill.occupationValue = 0;
        this.updateSkillTotal(oldSkill);
      }
    }

    // Set new specialization
    this.selectedSpecializations[specIndex] = skillId;

    // Re-separate skills to update occupation skills list
    this.separateSkills();

    this.updateSpentPoints();
    this.updateCharacterSheet();
    this.validateStep();
  }

  /**
   * Create and add a custom specialized skill
   */
  onCreateCustomSpecialization(specIndex: number, customName: string): void {
    const spec = this.specializationSpecs[specIndex];
    if (!spec || !customName.trim()) {
      return;
    }

    try {
      const newSkill = this.skillManagementService.createSpecializedSkill(
        spec.baseSkillId,
        customName.trim()
      );

      // Add to skills list
      this.skills.push(newSkill);

      // Select it
      this.onSpecializationSelect(specIndex, newSkill.id);

      // Clear the custom name input
      this.customSpecializationNames[specIndex] = '';

      // Re-separate skills to update occupation skills list
      this.separateSkills();
    } catch (error) {
      console.error('Error creating custom specialization:', error);
    }
  }

  /**
   * Get suggested specializations for a spec
   */
  getSuggestedSpecializations(specIndex: number): Array<{ id: string; name: string; baseValue: number }> {
    const spec = this.specializationSpecs[specIndex];
    if (!spec) {
      return [];
    }

    const suggested = this.skillManagementService.getSuggestedSpecializations(spec.baseSkillId);

    // Filter to only suggested ones if specified
    if (spec.suggestedSpecializations && spec.suggestedSpecializations.length > 0) {
      return suggested
        .filter(s => spec.suggestedSpecializations!.includes(s.id))
        .map(s => ({
          id: s.id,
          name: s.id, // Will be translated in template
          baseValue: s.baseValue
        }));
    }

    return suggested.map(s => ({
      id: s.id,
      name: s.id,
      baseValue: s.baseValue
    }));
  }

  /**
   * Handle mixed choice option selection (simple skill)
   */
  onMixedChoiceSimpleSkillSelect(mixedChoiceIndex: number, skillId: string): void {
    const oldSelection = this.selectedMixedChoices[mixedChoiceIndex];

    // Clear occupation points from old selection
    if (oldSelection) {
      if (typeof oldSelection.selectedOption === 'string') {
        const oldSkill = this.skills.find(s => s.id === oldSelection.selectedOption);
        if (oldSkill) {
          oldSkill.occupationValue = 0;
          this.updateSkillTotal(oldSkill);
        }
      } else if (oldSelection.skillId) {
        const oldSkill = this.skills.find(s => s.id === oldSelection.skillId);
        if (oldSkill) {
          oldSkill.occupationValue = 0;
          this.updateSkillTotal(oldSkill);
        }
      }
    }

    // Set new selection
    this.selectedMixedChoices[mixedChoiceIndex] = {
      selectedOption: skillId
    };

    // Re-separate skills
    this.separateSkills();
    this.updateSpentPoints();
    this.updateCharacterSheet();
    this.validateStep();
  }

  /**
   * Reset mixed choice selection
   */
  onMixedChoiceReset(mixedChoiceIndex: number): void {
    const oldSelection = this.selectedMixedChoices[mixedChoiceIndex];

    // Clear occupation points from old selection
    if (oldSelection) {
      if (typeof oldSelection.selectedOption === 'string') {
        const oldSkill = this.skills.find(s => s.id === oldSelection.selectedOption);
        if (oldSkill) {
          oldSkill.occupationValue = 0;
          this.updateSkillTotal(oldSkill);
        }
      } else if (oldSelection.skillId) {
        const oldSkill = this.skills.find(s => s.id === oldSelection.skillId);
        if (oldSkill) {
          oldSkill.occupationValue = 0;
          this.updateSkillTotal(oldSkill);
        }
      }
    }

    // Remove selection
    delete this.selectedMixedChoices[mixedChoiceIndex];

    // Re-separate skills
    this.separateSkills();
    this.updateSpentPoints();
    this.updateCharacterSheet();
    this.validateStep();
  }

  /**
   * Handle mixed choice option selection (specialization)
   */
  onMixedChoiceSpecializationSelect(mixedChoiceIndex: number, baseSkillId: string, skillId: string): void {
    const oldSelection = this.selectedMixedChoices[mixedChoiceIndex];

    // Clear occupation points from old selection
    if (oldSelection) {
      if (typeof oldSelection.selectedOption === 'string') {
        const oldSkill = this.skills.find(s => s.id === oldSelection.selectedOption);
        if (oldSkill) {
          oldSkill.occupationValue = 0;
          this.updateSkillTotal(oldSkill);
        }
      } else if (oldSelection.skillId) {
        const oldSkill = this.skills.find(s => s.id === oldSelection.skillId);
        if (oldSkill) {
          oldSkill.occupationValue = 0;
          this.updateSkillTotal(oldSkill);
        }
      }
    }

    // Set new selection
    this.selectedMixedChoices[mixedChoiceIndex] = {
      selectedOption: { type: 'specialization', baseSkillId },
      skillId
    };

    // Re-separate skills
    this.separateSkills();
    this.updateSpentPoints();
    this.updateCharacterSheet();
    this.validateStep();
  }

  /**
   * Get selected skill for mixed choice display
   */
  getSelectedMixedChoiceSkill(mixedChoiceIndex: number): Skill | undefined {
    const selection = this.selectedMixedChoices[mixedChoiceIndex];
    if (!selection) return undefined;

    if (typeof selection.selectedOption === 'string') {
      return this.skills.find(s => s.id === selection.selectedOption);
    } else if (selection.skillId) {
      return this.skills.find(s => s.id === selection.skillId);
    }

    return undefined;
  }

  /**
   * Check if a mixed choice option is a simple skill (string)
   */
  isMixedChoiceOptionSimpleSkill(option: any): boolean {
    return typeof option === 'string';
  }

  /**
   * Cast mixed choice option as string
   */
  getMixedChoiceOptionAsString(option: any): string {
    return option as string;
  }

  /**
   * Cast mixed choice option as specialization
   */
  getMixedChoiceOptionAsSpecialization(option: any): { type: 'specialization'; baseSkillId: string; suggestedSpecializations?: string[]; allowCustom: boolean } {
    return option as { type: 'specialization'; baseSkillId: string; suggestedSpecializations?: string[]; allowCustom: boolean };
  }

  /**
   * Get suggested specializations for mixed choice
   */
  getMixedChoiceSuggestedSpecializations(
    mixedChoiceIndex: number,
    optionIndex: number
  ): Array<{ id: string; name: string; baseValue: number }> {
    const spec = this.mixedChoiceSpecs[mixedChoiceIndex];
    if (!spec) return [];

    const option = spec.options[optionIndex];
    if (typeof option === 'string') return [];

    // Get all skills with matching parent
    const suggested = this.skills.filter(s =>
      s.parentSkillId === option.baseSkillId && !this.hiddenSkills.has(s.id)
    );

    // Filter to only suggested ones if specified
    if (option.suggestedSpecializations && option.suggestedSpecializations.length > 0) {
      return suggested
        .filter(s => option.suggestedSpecializations!.includes(s.id))
        .map(s => ({
          id: s.id,
          name: s.id,
          baseValue: s.baseValue
        }));
    }

    return suggested.map(s => ({
      id: s.id,
      name: s.id,
      baseValue: s.baseValue
    }));
  }

  /**
   * Create custom specialization for mixed choice
   */
  onMixedChoiceCreateCustomSpecialization(mixedChoiceIndex: number, optionIndex: number, customName: string): void {
    const spec = this.mixedChoiceSpecs[mixedChoiceIndex];
    if (!spec) return;

    const option = spec.options[optionIndex];
    if (typeof option === 'string' || !customName.trim()) return;

    try {
      const newSkill = this.skillManagementService.createSpecializedSkill(
        option.baseSkillId,
        customName.trim()
      );

      this.skills.push(newSkill);
      this.onMixedChoiceSpecializationSelect(mixedChoiceIndex, option.baseSkillId, newSkill.id);
    } catch (error) {
      console.error('Error creating custom specialization:', error);
    }
  }

  /**
   * Handle mixed choice specialization creation from skill selector
   */
  onMixedChoiceSpecializationCreated(mixedChoiceIndex: number, baseSkillId: string, skill: Skill): void {
    // Add the new skill to our skills list if it doesn't exist
    const existingSkill = this.skills.find(s => s.id === skill.id);
    if (!existingSkill) {
      this.skills.push(skill);
    }

    // Select it
    this.onMixedChoiceSpecializationSelect(mixedChoiceIndex, baseSkillId, skill.id);
  }

  /**
   * Handle 'any skill' selection
*/
  onAnySkillSelect(skillId: string): void {
    const index = this.selectedAnySkills.indexOf(skillId);

    if (index > -1) {
      // Deselect
      this.selectedAnySkills.splice(index, 1);

      // Clear occupation points
      const skill = this.skills.find(s => s.id === skillId);
      if (skill) {
        skill.occupationValue = 0;
        this.updateSkillTotal(skill);
      }
    } else {
      // Check if we can select more
      const totalAnyCount = this.anySkillSpecs.reduce((sum, spec) => sum + spec.count, 0);
      if (this.selectedAnySkills.length < totalAnyCount) {
        this.selectedAnySkills.push(skillId);
      }
    }

    // Re-separate skills to update occupation skills list
    this.separateSkills();

    this.updateSpentPoints();
    this.updateCharacterSheet();
    this.validateStep();
  }

  /**
   * Check if a skill is selected as 'any skill'
   */
  isSelectedAsAnySkill(skillId: string): boolean {
    return this.selectedAnySkills.includes(skillId);
  }

  /**
   * Get remaining 'any skill' slots
   */
  getRemainingAnySkillSlots(): number {
    const totalAnyCount = this.anySkillSpecs.reduce((sum, spec) => sum + spec.count, 0);
    return totalAnyCount - this.selectedAnySkills.length;
  }

  /**
   * Get display name for a skill
   */
  getSkillDisplayName(skill: Skill): string {
    return this.entityTranslationService.getSkillTranslation(skill);
  }

  /**
   * Get total count of 'any' skill slots
   */
  getTotalAnySkillCount(): number {
    return this.anySkillSpecs.reduce((sum, spec) => sum + spec.count, 0);
  }

  /**
   * Get selected skill for specialization display
   */
  getSelectedSpecializationSkill(specIndex: number): Skill | undefined {
    const skillId = this.selectedSpecializations[specIndex];
    if (!skillId) return undefined;
    return this.skills.find(s => s.id === skillId);
  }

  /**
   * Get filtered skills for 'any skill' selection based on search term
   */
  getFilteredAnySkills(): Skill[] {
    if (!this.anySkillSearchTerm.trim()) {
      return this.otherSkills;
    }

    const searchLower = this.anySkillSearchTerm.toLowerCase();
    return this.otherSkills.filter(skill => {
      const translatedName = this.translationService.getTranslation(`skills.${skill.id}`).toLowerCase();
      return translatedName.includes(searchLower) || skill.id.toLowerCase().includes(searchLower);
    });
  }

  /**
   * Select a skill from the dropdown
   */
  onAnySkillDropdownSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const skillId = select.value;

    if (skillId && !this.selectedAnySkills.includes(skillId)) {
      const totalAnyCount = this.anySkillSpecs.reduce((sum, spec) => sum + spec.count, 0);
      if (this.selectedAnySkills.length < totalAnyCount) {
        this.selectedAnySkills.push(skillId);

        // Re-separate skills to update occupation skills list
        this.separateSkills();

        this.updateSpentPoints();
        this.updateCharacterSheet();
        this.validateStep();
      }
    }

    // Reset the select
    select.value = '';
  }

  /**
   * Remove a selected 'any skill'
   */
  onRemoveAnySkill(skillId: string): void {
    this.onAnySkillSelect(skillId); // Reuse existing logic
  }

  /**
   * Create a custom 'any skill'
   */
  onCreateCustomAnySkill(): void {
    const customName = this.anySkillCustomName.trim();
    if (!customName) {
      return;
    }

    try {
      const newSkill = this.skillManagementService.createCustomSkill(customName);

      // Add to skills list
      this.skills.push(newSkill);

      // Add to otherSkills
      this.otherSkills.push(newSkill);
      this.otherSkills.sort((a, b) => a.id.localeCompare(b.id));

      // Select it as 'any skill'
      const totalAnyCount = this.anySkillSpecs.reduce((sum, spec) => sum + spec.count, 0);
      if (this.selectedAnySkills.length < totalAnyCount) {
        this.selectedAnySkills.push(newSkill.id);

        // Re-separate skills to update occupation skills list
        this.separateSkills();

        this.updateSpentPoints();
        this.updateCharacterSheet();
        this.validateStep();
      }

      // Clear the input
      this.anySkillCustomName = '';
    } catch (error) {
      console.error('Error creating custom any skill:', error);
    }
  }

  /**
   * Get all existing skill IDs to prevent duplicates
   */
  getAllExistingSkillIds(): string[] {
    return this.skills.map(s => s.id);
  }

  /**
   * Handle specialization creation from skill selector
   */
  onSpecializationCreated(specIndex: number, skill: Skill): void {
    // Add the new skill to our skills list if it doesn't exist
    const existingSkill = this.skills.find(s => s.id === skill.id);
    if (!existingSkill) {
      this.skills.push(skill);
    }

    // Select it
    this.onSpecializationSelect(specIndex, skill.id);
  }

  /**
   * Handle 'any skill' creation from skill selector
   */
  onAnySkillCreated(skill: Skill): void {
    // Add the new skill to our skills list if it doesn't exist
    const existingSkill = this.skills.find(s => s.id === skill.id);
    if (!existingSkill) {
      this.skills.push(skill);
      this.otherSkills.push(skill);
      this.otherSkills.sort((a, b) => a.id.localeCompare(b.id));
    }

    // Add to selected 'any' skills
    const totalAnyCount = this.anySkillSpecs.reduce((sum, spec) => sum + spec.count, 0);
    if (this.selectedAnySkills.length < totalAnyCount && !this.selectedAnySkills.includes(skill.id)) {
      this.selectedAnySkills.push(skill.id);

      // Re-separate skills to update occupation skills list
      this.separateSkills();

      this.updateSpentPoints();
      this.updateCharacterSheet();
      this.validateStep();
    }
  }

  /**
   * Get skill name by ID, handling custom and specialized skills
   */
  getSkillNameById(skillId: string): string {
    const skill = this.skills.find(s => s.id === skillId);
    if (!skill) {
      return this.translationService.getTranslation(`skills.${skillId}`);
    }
    return this.getSkillTranslatedName(skill);
  }

  /**
   * Get translated name for a skill, handling custom and specialized skills
   */
  getSkillTranslatedName(skill: Skill): string {
    if (skill.customName) {
      if (skill.parentSkillId) {
        // Specialized skill: "Art/Craft (Photography)"
        const parentTranslation = this.translationService.getTranslation(`skills.${skill.parentSkillId}`);

        // Check if customName is a predefined specialization ID (for translation)
        const translationKey = `skills.${skill.customName}`;
        const translation = this.translationService.getTranslation(translationKey);

        // If translation exists (not equal to the key), use it; otherwise use customName as is
        const specializationName = translation !== translationKey ? translation : skill.customName;

        return `${parentTranslation} (${specializationName})`;
      }
      // Completely custom skill - use customName directly
      return skill.customName;
    }

    // Regular skill - use translation
    return this.translationService.getTranslation(`skills.${skill.id}`);
  }
}
