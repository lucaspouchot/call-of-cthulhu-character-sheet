import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';

export type ModalType = 'dialog' | 'form' | 'confirm';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() type: ModalType = 'dialog';
  @Input() closeOnClickOutside = true;
  @Input() contentTemplate?: TemplateRef<any>;
  @Input() maxWidth = 'max-w-2xl'; // Default max width
  @Input() disableConfirm = false; // For confirm mode: disable OK button
  @Input() isDestructive = false; // For confirm mode: use red/delete style (true) or blue/ok style (false)

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<boolean>();

  onBackdropClick(): void {
    if (this.closeOnClickOutside) {
      this.close.emit(false);
    }
  }

  onClose(): void {
    this.close.emit(false);
  }

  onSave(): void {
    this.save.emit();
  }

  onConfirmOk(): void {
    this.close.emit(true);
  }

  onConfirmCancel(): void {
    this.close.emit(false);
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
