import { Skill } from './character.model';
import { SKILL_DEFINITIONS } from './skill-definitions.model';

// Generate default skills from skill definitions
// Excludes category-only skills (fighting, firearms) which are never shown in lists
export const DEFAULT_SKILLS: Skill[] = SKILL_DEFINITIONS.map(def => {
  // Skip category-only skills (fighting, firearms) - they never appear in skill lists
  if (def.isCategoryOnly) {
    return null;
  }

  // If skill is not specializable or doesn't require specialization, include it as-is
  if (!def.isSpecializable || !def.requiresSpecialization) {
    return {
      id: def.id,
      baseValue: def.baseValue,
      personalValue: 0,
      occupationValue: 0,
      totalValue: def.baseValue
    };
  }

  // For specializable skills that appear in lists (artCraft, languageOther, pilot, science, survival)
  // Include the base skill - predefinedSpecializations are just templates with translations
  return {
    id: def.id,
    baseValue: def.baseValue,
    personalValue: 0,
    occupationValue: 0,
    totalValue: def.baseValue
  };
}).filter(skill => skill !== null) as Skill[];