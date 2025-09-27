import { Injectable } from '@angular/core';
import { Attribute } from '../models/character.model';

/**
 * Service for handling character attributes
 * Provides methods for creating, updating, and managing character attributes
 */
@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  /**
   * Create an attribute with calculated half and fifth values
   */
  createAttribute(value: number): Attribute {
    return {
      value,
      halfValue: Math.floor(value / 2),
      fifthValue: Math.floor(value / 5)
    };
  }

  /**
   * Update an attribute's derived values
   */
  updateAttribute(attribute: Attribute): Attribute {
    return this.createAttribute(attribute.value);
  }

  /**
   * Initialize all character attributes with zero values
   */
  initializeAttributes(attributeNames: string[]): Record<string, Attribute> {
    const attributes: Record<string, Attribute> = {};
    attributeNames.forEach(name => {
      attributes[name] = this.createAttribute(0);
    });
    return attributes;
  }

  /**
   * Apply age modifiers to attributes
   */
  applyAgeModifiers(
    attributes: Record<string, Attribute>,
    modifiers: {
      strengthReduction: number;
      constitutionReduction: number;
      dexterityReduction: number;
      appearanceReduction: number;
      educationBonus: number;
    }
  ): Record<string, Attribute> {
    const updatedAttributes = { ...attributes };

    // Apply strength reduction
    if (modifiers.strengthReduction > 0 && updatedAttributes['strength']) {
      const newValue = Math.max(3, updatedAttributes['strength'].value - modifiers.strengthReduction);
      updatedAttributes['strength'] = this.createAttribute(newValue);
    }

    // Apply constitution reduction
    if (modifiers.constitutionReduction > 0 && updatedAttributes['constitution']) {
      const newValue = Math.max(3, updatedAttributes['constitution'].value - modifiers.constitutionReduction);
      updatedAttributes['constitution'] = this.createAttribute(newValue);
    }

    // Apply dexterity reduction
    if (modifiers.dexterityReduction > 0 && updatedAttributes['dexterity']) {
      const newValue = Math.max(3, updatedAttributes['dexterity'].value - modifiers.dexterityReduction);
      updatedAttributes['dexterity'] = this.createAttribute(newValue);
    }

    // Apply appearance reduction
    if (modifiers.appearanceReduction > 0 && updatedAttributes['appearance']) {
      const newValue = Math.max(3, updatedAttributes['appearance'].value - modifiers.appearanceReduction);
      updatedAttributes['appearance'] = this.createAttribute(newValue);
    }

    // Apply education bonus
    if (modifiers.educationBonus > 0 && updatedAttributes['education']) {
      const newValue = Math.min(99, updatedAttributes['education'].value + modifiers.educationBonus);
      updatedAttributes['education'] = this.createAttribute(newValue);
    }

    return updatedAttributes;
  }

  /**
   * Calculate derived statistics from attributes
   */
  calculateDerivedStats(attributes: Record<string, Attribute>, luck: Attribute, age: number) {
    const hitPoints = Math.floor((attributes['constitution'].value + attributes['size'].value) / 10);
    const sanity = attributes['power'].value;
    const magicPoints = Math.floor(attributes['power'].value / 5);

    // Movement calculation based on age
    let move = 8;
    if (age >= 40) move = 7;
    if (age >= 50) move = 6;
    if (age >= 60) move = 5;

    return {
      hitPoints,
      sanity,
      magicPoints,
      luck: luck.value,
      movement: {
        normal: move,
        running: move * 5,
        climbing: Math.floor(move / 2),
        swimming: Math.floor(move / 2)
      }
    };
  }

  /**
   * Validate that all attributes have valid values
   */
  validateAttributes(attributes: Record<string, Attribute>, attributeNames: string[]): boolean {
    return attributeNames.every(name => {
      const attr = attributes[name];
      return attr && attr.value > 0 && attr.value <= 99;
    });
  }

  /**
   * Calculate build from strength and size
   */
  calculateBuild(strength: number, size: number): number {
    const total = strength + size;
    if (total <= 64) return -2;
    if (total <= 84) return -1;
    if (total <= 124) return 0;
    if (total <= 164) return 1;
    if (total <= 204) return 2;
    if (total <= 284) return 3;
    if (total <= 364) return 4;
    if (total <= 444) return 5;
    return 6; // 445+
  }

  /**
   * Calculate damage bonus from build
   */
  calculateDamageBonus(build: number): string {
    switch (build) {
      case -2: return '-2';
      case -1: return '-1';
      case 0: return '0';
      case 1: return '+1d4';
      case 2: return '+1d6';
      case 3: return '+2d6';
      case 4: return '+3d6';
      case 5: return '+4d6';
      default: return '+5d6';
    }
  }
}