import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../../service/booking.service';

@Component({
  selector: 'app-notification-single',
  standalone: false,
  templateUrl: './notification-single.component.html',
  styleUrl: './notification-single.component.scss'
})
export class NotificationSingleComponent {

  notificationForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private notificationService: BookingService,
    private dialogRef: MatDialogRef<NotificationSingleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {
    this.notificationForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.notificationForm.invalid) return;

    const message = this.notificationForm.value.message;

    if (this.data?.email) {
      this.notificationService.sendNotificationToWardExecutive(this.data.email, message).subscribe({
        next: () => {
          this.toastr.success(`Notification sent to ${this.data.email}`);
          this.dialogRef.close();
        },
        error: () => {
          this.toastr.error('Failed to send notification.');
        }
      });
    } else {
      this.toastr.error('No recipient email found.');
    }
  }

    close() {
    this.dialogRef.close();
  }
}

