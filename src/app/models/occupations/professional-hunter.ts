import { Occupation } from './occupation.types';

/**
 * ProfessionalHunter occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/chasseur-professionnel/
 */
export const professionalHunter: Occupation = {
    id: 'professionalHunter',
    creditRating: { min: 20, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'dexterity', multiplier: 2 },
        { attribute: 'strength', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearmsRifle',
      'stealth',
      { type: 'choice', count: 1, options: ['listen', 'spotHidden'] },
      {
        type: 'mixedChoice',
        count: 1,
        options: [
          { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
          { type: 'specialization', baseSkillId: 'survival', allowCustom: true }
        ]
      },
      'naturalWorld',
      'navigate',
      'track',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology', 'scienceBotany'] }
    ],
    suggestedContacts: ['Administration of visited countries', 'Park wardens', 'Former wealthy clients', 'Black market gangs and vendors', 'Zoo directors'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  };
