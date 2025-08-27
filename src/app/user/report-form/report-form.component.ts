import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-report-form',
  standalone: false,
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.scss'
})
export class ReportFormComponent {

  mtaaOptions: string[] = [
  'Mtaa wa Amani',
  'Mtaa wa Umoja',
  'Mtaa wa Tumaini',
  'Mtaa wa Jitihada',
  'Mtaa wa Furaha'
];

  reportForm!: FormGroup;
  selectedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReportFormComponent>

  ) {}

  ngOnInit() {
    this.reportForm = this.fb.group({
      description: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      district: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.reportForm.valid) {
      console.log(this.reportForm.value); // Handle the form submission
    }
  }

  closeForm(): void {
    this.dialogRef.close();
  }

  triggerFileInput() {
    document.getElementById('file-upload')?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
}
}