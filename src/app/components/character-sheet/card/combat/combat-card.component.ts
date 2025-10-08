import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent } from '../base-card.component';
import { Weapon } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { AttributeService } from '../../../../services/attribute.service';
import { ALL_WEAPONS, UNARMED_WEAPON, WEAPON_CATEGORIES } from '../../../../models/weapons-data';

// Formula components for damage and range
interface FormulaComponent {
  type: 'dice' | 'fixed' | 'db' | 'halfDb' | 'build' | 'strFifth';
  value?: string | number;
  operator?: '+' | '-';
}

@Component({
  selector: 'app-combat-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTranslatePipe],
  templateUrl: './combat-card.component.html',
  styleUrl: './combat-card.component.css'
})
export class CombatCardComponent extends BaseCardComponent {

  // Weapon management
  showWeaponSelector = false;
  selectedCategory: keyof typeof WEAPON_CATEGORIES = 'melee';
  weaponCategories = WEAPON_CATEGORIES;
  categoryKeys = Object.keys(WEAPON_CATEGORIES) as Array<keyof typeof WEAPON_CATEGORIES>;

  // New custom weapon
  newCustomWeapon: Weapon = this.createEmptyWeapon();

  // Formula editors
  showDamageFormulaEditor = false;
  showRangeFormulaEditor = false;
  damageFormula: FormulaComponent[] = [];
  rangeFormula: string = '';

  constructor(private attributeService: AttributeService) {
    super();
  }

