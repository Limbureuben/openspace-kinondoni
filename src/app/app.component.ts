import { Component, PLATFORM_ID, Inject, OnInit, } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ngOnInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.router.events
  //       .pipe(filter(event => event instanceof NavigationEnd))
  //       .subscribe((event: NavigationEnd) => {
  //         localStorage.setItem('lastRoute', event.urlAfterRedirects);
  //       });

  //     const token = localStorage.getItem('token');
  //     const lastRoute = localStorage.getItem('lastRoute');

  //     if (token && lastRoute) {
  //       this.router.navigateByUrl(lastRoute);
  //     } else {
  //       this.router.navigate(['/user-home']);
  //     }
  //   }
  // }

}
