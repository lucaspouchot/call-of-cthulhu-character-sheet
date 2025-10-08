import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-profile-entry-modal',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './profile-entry-modal.component.html',
  styleUrl: './profile-entry-modal.component.css'
})
export class ProfileEntryModalComponent {
  @Input() fieldName!: string;
  @Input() content!: string;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