  protected getSectionName(): string {
    return 'combat';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = {
        weapons: this.character.weapons ? [...this.character.weapons] : []
      };
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.weapons = [...this.originalData.weapons];
    }
  }

  override toggleEditMode(): void {
    super.toggleEditMode();
    if (!this.isInEditMode()) {
      this.showWeaponSelector = false;
    }
  }

  override cancelEdit(): void {
    super.cancelEdit();
    this.showWeaponSelector = false;
  }

  override saveCharacterData(): void {
    super.saveCharacterData();
    this.showWeaponSelector = false;
  }

  /**
   * Get all weapons including the default unarmed weapon
   */
  getWeapons(): Weapon[] {
    const weapons = this.character?.weapons || [];
    return [this.getUnarmedWeapon(), ...weapons];
  }

  /**
   * Get unarmed weapon with calculated damage
   */
  getUnarmedWeapon(): Weapon {
    const damageBonus = this.getDamageBonus();
    return {
      ...UNARMED_WEAPON,
      damage: `1D3${damageBonus}`
    };
  }

  /**
   * Calculate damage bonus from character's build
   */
  getDamageBonus(): string {
    if (!this.character) return '+0';

    const build = this.attributeService.calculateBuild(
      this.character.strength.value,
      this.character.size.value
    );
    const bonus = this.attributeService.calculateDamageBonus(build);

    // Format for display (e.g., '+1d4', '+0', '-1')
    if (bonus === '0') return '+0';
    if (bonus.startsWith('+') || bonus.startsWith('-')) return bonus;
    return `+${bonus}`;
  }

  /**
   * Get build value for display
   */
  getBuild(): number {
    if (!this.character) return 0;

    return this.attributeService.calculateBuild(
      this.character.strength.value,
      this.character.size.value
    );
  }

  /**
   * Get dodge skill value
   */
  getDodge(): number {
    if (!this.character) return 0;

    const dodgeSkill = this.character.skills.find(s => s.id === 'dodge');
    return dodgeSkill?.totalValue || 0;
  }

  /**
   * Get dodge success rates (regular, hard, extreme)
   */
  getDodgeRates(): { regular: number; hard: number; extreme: number } {
    const dodgeValue = this.getDodge();
    return {
      regular: dodgeValue,
      hard: Math.floor(dodgeValue / 2),
      extreme: Math.floor(dodgeValue / 5)
    };
  }

  /**
   * Get skill value for a weapon
   */
  getSkillValue(weapon: Weapon): number {
    if (!this.character) return 0;

    const skill = this.character.skills.find(s => s.id === weapon.skillUsed);
    return skill?.totalValue || 0;
  }

  /**
   * Check if character has the skill for a weapon
   */
  hasSkill(weapon: Weapon): boolean {
    const skillValue = this.getSkillValue(weapon);
    return skillValue > 0;
  }

  /**
   * Calculate success percentages for a weapon
   */
  getSuccessRates(weapon: Weapon): { regular: number; hard: number; extreme: number } {
    const skillValue = this.getSkillValue(weapon);
    return {
      regular: skillValue,
      hard: Math.floor(skillValue / 2),
      extreme: Math.floor(skillValue / 5)
    };
  }

  /**
   * Replace damage bonus placeholder with actual value
   */
  getDisplayDamage(damage: string): string {
    const damageBonus = this.getDamageBonus();

    // Handle "half DB" first
    if (damage.includes('half DB')) {
      const build = this.getBuild();
      const halfBonus = this.attributeService.calculateDamageBonus(Math.floor(build / 2));
      damage = damage.replace(/half\s*DB/gi, halfBonus);
    }

    // Replace BUILD with actual build value
    if (damage.includes('BUILD') && this.character) {
      const buildValue = this.getBuild();
      damage = damage.replace(/BUILD/gi, buildValue.toString());
    }

    // Replace DB with actual damage bonus, handling the + sign correctly
    if (damage.includes('DB')) {
      // Remove leading + from damage bonus if the formula already has a + before DB
      const cleanBonus = damageBonus.startsWith('+') ? damageBonus.substring(1) : damageBonus;
      damage = damage.replace(/\+\s*DB/gi, '+' + cleanBonus)
        .replace(/\-\s*DB/gi, '-' + cleanBonus)
        .replace(/DB/gi, cleanBonus);
    }

    // Replace STR/5 with actual value (for range)
    if (damage.includes('STR/5') && this.character) {
      const strFifth = this.character.strength.fifthValue;
      damage = damage.replace(/STR\/5/gi, strFifth.toString());
    }

    return damage;
  }

  /**
   * Check if weapon has multiple damage/range values (like shotguns)
   */
  hasMultipleRanges(weapon: Weapon): boolean {
    return weapon.damage.includes('/') && weapon.range.includes('/');
  }

  /**
   * Parse weapon with multiple damage/range values
   */
  getMultipleRangeData(weapon: Weapon): Array<{ damage: string; range: string }> {
    if (!this.hasMultipleRanges(weapon)) {
      return [];
    }

    const damages = weapon.damage.split('/').map(d => d.trim());
    const ranges = weapon.range.split('/').map(r => r.trim());


    const result: Array<{ damage: string; range: string }> = [];
    const maxLength = Math.max(damages.length, ranges.length);

    for (let i = 0; i < maxLength; i++) {
      let range = (ranges[i] || ranges[ranges.length - 1]).trim();
      if (range.match(/^\d+$/)) {
        range += ' yards';
      }
      result.push({
        damage: this.getDisplayDamage(damages[i] || damages[damages.length - 1]),
        range: this.getDisplayDamage(range)
      });
    }

    return result;
  }

  /**
   * Add a predefined weapon to character
   */
  addWeapon(weapon: Weapon): void {
    if (!this.character) return;

    if (!this.character.weapons) {
      this.character.weapons = [];
    }

    // Create a copy of the weapon
    const newWeapon: Weapon = { ...weapon };
    this.character.weapons.push(newWeapon);
    this.characterChange.emit(this.character);
  }

  /**
   * Remove a weapon from character
   */
  removeWeapon(index: number): void {
    if (!this.character || !this.character.weapons) return;

    this.character.weapons.splice(index, 1);
    this.characterChange.emit(this.character);
  }

  /**
   * Add a custom weapon
   */
  addCustomWeapon(): void {
    if (!this.character) return;

    if (!this.character.weapons) {
      this.character.weapons = [];
    }

    // Validate custom weapon
    if (!this.newCustomWeapon.name || !this.newCustomWeapon.skillUsed) {
      return;
    }

    const customWeapon: Weapon = {
      ...this.newCustomWeapon,
      id: `custom_${Date.now()}`,
      isCustom: true
    };

    this.character.weapons.push(customWeapon);
    this.characterChange.emit(this.character);

    // Reset form
    this.newCustomWeapon = this.createEmptyWeapon();
  }

  /**
   * Create an empty weapon template
   */
  createEmptyWeapon(): Weapon {
    return {
      id: '',
      name: '',
      skillUsed: 'fightingBrawl',
      damage: '1D6',
      range: '-',
      rate: '1',
      capacity: '-',
      malfunction: '-',
      cost: '',
      isCustom: true
    };
  }

  /**
   * Toggle weapon selector visibility
   */
  toggleWeaponSelector(): void {
    this.showWeaponSelector = !this.showWeaponSelector;
  }

  /**
   * Get available skills for weapon selection
   */
  getAvailableSkills(): string[] {
    return [
      'fightingBrawl',
      'fightingAxe',
      'fightingFlail',
      'fightingGarrote',
      'fightingSpear',
      'fightingSword',
      'fightingWhip',
      'firearmsHandgun',
      'firearmsRifle',
      'firearmsShotgun',
      'firearmsSubmachineGun',
      'firearmsMachineGun',
      'firearmsBowCrossbow',
      'throw'
    ];
  }

  /**
   * Get weapon name for display (translated or custom)
   */
  getWeaponName(weapon: Weapon): string {
    return weapon.name || weapon.id;
  }

  /**
   * Check if weapon is custom
   */
  isCustomWeapon(weapon: Weapon): boolean {
    return weapon.isCustom || false;
  }

  /**
   * Add a component to damage formula
   */
  addDamageComponent(type: FormulaComponent['type'], operator: '+' | '-' = '+'): void {
    const component: FormulaComponent = { type, operator };

    if (type === 'dice') {
      component.value = '1D6';
    } else if (type === 'fixed') {
      component.value = 1;
    }

    this.damageFormula.push(component);
    this.updateDamageFromFormula();
  }

  /**
   * Remove component from damage formula
   */
  removeDamageComponent(index: number): void {
    this.damageFormula.splice(index, 1);
    this.updateDamageFromFormula();
  }

  /**
   * Update damage value from formula components
   */
  updateDamageFromFormula(): void {
    let result = '';

    this.damageFormula.forEach((comp, index) => {
      if (index > 0 && comp.operator) {
        result += comp.operator;
      }

      switch (comp.type) {
        case 'dice':
          result += comp.value || '1D6';
          break;
        case 'fixed':
          result += comp.value || '0';
          break;
        case 'db':
          result += 'DB';
          break;
        case 'halfDb':
          result += 'half DB';
          break;
        case 'build':
          result += 'BUILD';
          break;
        case 'strFifth':
          result += 'STR/5';
          break;
      }
    });

    this.newCustomWeapon.damage = result || '1D6';
  }

  /**
   * Parse damage string to formula components
   */
  parseDamageToFormula(damage: string): void {
    this.damageFormula = [];

    // Simple parser for common patterns
    const parts = damage.split(/([+-])/);
    let currentOperator: '+' | '-' = '+';

    parts.forEach((part) => {
      part = part.trim();
      if (part === '+' || part === '-') {
        currentOperator = part;
      } else if (part) {
        let component: FormulaComponent;

        if (part.match(/^\d*D\d+$/i)) {
          component = { type: 'dice', value: part.toUpperCase(), operator: currentOperator };
        } else if (part === 'DB') {
          component = { type: 'db', operator: currentOperator };
        } else if (part.match(/half\s*DB/i)) {
          component = { type: 'halfDb', operator: currentOperator };
        } else if (part === 'BUILD') {
          component = { type: 'build', operator: currentOperator };
        } else if (part.match(/STR\/5/i)) {
          component = { type: 'strFifth', operator: currentOperator };
        } else if (!isNaN(Number(part))) {
          component = { type: 'fixed', value: Number(part), operator: currentOperator };
        } else {
          return; // Skip unknown parts
        }

        this.damageFormula.push(component);
      }
    });
  }

  /**
   * Toggle damage formula editor
   */
  toggleDamageFormulaEditor(): void {
    if (!this.showDamageFormulaEditor) {
      this.parseDamageToFormula(this.newCustomWeapon.damage);
    }
    this.showDamageFormulaEditor = !this.showDamageFormulaEditor;
  }

  /**
   * Get available range options
   */
  getRangeOptions(): string[] {
    return [
      '-',
      'Touch',
      '3 yards',
      '5 yards',
      '10 yards',
      '15 yards',
      '20 yards',
      '30 yards',
      '50 yards',
      '80 yards',
      '100 yards',
      '110 yards',
      '150 yards',
      'STR/5 yards'
    ];
  }

  /**
   * Get display value for formula component type
   */
  getFormulaComponentLabel(type: FormulaComponent['type']): string {
    const labels: Record<FormulaComponent['type'], string> = {
      'dice': 'Dé',
      'fixed': 'Valeur fixe',
      'db': 'Dégâts d\'Impact',
      'halfDb': '½ Dégâts d\'Impact',
      'build': 'Carrure',
      'strFifth': 'FOR/5'
    };
    return labels[type];
  }
}

