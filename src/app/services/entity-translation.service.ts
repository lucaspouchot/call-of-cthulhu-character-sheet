import { Injectable } from '@angular/core';
import { TranslationService } from './translation.service';
import { Skill, Sex } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class EntityTranslationService {

  constructor(private translationService: TranslationService) { }

  getSkillTranslation(skill: Skill | string): string {
    const skillId = typeof skill === 'string' ? skill : skill.id;
    const translationKey = `character.creation.skills.${skillId}`;
    return this.translationService.getTranslation(translationKey) || skillId;
  }

  getSexTranslation(sex: Sex): string {
    const translationKey = `character.creation.options.sex.${sex}`;
    return this.translationService.getTranslation(translationKey) || sex;
  }

  getOccupationName(occupationId: string): string {
    const translationKey = `character.creation.occupation.preset.${occupationId}.name`;
    return this.translationService.getTranslation(translationKey) || occupationId;
  }

  getOccupationDescription(occupationId: string): string {
    const translationKey = `character.creation.occupation.preset.${occupationId}.description`;
    return this.translationService.getTranslation(translationKey) || '';
  }
}