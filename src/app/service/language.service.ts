import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {
    this.initializeLanguage();
   }

  initializeLanguage() {
    if (isPlatformBrowser(this.platformId)) {
      const lang = localStorage.getItem('language') || 'en';
      this.translate.use(lang);
    } else {
      this.translate.use('en');
    }
  }

  changeLanguage(language: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', language);
    }
    this.translate.use(language);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'en';
  }

}
