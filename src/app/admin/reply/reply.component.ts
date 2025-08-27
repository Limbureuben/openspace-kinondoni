import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-reply',
  standalone: false,
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.scss'
})
export class ReplyComponent {
  message: string = '';

  constructor(
    private dialogRef: MatDialogRef<ReplyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reportService: BookingService
  ) {}

  sendReply() {
    this.reportService.sendReply(this.data.reportId, this.message).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
