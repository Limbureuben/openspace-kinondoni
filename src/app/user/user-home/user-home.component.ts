import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ViewHistoryComponent } from '../view-history/view-history.component';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../../../theme/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent implements OnInit, OnDestroy {
  showPopup: boolean = false;
  menuOpen: boolean = false;
  showHistoryPopup = false;
  dialogRef: any;
  isDarkTheme: boolean = false;
  private themeSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authservice: AuthService,
    private dialog: MatDialog,
    private themeService: ThemeService
  ) {}

  OPenBookDasboard() {
    this.router.navigate(['/login']);
  }


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openPopup() {
    this.showPopup = true;
  }

  navigateToCreateAccount() {
    this.showPopup = false;
    this.router.navigate(['/register'])

  }

  navigateToLogin() {
    this.showPopup = false;
    this.router.navigate(['/login'])
  }

  closePopup() {
    this.showPopup = false;
  }

  continueAsAnonymous(): void {
    this.showPopup = false;

    let sessionID = localStorage.getItem('session_id');
    if (!sessionID) {
      this.authservice.generateSessionId();
      sessionID = localStorage.getItem('session_id');
    }
    if(sessionID) {
      this.router.navigate(['/map-display'])
    }
    else {
      console.error('Failed to create session ID');
    }
  }

  @ViewChild('chatbotContainer') chatbotContainer!: ElementRef;

    openChat() {
      if (this.chatbotContainer) {
        this.chatbotContainer.nativeElement.style.display = 'block';
        if ((window as any).eapps) {
          (window as any).eapps.init();
        }
      }
    }

    openReportHistoryDialog() {
      this.dialog.open(ViewHistoryComponent, {
        width: '1200px',
        height: '500px',
        disableClose: false
      });
    }

    ngOnInit(): void {
      // Subscribe to theme changes
      this.themeSubscription = this.themeService.isDarkTheme$.subscribe(
        (isDark: boolean) => {
          this.isDarkTheme = isDark;
        }
      );
    }

    ngOnDestroy(): void {
      // Unsubscribe to prevent memory leaks
      this.themeSubscription.unsubscribe();
    }

    toggleTheme(): void {
      this.themeService.toggleTheme();
    }
}
