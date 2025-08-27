import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../service/language.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
export class LoginComponent implements OnInit{

  LoginForm!: FormGroup;
  registrationError: any;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private auth: Auth,
  ) {}

  ngOnInit(): void {
      this.LoginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      })
  }

  // Method to handle language change
  changeLanguage(language: string) {
    this.languageService.changeLanguage(language);
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  }


OnSubmit() {
  if (!this.LoginForm.valid) {
      this.LoginForm.markAllAsTouched();
      return;
  }

  const { username, password }: LoginData = this.LoginForm.value;

  this.authservice.signinUser(username, password).subscribe({
    next: (result) => {
      const response = result.data.loginUser;

      if (response.success) {
        this.toastr.success('Login successful', 'Success', {positionClass: 'toast-top-right', progressBar: true, timeOut: 2000});


        localStorage.setItem('token', response.user.token);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('isStaff', response.user.isStaff);
        localStorage.setItem('isWardExecutive', response.user.isWardExecutive);
        localStorage.setItem('isVillageChairman', response.user.isVillageChairman);

        localStorage.setItem('user', JSON.stringify(response.user));

        console.log('Token stored:', response.user.token);
        console.log('Id stored', response.user.id);

        if (response.user.isStaff) {
          this.router.navigate(['/admin']);
        } else if (response.user.isWardExecutive) {
          this.router.navigate(['/executive']);
        } else if (response.user.isVillageChairman) {
          this.router.navigate(['/street']);
          // window.location.href = 'http://localhost:5173';
          // this.router.navigate(['/chair']);
          // window.location.href = `http://localhost:5173?token=${response.user.token}`;
          // window.location.href = `http://localhost:5173?token=$`
        } else {
          this.router.navigate(['/homepage']);
        }
      } else {
          this.toastr.error(response.message || 'Login failed', 'Error', {
            positionClass: 'toast-top-right', progressBar: true, timeOut: 1000
          });
        }
    },
    error: (err) => {
        this.toastr.error('Something went wrong. Please try again.', 'Error', {
          positionClass: 'toast-top-right', progressBar: true, timeOut: 1000
        });
      }
  })
}

goBack() {
  this.router.navigate(['/']);
}

  showFailure(message: string) {
    console.error('Login Error:', message);
  }

  NavigateToReset() {
    this.router.navigate(['/password-reset']);
  }
}

function loginWithGoogle() {
  throw new Error('Function not implemented.');
}





//animations @slideInOut
// animations: [
//   trigger('slideInOut', [
//     state('in', style({
//       transform: 'translateX(0)'
//     })),
//     transition(':enter', [
//       style({ transform: 'translateX(100%)' }),
//       animate('300ms ease-in')
//     ]),
//     transition(':leave', [
//       animate('2000ms ease-in', style({ transform: 'translateX(100%)' }))
//     ])
//   ])
// ]


//bounce @slideBounce
// animations: [
//   trigger('slideBounce', [
//     transition(':enter', [
//       style({ transform: 'translateY(-100%)', opacity: 0 }),
//       animate('600ms cubic-bezier(0.68, -0.55, 0.27, 1.55)',
//         style({ transform: 'translateY(0)', opacity: 1 }))
//     ]),
//     transition(':leave', [
//       animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
//     ])
//   ])
// ]
