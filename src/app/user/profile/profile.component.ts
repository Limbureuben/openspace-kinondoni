import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { error } from 'console';
import { AuthService } from '../../service/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  animations: [
    trigger('dialogFadeIn', [
      transition(':enter', [ // when component enters the DOM
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit{
  user: any;
  selectedFile: File | null = null;
  defaultProfileImage: string = 'assets/images/profileicon.png'; // Place this image in your assets folder

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private userService: AuthService,
    private dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Profile fetch error:', err);
      }
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('profile_image', this.selectedFile);

    this.userService.uploadProfileImage(formData).subscribe({
      next: () => {
        this.loadUserProfile(); // Refresh profile
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Image upload failed:', err);
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  resetPassword(): void {
    this.dialogRef.close();
    this.router.navigate(['/forgot-password']);
  }
}
