import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { LocaleService } from '../services/locale.service';

@Pipe({
  name: 'dynamicTranslate',
  pure: false, // Impure pour la réactivité mais avec cache pour éviter les boucles
  standalone: true
})
@Injectable()
export class DynamicTranslatePipe implements PipeTransform {
  private lastLocale = '';
  private cache = new Map<string, string>();

  constructor(
    private translationService: TranslationService,
    private localeService: LocaleService
  ) { }

  transform(key: string): string {
    const currentLocale = this.localeService.getCurrentLocale();

    // Si la locale a changé, vider le cache
    if (currentLocale !== this.lastLocale) {
      this.cache.clear();
      this.lastLocale = currentLocale;
    }

    const cacheKey = `${key}_${currentLocale}`;

    // Utiliser le cache si disponible
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Obtenir la traduction
    const translation = this.translationService.getTranslation(key, currentLocale);

    // Mettre en cache
    this.cache.set(cacheKey, translation);

    return translation;
  }
}