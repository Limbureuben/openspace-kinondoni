import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  animations: [
  trigger('slideBounce', [
    transition(':enter', [
      style({ transform: 'translateY(-100%)', opacity: 0 }),
      animate('600ms cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        style({ transform: 'translateY(0)', opacity: 1 }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
    ])
  ])
]
})
export class ResetPasswordComponent {
  uid: string = '';
  token: string = '';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.matchPasswords }
    );
  }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const newPassword = this.form.value.password;

    this.authService.confirmResetPassword(this.uid, this.token, newPassword).subscribe({
      next: (res) => {
        alert('Password reset successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Error: ' + (err.error?.error || 'Something went wrong.'));
      }
    });
  }
}
