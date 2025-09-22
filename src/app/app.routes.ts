import { Routes } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list';
import { CharacterCreation } from './components/character-creation/character-creation';
import { CharacterSheetComponent } from './components/character-sheet/character-sheet';

export const routes: Routes = [
  { path: '', component: CharacterListComponent },
  { path: 'create', component: CharacterCreation },
  { path: 'character/:id', component: CharacterSheetComponent },
  { path: '**', redirectTo: '' }
];
