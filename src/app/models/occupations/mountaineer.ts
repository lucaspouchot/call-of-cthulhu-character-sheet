import { Occupation } from './occupation.types';

/**
 * Mountaineer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/alpiniste/
 */
export const mountaineer: Occupation = {
    id: 'mountaineer',
    creditRating: { min: 30, max: 60 },
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
      'listen',
      'climb',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'navigate',
      'track',
      'firstAid',
      'jump',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: false, suggestedSpecializations: ['survivalMountain'] }
    ],
    suggestedContacts: ['Other mountaineers', 'Ecologists', 'Clients and patrons', 'Local police or rescuers', 'National park wardens', 'Sports clubs'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  };
