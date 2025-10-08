import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';
import { NoteItem } from '../../../models/character.model';

@Component({
  selector: 'app-note-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, DynamicTranslatePipe],
  templateUrl: './note-edit-modal.component.html',
  styleUrl: './note-edit-modal.component.css'
})
export class NoteEditModalComponent {
  @Input() isOpen = false;
  @Input() note: NoteItem | null = null;
  @Input() isCreating = false;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<{ title: string; description: string }>();
  @Output() close = new EventEmitter<void>();

  editedTitle = '';
  editedDescription = '';

  ngOnChanges(): void {
    if (this.isCreating) {
      this.editedTitle = '';
      this.editedDescription = '';
    } else if (this.note) {
      this.editedTitle = this.note.title || '';
      this.editedDescription = this.note.description || '';
    }
  }

  onSave(): void {
    if (this.editedTitle.trim() && this.editedDescription.trim()) {
      this.save.emit({
        title: this.editedTitle.trim(),
        description: this.editedDescription.trim()
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  canSave(): boolean {
    return this.editedTitle.trim() !== '' && this.editedDescription.trim() !== '';
  }
}
