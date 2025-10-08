import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent } from '../base-card.component';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { EquipmentItem } from '../../../../models/character.model';
import { EquipmentNoteModalComponent } from '../../../shared/equipment-note-modal/equipment-note-modal.component';

@Component({
  selector: 'app-equipment-card',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe, FormsModule, EquipmentNoteModalComponent],
  templateUrl: './equipment-card.component.html',
  styleUrl: './equipment-card.component.css'
})
export class EquipmentCardComponent extends BaseCardComponent {
  newItemName: string = '';
  editingItems: { [index: number]: EquipmentItem } = {};
  isNoteModalOpen = false;
  selectedItem: EquipmentItem | null = null;

  protected getSectionName(): string {
    return 'equipment';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = this.character.equipment.map(item => ({ ...item }));
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.equipment = this.originalData.map((item: EquipmentItem) => ({ ...item }));
    }
  }

  addItem(): void {
    if (this.newItemName.trim()) {
      const newItem: EquipmentItem = {
        id: this.generateId(),
        name: this.newItemName.trim()
      };
      this.character.equipment.push(newItem);
      this.newItemName = '';
    }
  }

  removeItem(index: number): void {
    this.character.equipment.splice(index, 1);
  }

  startEditItem(index: number): void {
    this.editingItems[index] = { ...this.character.equipment[index] };
  }

  saveEditItem(index: number): void {
    if (this.editingItems[index]?.name.trim()) {
      this.character.equipment[index] = { ...this.editingItems[index] };
    }
    delete this.editingItems[index];
  }

  cancelEditItem(index: number): void {
    delete this.editingItems[index];
  }

  isEditingItem(index: number): boolean {
    return index in this.editingItems;
  }

  openNoteModal(item: EquipmentItem): void {
    this.selectedItem = item;
    this.isNoteModalOpen = true;
  }

  closeNoteModal(): void {
    this.isNoteModalOpen = false;
    this.selectedItem = null;
  }

  saveNote(note: string | undefined): void {
    if (this.selectedItem) {
      const index = this.character.equipment.findIndex(item => item.id === this.selectedItem!.id);
      if (index !== -1) {
        this.character.equipment[index].note = note;
        if (this.isInEditMode()) {
          // Auto-save when in edit mode
          this.saveCharacterData();
        }
      }
    }
    this.closeNoteModal();
  }

  private generateId(): string {
    return `equipment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}