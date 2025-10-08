import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-skill-test-rules',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './skill-test-rules.component.html',
  styleUrl: './skill-test-rules.component.css'
})
export class SkillTestRulesComponent {
}
