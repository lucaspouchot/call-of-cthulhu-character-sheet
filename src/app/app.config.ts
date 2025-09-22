import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { TranslationService } from './services/translation.service';
import { LocaleService } from './services/locale.service';

function initializeApp(translationService: TranslationService, localeService: LocaleService) {
  return () => {
    console.log('APP_INITIALIZER: Loading translations...');
    const currentLocale = localeService.getCurrentLocale();
    return translationService.loadTranslations(currentLocale)
      .then(() => {
        console.log('APP_INITIALIZER: Translations loaded successfully');
      })
      .catch(error => {
        console.error('APP_INITIALIZER: Failed to load translations', error);
      });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TranslationService, LocaleService],
      multi: true
    }
  ]
};
