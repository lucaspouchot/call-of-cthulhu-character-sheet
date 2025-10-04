import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCardComponent } from '../base-card.component';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-movement-card',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './movement-card.component.html',
  styleUrl: './movement-card.component.css'
})
export class MovementCardComponent extends BaseCardComponent {

  protected getSectionName(): string {
    return 'movement';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = { ...this.character.movement };
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.movement = { ...this.originalData };
    }
  }
}