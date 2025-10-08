import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiceRoll } from '../../../models/dice.model';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-dice-result',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './dice-result.component.html',
  styleUrl: './dice-result.component.css'
})
export class DiceResultComponent {
  @Input() roll!: DiceRoll;

  // Make Math available in template
  Math = Math;
}
