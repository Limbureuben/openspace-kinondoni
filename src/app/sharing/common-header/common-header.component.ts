import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-header',
  standalone: false,
  templateUrl: './common-header.component.html',
  styleUrl: './common-header.component.scss'
})
export class CommonHeaderComponent {


  constructor(private router: Router) {}

  menuOPen: boolean = false;

  toggleMenu() {
    this.menuOPen = !this.menuOPen;
  }

  NavigateToHome() {
    this.router.navigate(['/'])
  }

}
