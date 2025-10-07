import { Injectable } from '@angular/core';
import { TranslationService } from './translation.service';
import { Skill, Sex } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class EntityTranslationService {

  constructor(private translationService: TranslationService) { }

  getSkillTranslation(skill: Skill | string): string {
    // Handle string input (legacy support)
    if (typeof skill === 'string') {
      const translationKey = `skills.${skill}`;
      return this.translationService.getTranslation(translationKey) || skill;
    }

    // Handle Skill object with custom name
    if (skill.customName) {
      if (skill.parentSkillId) {
        // Specialized skill
        const parentKey = `skills.${skill.parentSkillId}`;
        const parentName = this.translationService.getTranslation(parentKey) || skill.parentSkillId;

        // Check if customName is a predefined specialization ID (has translation)
        const specKey = `skills.${skill.customName}`;
        const specTranslation = this.translationService.getTranslation(specKey);

        if (specTranslation && specTranslation !== specKey) {
          // Predefined specialization with translation: "Combat rapproché (Épée)"
          return `${parentName} (${specTranslation})`;
        } else {
          // Custom specialization without translation: "Combat rapproché (Ma propre arme)"
          return `${parentName} (${skill.customName})`;
        }
      }
      // Custom skill: "Illusion (personnalisé)"
      if (skill.isCustom) {
        const customLabel = this.translationService.getTranslation('skills.customLabel') || 'custom';
        return `${skill.customName} (${customLabel})`;
      }
      // Fallback for custom name without isCustom flag
      return skill.customName;
    }

    // Regular skill - look up translation
    const translationKey = `skills.${skill.id}`;
    return this.translationService.getTranslation(translationKey) || skill.id;
  }

  getSexTranslation(sex: Sex): string {
    const translationKey = `character.sex.${sex}`;
    return this.translationService.getTranslation(translationKey) || sex;
  }

  getOccupationName(occupationId: string): string {
    const translationKey = `occupations.${occupationId}.label`;
    return this.translationService.getTranslation(translationKey) || occupationId;
  }

  getOccupationDescription(occupationId: string): string {
    const translationKey = `occupations.${occupationId}.description`;
    return this.translationService.getTranslation(translationKey) || '';
  }
}