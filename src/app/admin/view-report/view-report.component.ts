// import { animate, state, style, transition, trigger } from '@angular/animations';
// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { MapDirectionComponent } from '../map-direction/map-direction.component';
// @Component({
//   selector: 'app-view-report',
//   standalone: false,
//   templateUrl: './view-report.component.html',
//   styleUrl: './view-report.component.scss',
//   animations: [
//     trigger('fadeScale', [
//       state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
//       transition(':enter', [
//         animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
//       ]),
//       transition(':leave', [
//         animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
//       ]),
//     ]),
//     trigger('fadeInOut', [
//       state('void', style({ opacity: 0 })),
//       transition(':enter', [animate('200ms ease-in', style({ opacity: 1 }))]),
//       transition(':leave', [animate('150ms ease-out', style({ opacity: 0 }))]),
//     ]),
//   ],
// })
// export class ViewReportComponent {


//   private backendUrl = 'http://127.0.0.1:8000/media/';
//   isMediaModalOpen = false;
//   selectedMedia: string = '';
//   isVideo: boolean = false;
//   showMap = false;

//   constructor(
//     public dialogRef: MatDialogRef<ViewReportComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private dialog: MatDialog,
//   ) {}

//   closeForm(): void {
//     this.dialogRef.close();
//   }

//   getFileUrl(): string {
//     return this.data.file ? `${this.backendUrl}${this.data.file}` : '';
//   }

//   isVideoFile(fileUrl: string): boolean {
//     return fileUrl.match(/\.(mp4|webm|ogg)$/i) !== null;
//   }

//   openMediaModal(mediaUrl: string): void {
//     this.selectedMedia = mediaUrl;
//     this.isVideo = this.isVideoFile(mediaUrl);
//     this.isMediaModalOpen = true;
//   }

//   closeMediaModal(): void {
//     this.isMediaModalOpen = false;
//   }

//   openMapDirections(lat: number, lng: number): void {
//   const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
//   this.dialog.open(MapDirectionComponent, {
//     width: '600px',
//     data: { mapUrl }
//   });
// }


// }



import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapDirectionComponent } from '../map-direction/map-direction.component';

@Component({
  selector: 'app-view-report',
  standalone: false,
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.scss',
  animations: [
    trigger('fadeScale', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition(':enter', [
        animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ViewReportComponent implements OnInit {

  private backendUrl = 'http://127.0.0.1:8000/media/';
  isMediaModalOpen = false;
  selectedMedia: string = '';
  isVideo: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ViewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    console.log('Report Data:', this.data);
    console.log('Computed File URL:', this.getFileUrl());
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  // getFileUrl(): string {
  //   if (!this.data?.file) return '';

  //   // If backend sent a full URL
  //   if (this.data.file.startsWith('http://') || this.data.file.startsWith('https://')) {
  //     return this.data.file;
  //   }

  //   // If backend sent "media/..." path
  //   if (this.data.file.startsWith('media/')) {
  //     return `${this.backendUrl}${this.data.file.replace(/^media\//, '')}`;
  //   }

  //   // Otherwise assume it's relative path
  //   return `${this.backendUrl}${this.data.file}`;
  // }

  getFileUrl(): string {
    if (!this.data?.file) return '';
  
    // If full URL already provided from backend
    if (this.data.file.startsWith('http://') || this.data.file.startsWith('https://')) {
      return this.data.file;
    }
  
    // If backend already gave us `/media/...` path
    if (this.data.file.startsWith('/media/')) {
      return `http://127.0.0.1:8000${this.data.file}`;
    }
  
    // Otherwise assume it's a relative path without media/
    return `http://127.0.0.1:8000/media/${this.data.file}`;
  }


  isVideoFile(fileUrl: string): boolean {
    if (!fileUrl) return false;
    const ext = fileUrl.split('.').pop()?.toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext || '');
  }

  openMediaModal(mediaUrl: string): void {
    this.selectedMedia = mediaUrl;
    this.isVideo = this.isVideoFile(mediaUrl);
    this.isMediaModalOpen = true;
  }

  closeMediaModal(): void {
    this.isMediaModalOpen = false;
  }

  openMapDirections(lat: number, lng: number): void {
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    this.dialog.open(MapDirectionComponent, {
      width: '600px',
      data: { mapUrl }
    });
  }
}
