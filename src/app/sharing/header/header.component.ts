import { SharingprofileComponent } from './../sharingprofile/sharingprofile.component';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { LanguageService } from '../../service/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  OnProfile() {
  const dialogRef = this.dialog.open(SharingprofileComponent, {
        width: '400px',
        disableClose: false
      })
    }

  OnLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');

  this.toastr.success('Logout success', '', {
    timeOut: 1500,
    progressBar: true,
    positionClass: 'toast-top-right'
  });
  setTimeout(() => {
    this.router.navigate(['/user-home']);
  }, 1500);
}

}

