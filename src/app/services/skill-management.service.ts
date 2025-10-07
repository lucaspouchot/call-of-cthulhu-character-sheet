import { Injectable } from '@angular/core';
import { Skill } from '../models/character.model';
import { SKILL_DEFINITIONS, SkillDefinition } from '../models/skill-definitions.model';
import { OccupationSkillSpec } from '../models/occupation.model';

@Injectable({
  providedIn: 'root'
})
export class SkillManagementService {

  constructor() { }

  /**
   * Get skill definition by ID
   */
  getSkillDefinition(skillId: string): SkillDefinition | undefined {
    return SKILL_DEFINITIONS.find(def => def.id === skillId);
  }

  /**
   * Check if a skill is specializable
   */
  isSpecializable(skillId: string): boolean {
    const def = this.getSkillDefinition(skillId);
    return def?.isSpecializable ?? false;
  }

  /**
   * Check if a skill requires specialization
   */
  requiresSpecialization(skillId: string): boolean {
    const def = this.getSkillDefinition(skillId);
    return def?.requiresSpecialization ?? false;
  }

  /**
   * Get the base value for a skill or specialization
   */
  getBaseValue(skillId: string, parentSkillId?: string): number {
    if (parentSkillId) {
      const parentDef = this.getSkillDefinition(parentSkillId);
      if (parentDef?.predefinedSpecializations) {
        const spec = parentDef.predefinedSpecializations.find(s => s.id === skillId);
        if (spec) {
          return parentDef.baseValue;
        }
      }
      return parentDef?.baseValue ?? 0;
    }

    const def = this.getSkillDefinition(skillId);
    return def?.baseValue ?? 0;
  }

