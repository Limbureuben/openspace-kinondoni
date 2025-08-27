import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-available-booking',
  standalone: false,
  templateUrl: './available-booking.component.html',
  styleUrl: './available-booking.component.scss',
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
export class AvailableBookingComponent {
  selectedReport: any;
  backendUrl = 'http://localhost:8000';

  constructor(
    public dialogRef: MatDialogRef<AvailableBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
     this.selectedReport = data;
  }

  getFullFileUrl(filePath: string): string {
    if (!filePath) return '';
    return `${this.backendUrl}${filePath}`;
 }

  closePopup() {
    this.dialogRef.close();
  }
}
