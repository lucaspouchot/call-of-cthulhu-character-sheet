import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent } from '../base-card.component';
import { Sex } from '../../../../models/character.model';
import { OCCUPATIONS } from '../../../../models/occupation.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { EntityTranslationService } from '../../../../services/entity-translation.service';

@Component({
  selector: 'app-basic-info-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTranslatePipe],
  templateUrl: './basic-info-card.component.html',
  styleUrl: './basic-info-card.component.css'
})
export class BasicInfoCardComponent extends BaseCardComponent {
  @Input() onAgeChange?: () => void;

  sexValues = Sex;
  occupations = OCCUPATIONS;

  constructor(private entityTranslationService: EntityTranslationService) {
    super();
  }

  protected getSectionName(): string {
    return 'personal';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = {
        player: this.character.player,
        age: this.character.age,
        occupation: this.character.occupation,
        sex: this.character.sex,
        residence: this.character.residence,
        birthplace: this.character.birthplace
      };
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.player = this.originalData.player;
      this.character.age = this.originalData.age;
      this.character.occupation = this.originalData.occupation;
      this.character.sex = this.originalData.sex;
      this.character.residence = this.originalData.residence;
      this.character.birthplace = this.originalData.birthplace;
    }
  }

  getSexTranslation(sex: Sex): string {
    return this.entityTranslationService.getSexTranslation(sex);
  }

  getOccupationName(occupationId: string): string {
    return this.entityTranslationService.getOccupationName(occupationId);
  }

  onAgeChangeEvent(): void {
    if (this.onAgeChange) {
      this.onAgeChange();
    }
    this.characterChange.emit(this.character);
  }
}