import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';
import { SkillManagementService } from '../../../services/skill-management.service';
import { SKILL_DEFINITIONS } from '../../../models/skill-definitions.model';
import { Skill } from '../../../models/character.model';

/**
 * Reusable component for selecting or creating skills
 * Can be used in character creation and character sheet editing
 */
@Component({
  selector: 'app-skill-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTranslatePipe],
  templateUrl: './skill-selector.component.html',
  styleUrl: './skill-selector.component.css'
})
export class SkillSelectorComponent implements OnChanges {
  // Configuration inputs
  @Input() forcedBaseSkill?: string; // Force a specific base skill for specialization
  @Input() allowCustomSkill = true; // Allow creating custom skills
  @Input() allowSpecializedSkill = true; // Allow creating specialized skills
  @Input() existingSkillIds: string[] = []; // List of already selected/created skills to prevent duplicates
  @Input() title?: string; // Optional custom title for the selector
  @Input() showInitialPoints = false; // Show initial points input (for character sheet edit mode)

  // Output events
  @Output() skillSelected = new EventEmitter<Skill>(); // Emits when a skill is selected/created
  @Output() skillAdded = new EventEmitter<Skill>(); // Emits when a skill is added (with initial points)

  // Form state
  newSkillType: 'custom' | 'specialized' = 'custom';
  newSkillName = '';
  newSkillInitialPoints = 0;
  selectedBaseSkill = '';
  selectedSpecialization = '';
  customSpecializationName = '';

  // Available base skills for specialization (cached to avoid infinite loop)
  specializableSkills = SKILL_DEFINITIONS.filter(def => def.isSpecializable && def.requiresSpecialization);

  // Cached available specializations for selected base skill
  private _cachedSpecializations: Array<{ id: string; baseValue: number }> = [];
  private _cachedBaseSkillId: string = '';

  constructor(
    private skillManagementService: SkillManagementService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset form when forcedBaseSkill changes
    if (changes['forcedBaseSkill'] && !changes['forcedBaseSkill'].firstChange) {
      this.resetForm();
    }

    // If we have a forced base skill, set it and switch to specialized mode
    if (this.forcedBaseSkill) {
      this.newSkillType = 'specialized';
      this.selectedBaseSkill = this.forcedBaseSkill;

      // Disable custom skill option when base skill is forced
      this.allowCustomSkill = false;
    }
  }

  /**
   * Reset the form to initial state
   */
  resetForm(): void {
    this.newSkillType = this.forcedBaseSkill ? 'specialized' : 'custom';
    this.newSkillName = '';
    this.newSkillInitialPoints = 0;
    this.selectedBaseSkill = this.forcedBaseSkill || '';
    this.selectedSpecialization = '';
    this.customSpecializationName = '';
  }

  /**
   * Get available specializations for selected base skill
   */
  getAvailableSpecializations(): Array<{ id: string; baseValue: number }> {
    const baseSkillId = this.selectedBaseSkill || this.forcedBaseSkill || '';

    if (!baseSkillId) {
      this._cachedSpecializations = [];
      this._cachedBaseSkillId = '';
      return [];
    }

    // Only recalculate if the base skill has changed
    if (this._cachedBaseSkillId !== baseSkillId) {
      this._cachedBaseSkillId = baseSkillId;
      this._cachedSpecializations = this.skillManagementService.getSuggestedSpecializations(baseSkillId);

      // Filter out already existing skills
      this._cachedSpecializations = this._cachedSpecializations.filter(
        spec => !this.existingSkillIds.includes(spec.id)
      );
    }

    return this._cachedSpecializations;
  }

  /**
   * Check if we can use predefined specialization
   */
  canUsePredef(): boolean {
    return this.getAvailableSpecializations().length > 0;
  }

  /**
   * Create and emit a new skill
   */
  addNewSkill(): void {
    let newSkill: Skill | null = null;

    try {
      if (this.newSkillType === 'custom') {
        // Create completely custom skill
        if (!this.newSkillName.trim()) {
          console.error('Custom skill name is required');
          return;
        }
        newSkill = this.skillManagementService.createCustomSkill(this.newSkillName.trim());
      } else if (this.newSkillType === 'specialized') {
        // Create specialized skill
        const baseSkillId = this.selectedBaseSkill || this.forcedBaseSkill;

        if (!baseSkillId) {
          console.error('Base skill must be selected');
          return;
        }

        if (this.selectedSpecialization) {
          // Use predefined specialization
          newSkill = this.skillManagementService.createSpecializedSkill(
            baseSkillId,
            undefined,
            this.selectedSpecialization
          );
        } else if (this.customSpecializationName.trim()) {
          // Use custom specialization name
          newSkill = this.skillManagementService.createSpecializedSkill(
            baseSkillId,
            this.customSpecializationName.trim()
          );
        } else {
          console.error('Specialization must be selected or custom name provided');
          return;
        }
      }

      if (newSkill) {
        // Check if skill already exists
        if (this.existingSkillIds.includes(newSkill.id)) {
          console.error('Skill already exists');
          return;
        }

        // Apply initial points if specified and enabled
        if (this.showInitialPoints && this.newSkillInitialPoints > 0) {
          newSkill.personalValue = this.newSkillInitialPoints;
          newSkill.totalValue = newSkill.baseValue + this.newSkillInitialPoints;
          this.skillAdded.emit(newSkill);
        } else {
          this.skillSelected.emit(newSkill);
        }

        // Reset form for next skill
        this.resetForm();
      }
    } catch (error) {
      console.error('Error adding new skill:', error);
    }
  }

  /**
   * Check if the add button should be disabled
   */
  isAddButtonDisabled(): boolean {
    // If showing initial points, require at least 1 point
    if (this.showInitialPoints && this.newSkillInitialPoints < 1) {
      return true;
    }

    if (this.newSkillType === 'custom') {
      return !this.newSkillName.trim();
    }

    if (this.newSkillType === 'specialized') {
      const baseSkillId = this.selectedBaseSkill || this.forcedBaseSkill;
      if (!baseSkillId) {
        return true;
      }
      return !this.selectedSpecialization && !this.customSpecializationName.trim();
    }

    return true;
  }

  /**
   * Check if we should show the skill type selector
   */
  shouldShowTypeSelector(): boolean {
    // Don't show if base skill is forced (only specialized mode allowed)
    if (this.forcedBaseSkill) {
      return false;
    }
    // Show if both custom and specialized are allowed
    return this.allowCustomSkill && this.allowSpecializedSkill;
  }
}
