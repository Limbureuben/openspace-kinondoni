import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
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
export class RegisterComponent implements OnInit {

  showForm = true;
  hide = true;

  toggleForm() {
    this.showForm = !this.showForm;
  }

  close() {
    this.showForm = false;
  }

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private toastr: ToastrService,
    private zone: NgZone
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: [''],
      ward: [''],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      passwordConfirm: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.showForm = true;
  }

  // Password strength validation
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

  // Custom validator to check if passwords match
  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passwordConfirm')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.error('Enter valid values', 'Validation Error', { positionClass: 'toast-top-right' });
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    const registrationData: RegisterData = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      passwordConfirm: this.registerForm.value.passwordConfirm,
      ...(this.registerForm.value.email ? { email: this.registerForm.value.email } : {}),
      ...(this.registerForm.value.ward ? { ward: this.registerForm.value.ward } : {}),
      ...(sessionId ? { sessionId } : {})
    };

    console.log("Sending Registration Data:", registrationData);

    this.authservice.registrationUser(registrationData).subscribe({
      next: (result) => {
        console.log("Full GraphQL Response:", JSON.stringify(result, null, 2));

        if (!result.data?.registerUser?.output) {
          this.toastr.error('Unexpected response from server', 'Error', { positionClass: 'toast-top-right', progressBar: true, timeOut: 1000 });
          return;
        }

        const response = result.data.registerUser.output;
        const user = response?.user;

        if (response.success) {
          this.toastr.success(response.message, 'Success', { positionClass: 'toast-top-right', progressBar: true, timeOut: 1000 });
          if (sessionId) {
            console.log("Removing sessionId...");
            localStorage.removeItem('sessionId');
          }

          if (user?.id) {
            localStorage.setItem('userId', user.id);
          } else {
            console.warn("User object is missing or has no ID!");
          }

          this.registerForm.reset();
          Object.keys(this.registerForm.controls).forEach(key => {
            this.registerForm.controls[key].setErrors(null);
          });
          console.log("Navigating to login...");
          this.router.navigate(['/login']).then(success => {
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

  goBack() {
    this.router.navigate(['/']);
  }
}
