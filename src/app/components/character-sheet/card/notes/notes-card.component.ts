import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseCardComponent } from '../base-card.component';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { NoteItem } from '../../../../models/character.model';
import { NoteEditModalComponent } from '../../../shared/note-edit-modal/note-edit-modal.component';
import { DragDropDirective, DragDropEvent } from '../../../../directives/drag-drop.directive';

@Component({
  selector: 'app-notes-card',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe, FormsModule, NoteEditModalComponent, DragDropDirective],
  templateUrl: './notes-card.component.html',
  styleUrl: './notes-card.component.css'
})
export class NotesCardComponent extends BaseCardComponent {
  isNoteModalOpen = false;
  selectedNote: NoteItem | null = null;
  isCreatingNote = false;

  protected getSectionName(): string {
    return 'notes';
  }

  protected saveOriginalData(): void {
    if (this.character) {
      this.originalData = this.character.notes.map(note => ({ ...note }));
    }
  }

  protected restoreOriginalData(): void {
    if (this.character && this.originalData) {
      this.character.notes = this.originalData.map((note: NoteItem) => ({ ...note }));
    }
  }

  openCreateNoteModal(): void {
    this.isCreatingNote = true;
    this.selectedNote = null;
    this.isNoteModalOpen = true;
  }

  openEditNoteModal(note: NoteItem): void {
    this.isCreatingNote = false;
    this.selectedNote = note;
    this.isNoteModalOpen = true;
  }

  closeNoteModal(): void {
    this.isNoteModalOpen = false;
    this.selectedNote = null;
    this.isCreatingNote = false;
  }

  saveNote(noteData: { title: string; description: string }): void {
    if (this.isCreatingNote) {
      // Create new note
      const newNote: NoteItem = {
        id: this.generateId(),
        title: noteData.title,
        description: noteData.description
      };
      this.character.notes.push(newNote);
    } else if (this.selectedNote) {
      // Update existing note
      const index = this.character.notes.findIndex(note => note.id === this.selectedNote!.id);
      if (index !== -1) {
        this.character.notes[index] = {
          ...this.character.notes[index],
          title: noteData.title,
          description: noteData.description
        };
      }
    }

    if (this.isInEditMode()) {
      // Auto-save when in edit mode
      this.saveCharacterData();
    }

    this.closeNoteModal();
  }

  removeNote(index: number): void {
    this.character.notes.splice(index, 1);
  }

  private generateId(): string {
    return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  onReorder(event: DragDropEvent): void {
    const { fromIndex, toIndex } = event;

    if (fromIndex === toIndex) return;

    // Remove the note from the old position
    const [movedNote] = this.character.notes.splice(fromIndex, 1);

    // Insert it at the new position
    this.character.notes.splice(toIndex, 0, movedNote);

    // Don't auto-save - user stays in edit mode and can save manually
  }
}
