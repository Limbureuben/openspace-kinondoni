import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../service/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sharingprofile',
  standalone: false,
  templateUrl: './sharingprofile.component.html',
  styleUrl: './sharingprofile.component.scss',
  animations: [
    trigger('dialogFadeIn', [
      transition(':enter', [ // when component enters the DOM
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class SharingprofileComponent implements OnInit {

  user: any;
  selectedFile: File | null = null;
  defaultProfileImage: string = 'assets/images/profileicon.png'; // Place this image in your assets folder

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private userService: AuthService,
    private dialogRef: MatDialogRef<SharingprofileComponent>,
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
    this.router.navigate(['/homepage']);
  }



}
