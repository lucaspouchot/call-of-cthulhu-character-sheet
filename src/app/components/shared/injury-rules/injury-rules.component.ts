import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-injury-rules',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './injury-rules.component.html',
  styleUrl: './injury-rules.component.css'
})
export class InjuryRulesComponent {
}
