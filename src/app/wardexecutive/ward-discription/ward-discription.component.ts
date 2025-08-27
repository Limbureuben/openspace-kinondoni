import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ward-discription',
  standalone: false,
  templateUrl: './ward-discription.component.html',
  styleUrl: './ward-discription.component.scss'
})
export class WardDiscriptionComponent {
  description: string = '';

  constructor(
    public dialogRef: MatDialogRef<WardDiscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.description.trim()) {
      this.dialogRef.close(this.description.trim());
    }
  }

}
