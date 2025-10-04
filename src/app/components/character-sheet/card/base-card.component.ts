import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CharacterSheet as CharacterModel } from '../../../models/character.model';

export interface CardEditMode {
  [key: string]: boolean;
}

/**
 * Composant de base abstrait pour toutes les cartes de la feuille de personnage
 * Fournit les fonctionnalités communes d'édition, sauvegarde et annulation
 */
@Component({
  template: ''
})
export abstract class BaseCardComponent {
  @Input() character!: CharacterModel;
  @Input() editMode: CardEditMode = {};

  @Output() characterChange = new EventEmitter<CharacterModel>();
  @Output() editModeChange = new EventEmitter<CardEditMode>();
  @Output() saveCharacter = new EventEmitter<void>();

  protected originalData: any = null;

  /**
   * Nom de la section pour les modes d'édition
   */
  protected abstract getSectionName(): string;

  /**
   * Sauvegarde les données originales avant modification
   */
  protected abstract saveOriginalData(): void;

  /**
   * Restaure les données originales en cas d'annulation
   */
  protected abstract restoreOriginalData(): void;

  /**
   * Active le mode édition pour cette carte
   */
  toggleEditMode(): void {
    const sectionName = this.getSectionName();

    if (!this.editMode[sectionName]) {
      // Entrer en mode édition
      this.saveOriginalData();
      this.editMode[sectionName] = true;
    } else {
      // Sortir du mode édition en sauvegardant
      this.saveCharacterData();
    }

    this.editModeChange.emit(this.editMode);
  }

  /**
   * Annule les modifications et sort du mode édition
   */
  cancelEdit(): void {
    const sectionName = this.getSectionName();

    this.restoreOriginalData();
    this.editMode[sectionName] = false;

    this.characterChange.emit(this.character);
    this.editModeChange.emit(this.editMode);
  }

  /**
   * Sauvegarde les modifications
   */
  saveCharacterData(): void {
    const sectionName = this.getSectionName();

    this.editMode[sectionName] = false;
    this.originalData = null;

    this.characterChange.emit(this.character);
    this.editModeChange.emit(this.editMode);
    this.saveCharacter.emit();
  }

  /**
   * Vérifie si cette carte est en mode édition
   */
  isInEditMode(): boolean {
    return this.editMode[this.getSectionName()] || false;
  }

  /**
   * Utilitaire pour cloner un objet
   */
  protected deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}