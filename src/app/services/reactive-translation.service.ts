import { Injectable, computed, effect } from '@angular/core';
import { LocaleService } from './locale.service';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class ReactiveTranslationService {

  constructor(
    private localeService: LocaleService,
    private translationService: TranslationService
  ) {
    // Effet pour charger les traductions quand la locale change
    effect(() => {
      const locale = this.localeService.getCurrentLocaleSignal()();
      this.translationService.loadTranslations(locale).catch(console.error);
    });
  }

  /**
   * Crée un signal réactif pour une clé de traduction
   */
  getTranslation(key: string) {
    return computed(() => {
      const locale = this.localeService.getCurrentLocaleSignal()();
      return this.translationService.getTranslation(key, locale);
    });
  }

  /**
   * Obtient directement une traduction (non réactive)
   */
  getTranslationValue(key: string): string {
    const locale = this.localeService.getCurrentLocale();
    return this.translationService.getTranslation(key, locale);
  }
}