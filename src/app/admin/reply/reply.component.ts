import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../../service/booking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reply',
  standalone: false,
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.scss'
})
export class ReplyComponent {
  replyForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ReplyComponent>, // <-- make public
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reportService: BookingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.replyForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  submitReply(): void {
    if (this.replyForm.invalid) return;

    const message = this.replyForm.value.message;
    const reportId = this.data.report.id; // use numeric ID

    this.reportService.replyToReport(reportId, message).subscribe({
      next: () => {
        this.snackBar.open('Reply sent successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error sending reply', err);
        this.snackBar.open('Failed to send reply', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}


