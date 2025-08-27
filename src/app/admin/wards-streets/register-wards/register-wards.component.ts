import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OpenspaceService } from '../../../service/openspace.service';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { WardsRegisterComponent } from '../wards-register/wards-register.component';

@Component({
  selector: 'app-register-wards',
  standalone: false,
  templateUrl: './register-wards.component.html',
  styleUrl: './register-wards.component.scss'
})
export class RegisterWardsComponent implements OnInit {
  registrationForm!: FormGroup;
  availableWards: { id: number, name: string }[] = [];

  // Predefined streets manually
  allStreets: string[] = [
    'Uhuru Street', 'Mtaa wa Juu', 'Nyerere Road', 'Kawe'
  ];

  selectedStreets: string[] = []; // streets selected in form
  recentRegistrations: { wardName: string; streetName: string; createdAt: Date }[] = [];

  totalWards: number = 0;
  totalStreets: number = 0;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private streetsService: OpenspaceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      wardId: ['', Validators.required],
      streets: [[], Validators.required]
    });

    this.loadWards();
    this.totalStreets = this.allStreets.length;
  }

  /** Fetch wards from backend */
   loadWards() {
    this.streetsService.getWards().subscribe({
      next: (res: any) => {
        // Extract the wards array from the response
        this.availableWards = res.wards.map((ward: any) => ward.name); 
        this.totalWards = this.availableWards.length;
        console.log('Wards loaded:', this.availableWards);
      },
      error: (err) => console.error('Error fetching wards:', err)
    });
  }


  /** Submit selected ward and streets */
  onSubmitRegistration() {
    if (this.registrationForm.invalid) return;
    this.isSubmitting = true;

    const wardId = this.registrationForm.value.wardId;
    const streets = this.registrationForm.value.streets;

    this.streetsService.registerWardAndStreets(wardId, streets)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: res => {
          console.log('Registration successful:', res);
          const wardName = this.availableWards.find(w => w.id === wardId)?.name || '';
          
          streets.forEach(street => {
            this.recentRegistrations.unshift({ wardName, streetName: street, createdAt: new Date() });
          });

          this.registrationForm.reset();
        },
        error: err => console.error('Error:', err)
      });
  }

  /** Reset form manually */
  resetForm() {
    this.registrationForm.reset();
  }

  /** Open dialog to register a new ward */
  openWardDialog() {
    const dialogRef = this.dialog.open(WardsRegisterComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      const newWardName = result?.name?.trim();
      if (newWardName && !this.availableWards.find(w => w.name === newWardName)) {
        // Optionally, save the new ward to backend
        this.streetsService.registerWard(newWardName).subscribe({
          next: (res: any) => {
            this.availableWards.push(res); // res = new ward object from backend
            this.totalWards = this.availableWards.length;
          },
          error: err => console.error('Error registering ward', err)
        });
      }
    });
  }
}