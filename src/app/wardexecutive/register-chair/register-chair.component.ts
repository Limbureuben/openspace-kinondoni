import { response } from 'express';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService, RegisterData } from '../../service/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-chair',
  standalone: false,
  templateUrl: './register-chair.component.html',
  styleUrl: './register-chair.component.scss'
})
export class RegisterChairComponent implements OnInit{
  form: FormGroup;

  loggedInWard: string | null = null;
  loggedInRole: string | null = null;


streetOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService,
    private dialogRef: MatDialogRef<RegisterChairComponent>,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      passwordConfirm: ['', [Validators.required]],
      role: [''],
      email: [''],
      street: [''],
    }, { validators: this.passwordsMatchValidator });
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

  ngOnInit(): void {
    this.fetchStreets();
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.loggedInWard = userData?.ward || null;
    this.loggedInRole = userData?.role || null;
  }

  fetchStreets() {
    this.authservice.getStreetsForWard().subscribe({
      next: (streets) => {
        this.streetOptions = streets;
      },
      error: (err) => {
        console.error('Failed to fetch streets', err);
      }
    });
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
      ...(this.form.value.street ? { street: this.form.value.street } : {}),
      ...(this.loggedInWard ? { ward: this.loggedInWard } : {})
    };

    this.authservice.registrationUser(registrationData).subscribe({
      next: (result) => {
        console.log("Full GraphQL Response:", JSON.stringify(result, null, 2));

        if (!result.data?.registerUser?.output) {
          this.toastr.error('Unexpected response from server', 'Error');
          return;
        }

        const response = result.data?.registerUser?.output;
        const user = response?.user;

        if (response?.success) {
          this.toastr.success(response.message, 'Success', { positionClass: 'toast-top-right' });

         if (sessionId) localStorage.removeItem('sessionId');
         if (user?.id) localStorage.setItem('userId', user.id);

          this.form.reset();
          Object.keys(this.form.controls).forEach(key => {
            this.form.controls[key].setErrors(null);
          });
          console.log("Navigating to login...");
          this.router.navigate(['/executive/manage-chair']).then(success => {
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
