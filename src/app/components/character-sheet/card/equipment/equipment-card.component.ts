import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent } from '../base-card.component';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-equipment-card',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe, FormsModule],
  templateUrl: './equipment-card.component.html',
  styleUrl: './equipment-card.component.css'
})
export class EquipmentCardComponent extends BaseCardComponent {
  newItemName: string = '';
  editingItems: { [index: number]: string } = {};

  protected getSectionName(): string {
    return 'equipment';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = [...this.character.equipment];
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.equipment = [...this.originalData];
    }
  }

  addItem(): void {
    if (this.newItemName.trim()) {
      this.character.equipment.push(this.newItemName.trim());
      this.newItemName = '';
    }
  }

  removeItem(index: number): void {
    this.character.equipment.splice(index, 1);
  }

  startEditItem(index: number): void {
    this.editingItems[index] = this.character.equipment[index];
  }

  saveEditItem(index: number): void {
    if (this.editingItems[index]?.trim()) {
      this.character.equipment[index] = this.editingItems[index].trim();
    }
    delete this.editingItems[index];
  }

  cancelEditItem(index: number): void {
    delete this.editingItems[index];
  }

  isEditingItem(index: number): boolean {
    return index in this.editingItems;
  }
}