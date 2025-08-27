import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare const google: any;

@Component({
  selector: 'app-map-direction',
  standalone: false,
  templateUrl: './map-direction.component.html',
  styleUrl: './map-direction.component.scss'
})
export class MapDirectionComponent {

    @Input() destinationLat!: number;
    @Input() destinationLng!: number;
    @ViewChild('map', { static: true }) mapElement!: ElementRef;

    constructor(
      public dialogRef: MatDialogRef<MapDirectionComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { mapUrl: string },
      private toastr: ToastrService
    ) {}

  close(): void {
    this.dialogRef.close();
  }
}
