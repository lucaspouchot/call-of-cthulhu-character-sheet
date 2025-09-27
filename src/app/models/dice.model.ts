export interface DiceRoll {
  type: 'characteristic' | 'skill' | 'damage' | 'sanity';
  target?: number;
  dice: string; // e.g., "1d100", "2d6+3"
  result: number;
  success?: boolean;
  criticalSuccess?: boolean;
  extremeSuccess?: boolean;
  hardSuccess?: boolean;
  regularSuccess?: boolean;
  failure?: boolean;
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
    extremeSuccess: boolean;
    hardSuccess: boolean;
    regularSuccess: boolean;
    failure: boolean;
    fumble: boolean;
  } {
    const fumble = roll >= 96;
    const failure = roll > target;
    const regularSuccess = roll <= target && roll > Math.floor(target / 2);
    const hardSuccess = roll <= Math.floor(target / 2) && roll > Math.floor(target / 5);
    const extremeSuccess = roll <= Math.floor(target / 5) && roll > 1;
    const criticalSuccess = roll === 1;
    const success = roll <= target;

    return {
      success,
      criticalSuccess,
      extremeSuccess,
      hardSuccess,
      regularSuccess,
      failure,
      fumble
    };
  }
}