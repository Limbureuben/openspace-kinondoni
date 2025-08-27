import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
declare const google: any;

@Component({
  selector: 'app-street-direction',
  standalone: false,
  templateUrl: './street-direction.component.html',
  styleUrl: './street-direction.component.scss'
})
export class StreetDirectionComponent {
  @Input() destinationLat!: number;
    @Input() destinationLng!: number;
    @ViewChild('map', { static: true }) mapElement!: ElementRef;

    constructor(
      public dialogRef: MatDialogRef<StreetDirectionComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { mapUrl: string },
      private toastr: ToastrService
    ) {}

  close(): void {
    this.dialogRef.close();
  }

}
