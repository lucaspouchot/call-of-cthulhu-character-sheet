import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCardComponent } from '../base-card.component';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-background-card',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './background-card.component.html',
  styleUrl: './background-card.component.css'
})
export class BackgroundCardComponent extends BaseCardComponent {

  protected getSectionName(): string {
    return 'background';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = {
        backstory: this.character.backstory,
        traits: this.character.traits,
        ideologyBeliefs: this.character.ideologyBeliefs,
        significantPeople: this.character.significantPeople,
        meaningfulLocations: this.character.meaningfulLocations,
        treasuredPossessions: this.character.treasuredPossessions
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
    }
  }
}