import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocaleService } from '../../services/locale.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  imports: [CommonModule, FormsModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  selectedLocale: string = 'en';
  private subscription?: Subscription;

  constructor(private localeService: LocaleService) { }

  ngOnInit(): void {
    // Initialiser avec la locale actuelle
    this.selectedLocale = this.localeService.getCurrentLocale();

    // S'abonner aux changements de locale pour maintenir la sync
    this.subscription = this.localeService.locale$.subscribe(locale => {
      this.selectedLocale = locale;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get availableLocales() {
    return this.localeService.getAvailableLocales();
  }

  onLocaleChange(): void {
    if (this.selectedLocale !== this.localeService.getCurrentLocale()) {
      console.log(`Changing language from ${this.localeService.getCurrentLocale()} to ${this.selectedLocale}`);
      this.localeService.changeLocale(this.selectedLocale).catch(error => {
        console.error('Failed to change locale:', error);
        // En cas d'erreur, restaurer la valeur précédente
        this.selectedLocale = this.localeService.getCurrentLocale();
      });
    }
  }
}