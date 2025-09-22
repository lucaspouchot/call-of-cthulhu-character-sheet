import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private readonly LOCALE_KEY = 'cthulhu-app-locale';
  private readonly DEFAULT_LOCALE = 'en';
  private readonly SUPPORTED_LOCALES = ['en', 'fr'];

  private currentLocaleSignal = signal<string>(this.DEFAULT_LOCALE);

  // Observable pour les composants qui ont besoin de réagir aux changements
  private localeSubject = new BehaviorSubject<string>(this.DEFAULT_LOCALE);
  public locale$ = this.localeSubject.asObservable();

  constructor(private translationService: TranslationService) {
    this.initializeLocale();
  }

  /**
   * Initialise la locale au démarrage de l'application
   */
  private async initializeLocale(): Promise<void> {
    const savedLocale = this.getSavedLocale();
    const initialLocale = savedLocale || this.DEFAULT_LOCALE;

    await this.setCurrentLocale(initialLocale);
  }

  /**
   * Obtient la locale sauvée dans localStorage
   */
  private getSavedLocale(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const saved = localStorage.getItem(this.LOCALE_KEY);
    if (saved && this.SUPPORTED_LOCALES.includes(saved)) {
      return saved;
    }

    return null;
  }

  /**
   * Sauvegarde la locale dans localStorage
   */
  private saveLocale(locale: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.LOCALE_KEY, locale);
    }
  }

  /**
   * Définit la locale actuelle
   */
  private async setCurrentLocale(locale: string): Promise<void> {
    if (!this.SUPPORTED_LOCALES.includes(locale)) {
      console.warn(`Locale ${locale} not supported, falling back to ${this.DEFAULT_LOCALE}`);
      locale = this.DEFAULT_LOCALE;
    }

    try {
      // Charger les traductions pour la nouvelle locale
      await this.translationService.loadTranslations(locale);

      // Mettre à jour les signaux et observables
      this.currentLocaleSignal.set(locale);
      this.localeSubject.next(locale);

      // Sauvegarder
      this.saveLocale(locale);

      console.log(`Locale changed to: ${locale}`);
    } catch (error) {
      console.error(`Failed to set locale to ${locale}:`, error);

      // En cas d'erreur, fallback vers l'anglais
      if (locale !== this.DEFAULT_LOCALE) {
        await this.setCurrentLocale(this.DEFAULT_LOCALE);
      }
    }
  }

  /**
   * Change la locale actuelle
   */
  async changeLocale(locale: string): Promise<void> {
    if (locale === this.getCurrentLocale()) {
      return; // Déjà sur cette locale
    }

    await this.setCurrentLocale(locale);
  }

  /**
   * Obtient la locale actuelle
   */
  getCurrentLocale(): string {
    return this.currentLocaleSignal();
  }

  /**
   * Signal readonly pour la locale actuelle
   */
  getCurrentLocaleSignal() {
    return this.currentLocaleSignal.asReadonly();
  }

  /**
   * Obtient les locales supportées
   */
  getSupportedLocales(): string[] {
    return [...this.SUPPORTED_LOCALES];
  }

  /**
   * Obtient les locales disponibles avec leurs noms d'affichage
   */
  getAvailableLocales(): { code: string; name: string }[] {
    return [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' }
    ];
  }

  /**
   * Obtient le nom d'affichage de la locale courante
   */
  getCurrentLocaleName(): string {
    const current = this.getCurrentLocale();
    const locale = this.getAvailableLocales().find(l => l.code === current);
    return locale?.name || 'English';
  }

  /**
   * Vérifie si une locale est supportée
   */
  isLocaleSupported(locale: string): boolean {
    return this.SUPPORTED_LOCALES.includes(locale);
  }
}