export interface DiceRoll {
  type: 'characteristic' | 'skill' | 'damage' | 'sanity';
  target?: number;
  dice: string; // e.g., "1d100", "2d6+3"
  result: number;
  success?: boolean;
  criticalSuccess?: boolean;
  criticalFailure?: boolean;
  fumble?: boolean;
  timestamp: Date;
  description?: string;
}

export interface DiceResult {
  total: number;
  individual: number[];
  modifier: number;
}

export class DiceService {
  static rollDice(dice: string): DiceResult {
    // Parse dice notation like "2d6+3" or "1d100"
    const match = dice.match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (!match) {
      throw new Error(`Invalid dice notation: ${dice}`);
    }

    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    const individual = [];
    for (let i = 0; i < count; i++) {
      individual.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = individual.reduce((sum, roll) => sum + roll, 0) + modifier;

    return { total, individual, modifier };
  }

  static rollPercentile(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  static checkSuccess(roll: number, target: number): {
    success: boolean;
    criticalSuccess: boolean;
    criticalFailure: boolean;
    fumble: boolean;
  } {
    const success = roll <= target;
    const criticalSuccess = roll <= Math.max(target / 5, 1);
    const criticalFailure = roll >= 96;
    const fumble = roll === 100;

    return { success, criticalSuccess, criticalFailure, fumble };
  }
}