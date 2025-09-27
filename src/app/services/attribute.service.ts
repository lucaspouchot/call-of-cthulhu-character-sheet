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