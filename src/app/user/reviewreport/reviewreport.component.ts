import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reviewreport',
  standalone: false,
  templateUrl: './reviewreport.component.html',
  styleUrl: './reviewreport.component.scss'
})
export class ReviewreportComponent {

  constructor(
    public dialogRef: MatDialogRef<ReviewreportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmReport(): void {
    // Call the method to submit the report here
    this.dialogRef.close({ confirmed: true });
  }

}
