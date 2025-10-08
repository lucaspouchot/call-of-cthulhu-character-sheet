import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiceRoll } from '../../../models/dice.model';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-dice-history',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './dice-history.component.html',
  styleUrl: './dice-history.component.css'
})
export class DiceHistoryComponent {
  @Input() rollHistory: DiceRoll[] = [];
}
