import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-notify-single',
  standalone: false,
  templateUrl: './notify-single.component.html',
  styleUrl: './notify-single.component.scss'
})
export class NotifySingleComponent {
  notificationForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private notificationService: BookingService,
    private dialogRef: MatDialogRef<NotifySingleComponent>,
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
