import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  constructor(
    private router: Router,
    private translate: TranslateService
  ) {}

  goToBook() {
    this.router.navigate(['/booking-dashboard']);
  }

  goToReport() {
    this.router.navigate(['/map-display']);
  }
}
