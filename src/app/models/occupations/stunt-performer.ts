import { Occupation } from './occupation.types';

/**
 * StuntPerformer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/cascadeur/
 */
export const stuntPerformer: Occupation = {
    id: 'stuntPerformer',
    creditRating: { min: 10, max: 50 },
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
      'fightingBrawl',
      { type: 'choice', count: 1, options: ['electricalRepair', 'mechanicalRepair'] },
      'dodge',
      'climb',
      'swim',
      'firstAid',
      'jump',
      { type: 'choice', count: 1, options: ['driveAuto', 'ride', 'pilotAircraft'] }
    ],
    suggestedContacts: ['Film and TV industry', 'Explosives and fireworks suppliers', 'Actors and directors'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  };
