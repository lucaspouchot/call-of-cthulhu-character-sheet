import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { CharacterSheet } from '../../models/character.model';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { DynamicTranslatePipe } from '../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-character-list',
  imports: [CommonModule, LanguageSwitcherComponent, DynamicTranslatePipe],
  templateUrl: './character-list.html',
  styleUrl: './character-list.css'
})
export class CharacterListComponent implements OnInit {
  characters: CharacterSheet[] = [];

  constructor(
    private characterService: CharacterService,
    private router: Router
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

  deleteCharacter(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this character?')) {
      this.characterService.deleteCharacter(id);
    }
  }
}
