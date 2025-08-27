import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../../../service/booking.service';

@Component({
  selector: 'app-reply-booking',
  standalone: false,
  templateUrl: './reply-booking.component.html',
  styleUrl: './reply-booking.component.scss'
})
export class ReplyBookingComponent {
  replyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: BookingService,
    private dialogRef: MatDialogRef<ReplyBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    this.replyForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  sendReply(): void {
    if (this.replyForm.invalid) return;

    const message = this.replyForm.value.message;

    this.notificationService.sendNotification(this.data.userId, message).subscribe({
      next: (res) => {
        console.log('Notification sent:', res);
        this.dialogRef.close(true); // Close and return success
      },
      error: (err) => {
        console.error('Error sending notification:', err);
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
