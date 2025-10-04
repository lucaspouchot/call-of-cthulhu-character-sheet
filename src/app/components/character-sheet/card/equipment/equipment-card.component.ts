import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCardComponent } from '../base-card.component';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-equipment-card',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './equipment-card.component.html',
  styleUrl: './equipment-card.component.css'
})
export class EquipmentCardComponent extends BaseCardComponent {

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
}