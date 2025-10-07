import { Occupation } from './occupation.types';

/**
 * FineArtist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/artiste-plasticien/
 */
export const fineArtist: Occupation = {
    id: 'fineArtist',
    creditRating: { min: 9, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'dexterity', multiplier: 2 },
        { attribute: 'power', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true, suggestedSpecializations: ['artCraftFineArt', 'artCraftSculpture', 'artCraftPhotography'] },
      'history',
      'psychology',
      'appraise',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Art galleries', 'Critics', 'Patrons', 'Other artists'],
    recommendedCharacteristicsOrder: ['dexterity', 'power', 'education', 'intelligence', 'appearance', 'constitution', 'size', 'strength']
  };
