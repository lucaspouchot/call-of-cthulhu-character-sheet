import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, firstValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface TranslationSet {
  [key: string]: string | TranslationSet;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations = new Map<string, TranslationSet>();
  private currentTranslations = signal<TranslationSet>({});
  private loadedLanguages = new Set<string>();

  // Observable pour notifier les changements de traductions
  private translationsSubject = new BehaviorSubject<TranslationSet>({});
  public translations$ = this.translationsSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Charge les traductions pour une langue donnée
   */
  async loadTranslations(locale: string): Promise<TranslationSet> {
    // Normaliser la locale (en-US -> en, fr -> fr)
    const normalizedLocale = this.normalizeLocale(locale);

    // Si déjà chargé, retourner depuis le cache
    if (this.translations.has(normalizedLocale)) {
      const cachedTranslations = this.translations.get(normalizedLocale)!;
      this.updateCurrentTranslations(cachedTranslations);
      return cachedTranslations;
    }

    try {
      const translations = await firstValueFrom(
        this.http.get<TranslationSet>(`/assets/i18n/${normalizedLocale}.json`).pipe(
          catchError(error => {
            console.warn(`Failed to load translations for ${normalizedLocale}, falling back to English`, error);
            // Fallback vers l'anglais si la langue demandée n'existe pas
            return this.http.get<TranslationSet>('/assets/i18n/en.json');
          })
        )
      );

      // Mettre en cache
      this.translations.set(normalizedLocale, translations);
      this.loadedLanguages.add(normalizedLocale);
      this.updateCurrentTranslations(translations);

      return translations;
    } catch (error) {
      console.error('Failed to load any translations, using empty set', error);
      const emptyTranslations = {};
      this.updateCurrentTranslations(emptyTranslations);
      return emptyTranslations;
    }
  }

  /**
   * Obtient une traduction pour une clé donnée
   */
  getTranslation(key: string, locale?: string): string {
    const normalizedLocale = locale ? this.normalizeLocale(locale) : null;

    // Si une locale spécifique est demandée et chargée
    if (normalizedLocale && this.translations.has(normalizedLocale)) {
      const translation = this.getNestedTranslation(this.translations.get(normalizedLocale)!, key);
      if (translation) return translation;
    }

    // Fallback vers les traductions actuelles
    const currentTranslations = this.currentTranslations();
    const currentTranslation = this.getNestedTranslation(currentTranslations, key);
    if (currentTranslation) {
      return currentTranslation;
    }

    // Fallback vers l'anglais si chargé
    if (this.translations.has('en')) {
      const englishTranslation = this.getNestedTranslation(this.translations.get('en')!, key);
      if (englishTranslation) return englishTranslation;
    }

    // Retourner la clé si aucune traduction trouvée
    return key;
  }

  /**
   * Navigue dans l'objet de traduction imbriqué pour récupérer la valeur
   */
  private getNestedTranslation(translations: TranslationSet, key: string): string | null {
    const keys = key.split('.');
    let current: any = translations;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }

  /**
   * Obtient toutes les traductions pour une locale
   */
  getAllTranslations(locale: string): TranslationSet {
    const normalizedLocale = this.normalizeLocale(locale);
    return this.translations.get(normalizedLocale) || {};
  }

  /**
   * Normalise une locale (en-US -> en, fr-FR -> fr)
   */
  private normalizeLocale(locale: string): string {
    const normalized = locale.split('-')[0].toLowerCase();
    // Assurer la correspondance avec les fichiers disponibles
    if (normalized === 'en' || normalized === 'en-us') {
      return 'en';
    }
    if (normalized === 'fr' || normalized === 'fr-fr') {
      return 'fr';
    }
    return normalized;
  }

  /**
   * Met à jour les traductions actuelles et notifie les observateurs
   */
  private updateCurrentTranslations(translations: TranslationSet): void {
    this.currentTranslations.set(translations);
    this.translationsSubject.next(translations);
  }

  /**
   * Vérifie si une langue est chargée
   */
  isLanguageLoaded(locale: string): boolean {
    return this.loadedLanguages.has(this.normalizeLocale(locale));
  }

  /**
   * Signal readonly pour les traductions actuelles
   */
  getCurrentTranslations() {
    return this.currentTranslations.asReadonly();
  }
}