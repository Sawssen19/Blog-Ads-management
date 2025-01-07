// Angular
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'kt-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  showPassword: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  emailCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email, emailFormatValidator],
  });

  passwordCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(60),
    ],
  });
  private unsubscribe: Subject<any>;
  today: number = Date.now();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    window.sessionStorage.clear();
    this.initLoginForm();
  }

  onChangePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.unsubscribe.complete();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      emailCtrl: this.emailCtrl,
      passwordCtrl: this.passwordCtrl,
    });
  }
  submit() {
    const controls = this.loginForm.controls;
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      return;
    }
    this.loginService
      .loginUser(this.emailCtrl.value, this.passwordCtrl.value)
      .subscribe((result: any) => {
        window.sessionStorage.clear();
        window.sessionStorage.setItem('access_token', result.access_token!);
        window.sessionStorage.setItem('refresh_token', result.refresh_token!);
        window.sessionStorage.setItem('auth-user', JSON.stringify(result));
        this.router.navigate(['dashboard']);
      });
  }
}

function emailFormatValidator(
  c: AbstractControl
): { [key: string]: boolean } | null {
  if (!c.value) return null;
  const emailFragments = (c.value as string).split('@');
  if (emailFragments.length === 1) return null;
  const emailPart2 = emailFragments[emailFragments.length - 1];
  return emailPart2 === '' || emailPart2.includes('.')
    ? null
    : { format: true };
}
