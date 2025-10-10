import { Injectable } from '@angular/core';
import * as yaml from 'js-yaml';
import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { CharacterSheet } from '../models/character.model';
import { CHARACTER_SCHEMA, CHARACTER_SCHEMA_VERSION } from '../models/character-schema';

export interface ValidationError {
  path: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  character?: CharacterSheet;
  errors?: ValidationError[];
  warnings?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CharacterImportExportService {
  private ajv: Ajv;
  private validator: ValidateFunction;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(this.ajv);
    this.validator = this.ajv.compile(CHARACTER_SCHEMA);
  }

  /**
   * Export a character to YAML format
   */
  exportToYaml(character: CharacterSheet): string {
    // Ensure version is set and serialize dates
    const characterForExport = this.serializeDates({
      ...character,
      version: character.version || CHARACTER_SCHEMA_VERSION
    });

    return yaml.dump(characterForExport, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false
    });
  }

  /**
   * Export a character and trigger download
   */
  downloadCharacterYaml(character: CharacterSheet): void {
    const yamlContent = this.exportToYaml(character);
    const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Sanitize filename
    const sanitizedName = character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `character_${sanitizedName}_${timestamp}.yaml`;

    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Import a character from YAML content
   */
  importFromYaml(yamlContent: string): ImportResult {
    try {
      // Parse YAML
      const data = yaml.load(yamlContent) as any;

      // Validate against schema
      const valid = this.validator(data);

      if (!valid && this.validator.errors) {
        const errors: ValidationError[] = this.validator.errors.map(error => ({
          path: error.instancePath || error.schemaPath,
          message: error.message || 'Validation error'
        }));

        return {
          success: false,
          errors
        };
      }

      // Check version and migrate if necessary
      const warnings: string[] = [];
      let character = data as CharacterSheet;

      if (!character.version || character.version < CHARACTER_SCHEMA_VERSION) {
        character = this.migrateCharacter(character);
        warnings.push(`Character migrated from version ${character.version || 0} to ${CHARACTER_SCHEMA_VERSION}`);
      }

      // Convert date strings back to Date objects
      character = this.deserializeDates(character);

      return {
        success: true,
        character,
        warnings: warnings.length > 0 ? warnings : undefined
      };

    } catch (error) {
      return {
        success: false,
        errors: [{
          path: 'root',
          message: error instanceof Error ? error.message : 'Failed to parse YAML'
        }]
      };
    }
  }

  /**
   * Import character from a file
   */
  async importFromFile(file: File): Promise<ImportResult> {
    try {
      const content = await this.readFileAsText(file);
      return this.importFromYaml(content);
    } catch (error) {
      return {
        success: false,
        errors: [{
          path: 'file',
          message: error instanceof Error ? error.message : 'Failed to read file'
        }]
      };
    }
  }

  /**
   * Validate YAML content and return errors
   */
  validateYaml(yamlContent: string): ValidationError[] {
    try {
      const data = yaml.load(yamlContent);
      const valid = this.validator(data);

      if (!valid && this.validator.errors) {
        return this.validator.errors.map(error => ({
          path: error.instancePath || error.schemaPath,
          message: error.message || 'Validation error'
        }));
      }

      return [];
    } catch (error) {
      return [{
        path: 'root',
        message: error instanceof Error ? error.message : 'Failed to parse YAML'
      }];
    }
  }

  /**
   * Migrate character from older version to current version
   */
  private migrateCharacter(character: CharacterSheet): CharacterSheet {
    const currentVersion = character.version || 0;

    // Apply migrations sequentially
    let migratedCharacter = { ...character };

    // Migration from version 0 to 1
    if (currentVersion < 1) {
      migratedCharacter.version = 1;
      // Add any migration logic here for future versions
    }

    return migratedCharacter;
  }

  /**
   * Convert Date objects to ISO string format for YAML export
   */
  private serializeDates(character: CharacterSheet): any {
    const result: any = { ...character };

    // Convert main dates
    if (result.createdAt instanceof Date) {
      result.createdAt = result.createdAt.toISOString();
    }
    if (result.updatedAt instanceof Date) {
      result.updatedAt = result.updatedAt.toISOString();
    }

    // Convert sanity loss dates
    if (result.sanity?.losses) {
      result.sanity = {
        ...result.sanity,
        losses: result.sanity.losses.map((loss: any) => ({
          ...loss,
          date: loss.date instanceof Date ? loss.date.toISOString() : loss.date
        }))
      };
    }

    // Convert modifier dates
    const convertModifiers = (modifiers: any[]) => {
      return modifiers.map(mod => ({
        ...mod,
        createdAt: mod.createdAt instanceof Date ? mod.createdAt.toISOString() : mod.createdAt
      }));
    };

    if (result.hitPoints?.modifiers) {
      result.hitPoints = {
        ...result.hitPoints,
        modifiers: convertModifiers(result.hitPoints.modifiers)
      };
    }
    if (result.sanity?.modifiers) {
      result.sanity = {
        ...result.sanity,
        modifiers: convertModifiers(result.sanity.modifiers)
      };
    }
    if (result.luck?.modifiers) {
      result.luck = {
        ...result.luck,
        modifiers: convertModifiers(result.luck.modifiers)
      };
    }
    if (result.magicPoints?.modifiers) {
      result.magicPoints = {
        ...result.magicPoints,
        modifiers: convertModifiers(result.magicPoints.modifiers)
      };
    }

    // Convert skill modifier dates
    if (result.skills) {
      result.skills = result.skills.map((skill: any) => ({
        ...skill,
        modifiers: skill.modifiers ? convertModifiers(skill.modifiers) : undefined
      }));
    }

    // Convert finance expense history dates
    if (result.finance?.expenseHistory) {
      result.finance = {
        ...result.finance,
        expenseHistory: result.finance.expenseHistory.map((expense: any) => ({
          ...expense,
          date: expense.date instanceof Date ? expense.date.toISOString() : expense.date
        }))
      };
    }

    return result;
  }

  /**
   * Convert date strings back to Date objects
   */
  private deserializeDates(character: CharacterSheet): CharacterSheet {
    const result = { ...character };

    // Convert main dates
    if (typeof result.createdAt === 'string') {
      result.createdAt = new Date(result.createdAt);
    }
    if (typeof result.updatedAt === 'string') {
      result.updatedAt = new Date(result.updatedAt);
    }

    // Convert sanity loss dates
    if (result.sanity?.losses) {
      result.sanity.losses = result.sanity.losses.map(loss => ({
        ...loss,
        date: typeof loss.date === 'string' ? new Date(loss.date) : loss.date
      }));
    }

    // Convert modifier dates
    const convertModifiers = (modifiers: any[]) => {
      return modifiers.map(mod => ({
        ...mod,
        createdAt: typeof mod.createdAt === 'string' ? new Date(mod.createdAt) : mod.createdAt
      }));
    };

    if (result.hitPoints?.modifiers) {
      result.hitPoints.modifiers = convertModifiers(result.hitPoints.modifiers);
    }
    if (result.sanity?.modifiers) {
      result.sanity.modifiers = convertModifiers(result.sanity.modifiers);
    }
    if (result.luck?.modifiers) {
      result.luck.modifiers = convertModifiers(result.luck.modifiers);
    }
    if (result.magicPoints?.modifiers) {
      result.magicPoints.modifiers = convertModifiers(result.magicPoints.modifiers);
    }

    // Convert skill modifier dates
    if (result.skills) {
      result.skills = result.skills.map(skill => ({
        ...skill,
        modifiers: skill.modifiers ? convertModifiers(skill.modifiers) : undefined
      }));
    }

    // Convert finance expense history dates
    if (result.finance?.expenseHistory) {
      result.finance.expenseHistory = result.finance.expenseHistory.map(expense => ({
        ...expense,
        date: typeof expense.date === 'string' ? new Date(expense.date) : expense.date
      }));
    }

    return result;
  }

  /**
   * Read a file as text
   */
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Get a human-readable description of validation errors
   */
  formatValidationErrors(errors: ValidationError[]): string {
    return errors
      .map(error => `${error.path}: ${error.message}`)
      .join('\n');
  }
}
