import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ThemeService {
  private renderer: Renderer2;
  private darkThemeClass = 'dark-theme';
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);

  // Observable for components to subscribe to theme changes
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadThemeFromStorage();
  }

  enableDarkTheme(enable: boolean): void {
    // Only manipulate DOM in browser environment
    if (isPlatformBrowser(this.platformId)) {
      if (enable) {
        this.renderer.addClass(document.body, this.darkThemeClass);
      } else {
        this.renderer.removeClass(document.body, this.darkThemeClass);
      }

      // Save theme preference to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('darkTheme', enable.toString());
      }
    }

    this.isDarkThemeSubject.next(enable);
  }

  getCurrentTheme(): boolean {
    return this.isDarkThemeSubject.value;
  }

  private loadThemeFromStorage(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('darkTheme');
      if (savedTheme !== null) {
        const isDark = savedTheme === 'true';
        this.enableDarkTheme(isDark);
      }
    }
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    this.enableDarkTheme(!currentTheme);
  }
}