  /**
   * Create a new specialized skill instance
   * For predefined specializations, the predefinedId is used as the skill ID (for translation)
   * The predefinedId itself serves as the translation key (e.g., 'fightingSword' -> 'skills.fightingSword')
   */
  createSpecializedSkill(parentSkillId: string, customName?: string, predefinedId?: string): Skill {
    const parentDef = this.getSkillDefinition(parentSkillId);
    if (!parentDef) {
      throw new Error(`Skill definition not found: ${parentSkillId}`);
    }

    let baseValue = parentDef.baseValue;
    let skillId: string;
    let finalCustomName: string | undefined;

    if (predefinedId) {
      // Use predefined specialization template
      const spec = parentDef.predefinedSpecializations?.find(s => s.id === predefinedId);
      if (spec) {
        baseValue = parentDef.baseValue;
        // Use the predefined ID as the skill ID for translation lookup
        skillId = `${parentSkillId}_${predefinedId}_${Date.now()}`;
        // Store predefinedId in a way that allows translation
        finalCustomName = predefinedId; // This will be used for translation key lookup
      } else {
        throw new Error(`Predefined specialization not found: ${predefinedId}`);
      }
    } else if (customName) {
      // Create custom specialization with user-provided name
      skillId = `${parentSkillId}_${customName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
      finalCustomName = customName;
    } else {
      throw new Error('Either customName or predefinedId must be provided');
    }

    return {
      id: skillId,
      baseValue: baseValue,
      personalValue: 0,
      occupationValue: 0,
      totalValue: baseValue,
      parentSkillId: parentSkillId,
      customName: finalCustomName
    };
  }

  /**
   * Create a completely custom skill
   */
  createCustomSkill(name: string, baseValue: number = 0): Skill {
    const skillId = `custom_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    return {
      id: skillId,
      baseValue: baseValue,
      personalValue: 0,
      occupationValue: 0,
      totalValue: baseValue,
      customName: name,
      isCustom: true
    };
  }

  /**
   * Get all occupation skills from specs
   * Returns a flat list of skill IDs that are directly available
   */
  getDirectOccupationSkills(occupationSkillSpecs: OccupationSkillSpec[]): string[] {
    const directSkills: string[] = [];

    for (const spec of occupationSkillSpecs) {
      if (typeof spec === 'string') {
        directSkills.push(spec);
      }
      // customSkill types are handled separately - they get created as real skills
      // Choices, specializations, and 'any' are not included as direct skills
      // They need user interaction to be selected
    }

    return directSkills;
  }

  /**
   * Get custom skill specifications from occupation skills
   */
  getCustomSkillSpecs(occupationSkillSpecs: OccupationSkillSpec[]): Array<{
    skillNameKey: string;
    baseValue: number;
    description?: string;
  }> {
    const customSkills: Array<{
      skillNameKey: string;
      baseValue: number;
      description?: string;
    }> = [];

    for (const spec of occupationSkillSpecs) {
      if (typeof spec !== 'string' && spec.type === 'customSkill') {
        customSkills.push({
          skillNameKey: spec.skillNameKey,
          baseValue: spec.baseValue,
          description: spec.description
        });
      }
    }

    return customSkills;
  }

  /**
   * Get choice specifications from occupation skills
   */
  getChoiceSpecs(occupationSkillSpecs: OccupationSkillSpec[]): Array<{ count: number; options: string[] }> {
    const choices: Array<{ count: number; options: string[] }> = [];

    for (const spec of occupationSkillSpecs) {
      if (typeof spec !== 'string' && spec.type === 'choice') {
        choices.push({
          count: spec.count,
          options: spec.options
        });
      }
    }

    return choices;
  }

  /**
   * Get specialization specifications from occupation skills
   */
  getSpecializationSpecs(occupationSkillSpecs: OccupationSkillSpec[]): Array<{
    baseSkillId: string;
    suggestedSpecializations?: string[];
    allowCustom: boolean;
  }> {
    const specs: Array<{
      baseSkillId: string;
      suggestedSpecializations?: string[];
      allowCustom: boolean;
    }> = [];

    for (const spec of occupationSkillSpecs) {
      if (typeof spec !== 'string' && spec.type === 'specialization') {
        specs.push({
          baseSkillId: spec.baseSkillId,
          suggestedSpecializations: spec.suggestedSpecializations,
          allowCustom: spec.allowCustom
        });
      }
    }

    return specs;
  }

  /**
   * Get 'any skill' specifications from occupation skills
   */
  getAnySkillSpecs(occupationSkillSpecs: OccupationSkillSpec[]): Array<{ count: number; description?: string }> {
    const specs: Array<{ count: number; description?: string }> = [];

    for (const spec of occupationSkillSpecs) {
      if (typeof spec !== 'string' && spec.type === 'any') {
        specs.push({
          count: spec.count,
          description: spec.description
        });
      }
    }

    return specs;
  }

  /**
   * Validate that occupation points are correctly allocated for choices
   * Returns true if valid, false if user has allocated points to multiple options in a single choice
   */
  validateChoiceAllocation(
    skills: Skill[],
    choiceSpecs: Array<{ count: number; options: string[] }>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const choice of choiceSpecs) {
      const skillsWithOccupationPoints = skills.filter(
        skill => choice.options.includes(skill.id) && skill.occupationValue > 0
      );

      if (skillsWithOccupationPoints.length > choice.count) {
        errors.push(
          `You can only allocate occupation points to ${choice.count} of these skills: ${choice.options.join(', ')}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if a skill can receive occupation points based on occupation specs
   */
  canReceiveOccupationPoints(
    skill: Skill,
    occupationSkillSpecs: OccupationSkillSpec[],
    userChoices: {
      selectedChoiceSkills: { [choiceIndex: number]: string[] };
      selectedSpecializations: { [specIndex: number]: string };
      selectedAnySkills: string[];
    }
  ): boolean {
    // Check direct skills
    for (const spec of occupationSkillSpecs) {
      if (typeof spec === 'string' && spec === skill.id) {
        return true;
      }
    }

    // Check if skill is in selected choices
    for (const selectedSkills of Object.values(userChoices.selectedChoiceSkills)) {
      if (selectedSkills.includes(skill.id)) {
        return true;
      }
    }

    // Check if skill is a selected specialization
    if (Object.values(userChoices.selectedSpecializations).includes(skill.id)) {
      return true;
    }

    // Check if skill is in selected 'any' skills
    if (userChoices.selectedAnySkills.includes(skill.id)) {
      return true;
    }

    return false;
  }

  /**
   * Get suggested specializations for a base skill
   */
  getSuggestedSpecializations(baseSkillId: string): Array<{ id: string; baseValue: number }> {
    const def = this.getSkillDefinition(baseSkillId);
    if (!def?.predefinedSpecializations) {
      return [];
    }

    return def.predefinedSpecializations.map(spec => ({
      id: spec.id,
      baseValue: def.baseValue
    }));
  }
}
