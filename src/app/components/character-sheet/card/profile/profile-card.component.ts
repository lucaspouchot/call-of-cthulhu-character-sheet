import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent } from '../base-card.component';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { ProfileEntryModalComponent } from '../../../shared/profile-entry-modal/profile-entry-modal.component';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTranslatePipe, ProfileEntryModalComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent extends BaseCardComponent {
  selectedFieldToAdd = '';
  newFieldDescription = '';
  showAddForm = false;
  selectedFieldName = '';
  selectedFieldContent = '';
  isModalOpen = false;
  availableFieldsCache: string[] = [];

  // All possible profile fields
  allProfileFields = [
    'backstory',
    'traits',
    'ideologyBeliefs',
    'significantPeople',
    'meaningfulLocations',
    'treasuredPossessions',
    'scarsInjuries',
    'phobiasManias',
    'occultTomes',
    'entityEncounters'
  ];

  protected getSectionName(): string {
    return 'profile';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = {
        backstory: this.character.backstory,
        traits: this.character.traits,
        ideologyBeliefs: this.character.ideologyBeliefs,
        significantPeople: this.character.significantPeople,
        meaningfulLocations: this.character.meaningfulLocations,
        treasuredPossessions: this.character.treasuredPossessions,
        scarsInjuries: this.character.scarsInjuries,
        phobiasManias: this.character.phobiasManias,
        occultTomes: this.character.occultTomes,
        entityEncounters: this.character.entityEncounters
      };
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.backstory = this.originalData.backstory;
      this.character.traits = this.originalData.traits;
      this.character.ideologyBeliefs = this.originalData.ideologyBeliefs;
      this.character.significantPeople = this.originalData.significantPeople;
      this.character.meaningfulLocations = this.originalData.meaningfulLocations;
      this.character.treasuredPossessions = this.originalData.treasuredPossessions;
      this.character.scarsInjuries = this.originalData.scarsInjuries;
      this.character.phobiasManias = this.originalData.phobiasManias;
      this.character.occultTomes = this.originalData.occultTomes;
      this.character.entityEncounters = this.originalData.entityEncounters;
    }
  }

  // Get fields that have content (non-empty)
  getFilledFields(): string[] {
    return this.allProfileFields.filter(field => {
      const value = this.character[field as keyof typeof this.character] as string;
      return value && typeof value === 'string' && value.trim().length > 0;
    });
  }

  // Get fields that are empty (available to add)
  getAvailableFields(): string[] {
    return this.allProfileFields.filter(field => {
      const value = this.character[field as keyof typeof this.character] as string;
      return !value || typeof value !== 'string' || value.trim().length === 0;
    });
  }

  // Check if there's any content
  hasAnyContent(): boolean {
    return this.getFilledFields().length > 0;
  }

  // Show the add field form
  openAddFieldForm(): void {
    this.availableFieldsCache = this.getAvailableFields();
    this.showAddForm = true;
    this.selectedFieldToAdd = '';
    this.newFieldDescription = '';
  }

  // Cancel adding a field
  cancelAddField(): void {
    this.showAddForm = false;
    this.selectedFieldToAdd = '';
    this.newFieldDescription = '';
    this.availableFieldsCache = [];
  }

  // Add the selected field
  addSelectedField(): void {
    if (this.selectedFieldToAdd && this.newFieldDescription.trim()) {
      // Initialize the field with the description
      (this.character as any)[this.selectedFieldToAdd] = this.newFieldDescription.trim();
      this.showAddForm = false;
      this.selectedFieldToAdd = '';
      this.newFieldDescription = '';
      this.availableFieldsCache = [];
      // Don't emit change here to avoid infinite loop
      // The field will be saved when user saves the card
    }
  }

  // Remove a field (set to empty string)
  removeField(fieldName: string): void {
    (this.character as any)[fieldName] = '';
    // Don't emit change here, will be saved when user saves the card
  }

  // Get field value
  getFieldValue(fieldName: string): string {
    const value = this.character[fieldName as keyof typeof this.character] as string;
    return (value && typeof value === 'string') ? value : '';
  }

  // Set field value
  setFieldValue(fieldName: string, value: string): void {
    (this.character as any)[fieldName] = value;
    // Don't emit change here, will be saved when user saves the card
  }

  // Open modal to view field content
  openFieldModal(fieldName: string): void {
    this.selectedFieldName = fieldName;
    this.selectedFieldContent = this.getFieldValue(fieldName);
    this.isModalOpen = true;
  }

  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedFieldName = '';
    this.selectedFieldContent = '';
  }
}
