import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OpenspaceService } from '../../../service/openspace.service';

@Component({
  selector: 'app-wards-register',
  standalone: false,
  templateUrl: './wards-register.component.html',
  styleUrl: './wards-register.component.scss'
})
export class WardsRegisterComponent {
  wardForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<WardsRegisterComponent>,
    private streetsService: OpenspaceService
  ) {
    this.wardForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.wardForm.invalid) return;

    this.isSubmitting = true;
    const wardName = this.wardForm.value.name.trim();

    this.streetsService.registerWard(wardName).subscribe({
      next: res => this.dialogRef.close(res),
      error: err => {
        console.error('Error:', err);
        this.isSubmitting = false;
      }
    });
  }
}
