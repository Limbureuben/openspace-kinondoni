import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-viewbookig',
  standalone: false,
  templateUrl: './viewbookig.component.html',
  styleUrl: './viewbookig.component.scss'
})
export class ViewbookigComponent implements OnInit {
  selectedReport: any;
  backendUrl = 'http://localhost:8000';

  constructor(
    public dialogRef: MatDialogRef<ViewbookigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.selectedReport = this.data;
  }

  getFullFileUrl(filePath: string): string {
    if (!filePath) return '';
    return `${this.backendUrl}${filePath}`;
  }

  closePopup() {
    this.dialogRef.close();
  }
}
