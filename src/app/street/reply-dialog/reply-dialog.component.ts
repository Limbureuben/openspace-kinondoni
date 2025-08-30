import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenspaceService } from '../../service/openspace.service';

@Component({
  selector: 'app-reply-dialog',
  standalone: false,
  templateUrl: './reply-dialog.component.html',
  styleUrl: './reply-dialog.component.scss'
})
export class ReplyDialogComponent {
  replyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reportService: OpenspaceService,
    private dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reportId: string }  // reportId from parent
  ) {
    this.replyForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  sendReply() {
    if (!this.replyForm.valid) return;

    const message = this.replyForm.value.message;

    // Call the service with reportId and message
    this.reportService.replyToReport(this.data.reportId, message).subscribe({
      next: (res) => {
        console.log('Reply sent successfully:', res);
        this.dialogRef.close(true); // close dialog and indicate success
      },
      error: (err) => {
        console.error('Error sending reply:', err);
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}