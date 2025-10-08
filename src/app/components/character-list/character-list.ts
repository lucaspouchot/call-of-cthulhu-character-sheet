import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { EntityTranslationService } from '../../services/entity-translation.service';
import { CharacterSheet } from '../../models/character.model';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { DynamicTranslatePipe } from '../../pipes/dynamic-translate.pipe';
import { ModalComponent } from '../shared/modal/modal.component';
import { DeleteConfirmationComponent } from '../shared/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-character-list',
  imports: [CommonModule, LanguageSwitcherComponent, DynamicTranslatePipe, ModalComponent, DeleteConfirmationComponent],
  templateUrl: './character-list.html',
  styleUrl: './character-list.css'
})
export class CharacterListComponent implements OnInit {
  characters: CharacterSheet[] = [];
  showDeleteModal = false;
  characterToDelete: CharacterSheet | null = null;
  deleteConfirmationValid = false;

  constructor(
    private characterService: CharacterService,
    private router: Router,
    private entityTranslationService: EntityTranslationService
  ) { }

  ngOnInit() {
    this.characterService.getCharacters().subscribe(characters => {
      this.characters = characters;
    });
  }

  createNewCharacter() {
    this.router.navigate(['/create']);
  }

  viewCharacter(id: string) {
    this.router.navigate(['/character', id]);
  }

  deleteCharacter(character: CharacterSheet, event: Event) {
    event.stopPropagation();
    this.characterToDelete = character;
    this.deleteConfirmationValid = false;
    this.showDeleteModal = true;
  }

  onDeleteConfirmationChange(isValid: boolean) {
    this.deleteConfirmationValid = isValid;
  }

  onDeleteModalClose(confirmed: boolean) {
    if (confirmed && this.characterToDelete) {
      this.characterService.deleteCharacter(this.characterToDelete.id);
    }
    this.showDeleteModal = false;
    this.characterToDelete = null;
    this.deleteConfirmationValid = false;
  }

  getOccupationName(occupationId: string): string {
    return this.entityTranslationService.getOccupationName(occupationId);
  }

  getEffectiveMaximum(character: CharacterSheet, attribute: 'hitPoints' | 'sanity' | 'magicPoints' | 'luck'): number {
    const attributeData = character[attribute];
    let baseMaximum: number;

    if (attribute === 'luck') {
      // Luck uses 'starting' instead of 'maximum'
      baseMaximum = (attributeData as any).starting;
    } else {
      baseMaximum = (attributeData as any).maximum;
    }

    const modifiers = attributeData.modifiers || [];
    const totalModifier = modifiers.reduce((sum, mod) => sum + mod.value, 0);
    return Math.max(0, baseMaximum + totalModifier);
  }
}
