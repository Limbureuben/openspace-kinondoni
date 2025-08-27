import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService, RegisterData, Ward } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-register-ward',
  standalone: false,
  templateUrl: './register-ward.component.html',
  styleUrl: './register-ward.component.scss',
    animations: [
    trigger('rotateFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'rotateY(90deg)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'rotateY(0deg)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'rotateY(90deg)' }))
      ])
    ])
  ]
})
export class RegisterWardComponent {

  form: FormGroup;
  // wardOptions: string[] = [];
  wardOptions: { id: number, name: string }[] = [];
//   wardOptions: string[] = [
//   'Bunju','Hananasif','Kawe','Kigogo','Kijitonyama','Kinondoni',
//   'Kunduchi','Mabwepande','Magomeni','Makongo','Makumbusho','Mbezi Juu',
//   'Mbweni','Mikocheni','Msasani','Mwananyamala','Mzimuni','Ndugumbi','Tandale','Wazo'
// ];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService,
    private dialogRef: MatDialogRef<RegisterWardComponent>,
    private router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      passwordConfirm: ['', [Validators.required]],
      role: [''],
      email: [''],
      ward: ['']
    });
  }


  // ngOnInit(): void {
  //   this.authservice.getWards().subscribe({
  //     next: (data) => {
  //       this.wardOptions = data;
  //     },
  //     error: (err) => {
  //       console.error('Failed to load wards:', err);
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.authservice.getWards().subscribe({
      next: (wards) => {
        this.wardOptions = wards;
      },
      error: (err) => {
        console.error('Failed to load wards:', err);
      }
    });
  }

  passwordStrengthValidator(control: any) {
    const value = control.value;
    if (!value) return { weakPassword: true };

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength) {
      return null;
    }
    return { weakPassword: true };
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passwordConfirm')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Enter valid values', 'Validation Error', { positionClass: 'toast-top-right' });
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    const registrationData: RegisterData = {
      username: this.form.value.username,
      password: this.form.value.password,
      passwordConfirm: this.form.value.passwordConfirm,
      email: this.form.value.email,
      ...(this.form.value.role ? { role: this.form.value.role } : {}),
      ...(this.form.value.ward ? { ward: this.form.value.ward } : {})
    };

    this.authservice.registrationUser(registrationData).subscribe({
      next: (result) => {
        console.log("Full GraphQL Response:", JSON.stringify(result, null, 2));

        if (!result.data?.registerUser?.output) {
          this.toastr.error('Unexpected response from server', 'Error');
          return;
        }

        const response = result.data.registerUser.output;
        const user = response?.user;

        if (response.success) {
          this.toastr.success(response.message, 'Success', { positionClass: 'toast-top-right' });

          if (sessionId) {
            console.log("Removing sessionId...");
            localStorage.removeItem('sessionId');
          }

          if (user?.id) {
            localStorage.setItem('userId', user.id);
          } else {
            console.warn("User object is missing or has no ID!");
          }

          this.form.reset();
          Object.keys(this.form.controls).forEach(key => {
            this.form.controls[key].setErrors(null);
          });
          console.log("Navigating to login...");
          this.router.navigate(['/admin/manage-wardexecutive']).then(success => {
            if (!success) {
              console.error("Navigation failed!");
            }
          });

        } else {
          this.toastr.error(response.message || 'Registration failed', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Something went wrong. Please try again.', 'Error');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
