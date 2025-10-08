import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { DynamicTranslatePipe } from '../../../pipes/dynamic-translate.pipe';
import { EquipmentItem } from '../../../models/character.model';

@Component({
  selector: 'app-equipment-note-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, DynamicTranslatePipe],
  templateUrl: './equipment-note-modal.component.html',
  styleUrl: './equipment-note-modal.component.css'
})
export class EquipmentNoteModalComponent {
  @Input() isOpen = false;
  @Input() item: EquipmentItem | null = null;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<string | undefined>();
  @Output() close = new EventEmitter<void>();

  editedNote = '';

  ngOnChanges(): void {
    if (this.item) {
      this.editedNote = this.item.note || '';
    }
  }

  onSave(): void {
    this.save.emit(this.editedNote.trim() || undefined);
  }

  onClose(): void {
    this.close.emit();
  }
}
