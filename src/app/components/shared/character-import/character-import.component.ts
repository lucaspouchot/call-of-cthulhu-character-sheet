import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterImportExportService, ImportResult, ValidationError } from '../../../services/character-import-export.service';
import { CharacterService } from '../../../services/character.service';
import { CharacterSheet } from '../../../models/character.model';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-character-import',
  imports: [CommonModule, FormsModule, DynamicTranslatePipe, ModalComponent],
  templateUrl: './character-import.component.html',
  styleUrl: './character-import.component.css'
})
export class CharacterImportComponent {
  @Output() importComplete = new EventEmitter<void>();

  isProcessing = false;
  importResult: ImportResult | null = null;
  showConflictDialog = false;
  conflictingCharacter: CharacterSheet | null = null;
  importedCharacter: CharacterSheet | null = null;

  // YAML Editor
  yamlContent: string = '';
  importMode: 'file' | 'text' = 'file';
  validationErrors: ValidationError[] = [];
  isValidYaml: boolean = true;

  constructor(
    private importExportService: CharacterImportExportService,
    private characterService: CharacterService,
    private cdr: ChangeDetectorRef
  ) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Use setTimeout to avoid blocking the event handler
    setTimeout(() => {
      this.processFile(file, input);
    }, 0);
  }

  private async processFile(file: File, input: HTMLInputElement): Promise<void> {
    this.isProcessing = true;
    this.importResult = null; // Clear previous results

    try {
      const result = await this.importExportService.importFromFile(file);

      if (result.success && result.character) {
        this.handleSuccessfulImport(result.character);
        // No need to set importResult - modal will close automatically
      } else {
        // Import failed - load content into editor for correction
        const content = await this.readFileAsText(file);
        this.yamlContent = content;
        this.importMode = 'text'; // Switch to text mode automatically
        this.cdr.detectChanges(); // Force UI update
        this.validateYamlContent();
        // Don't set importResult - validation errors will be shown instead
      }
    } catch (error) {
      // For file reading errors, load into editor
      try {
        const content = await this.readFileAsText(file);
        this.yamlContent = content;
        this.importMode = 'text';
        this.cdr.detectChanges(); // Force UI update
        this.validateYamlContent();
      } catch (readError) {
        // Only show error if we can't even read the file
        this.importResult = {
          success: false,
          errors: [{
            path: 'file',
            message: 'Unable to read file: ' + (readError instanceof Error ? readError.message : 'Unknown error')
          }]
        };
      }
    } finally {
      this.isProcessing = false;
      // Reset input
      input.value = '';
    }
  }

  onConflictResolution(shouldReplace: boolean): void {
    if (shouldReplace && this.importedCharacter) {
      this.performImport(this.importedCharacter);
    }

    this.showConflictDialog = false;
    this.conflictingCharacter = null;
    this.importedCharacter = null;
  }

  private performImport(character: CharacterSheet): void {
    // Check if character already exists
    const existing = this.characterService.getCharacterById(character.id);

    if (existing) {
      // Update existing character
      this.characterService.updateCharacter(character.id, character);
    } else {
      // This is a new character - we need to use the character service's internal method
      // Since we can't directly insert with a specific ID, we'll use updateCharacter which works for both
      const characters = this.characterService['charactersSubject'].value;
      const updated = [...characters.filter(c => c.id !== character.id), character];
      this.characterService['saveCharacters'](updated);
    }

    this.importComplete.emit();
  }

  closeResults(): void {
    this.importResult = null;
  }

  getErrorsText(): string {
    if (!this.importResult?.errors) {
      return '';
    }
    return this.importExportService.formatValidationErrors(this.importResult.errors);
  }

  // Switch between import modes
  switchToFileMode(): void {
    this.importMode = 'file';
    this.yamlContent = '';
    this.validationErrors = [];
    this.isValidYaml = true;
    this.importResult = null;
  }

  switchToTextMode(): void {
    this.importMode = 'text';
    this.importResult = null;
  }

  // YAML Text Editor methods
  onYamlContentChange(): void {
    this.validateYamlContent();
  }

  validateYamlContent(): void {
    if (!this.yamlContent.trim()) {
      this.validationErrors = [];
      this.isValidYaml = true;
      return;
    }

    this.validationErrors = this.importExportService.validateYaml(this.yamlContent);
    this.isValidYaml = this.validationErrors.length === 0;
  }

  importFromText(): void {
    if (!this.yamlContent.trim()) {
      return;
    }

    this.isProcessing = true;
    const result = this.importExportService.importFromYaml(this.yamlContent);
    this.importResult = result;

    if (result.success && result.character) {
      this.handleSuccessfulImport(result.character);
    }

    this.isProcessing = false;
  }

  private handleSuccessfulImport(character: CharacterSheet): void {
    // Check for conflict with existing character
    const existing = this.characterService.getCharacterById(character.id);

    if (existing) {
      // Compare dates to determine if we should warn the user
      const existingDate = new Date(existing.updatedAt);
      const importedDate = new Date(character.updatedAt);

      if (existingDate > importedDate) {
        // Existing character is newer - show conflict dialog
        this.conflictingCharacter = existing;
        this.importedCharacter = character;
        this.showConflictDialog = true;
      } else {
        // Imported character is newer or same - import directly
        this.performImport(character);
      }
    } else {
      // No conflict - import directly
      this.performImport(character);
    }
  }

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
}
