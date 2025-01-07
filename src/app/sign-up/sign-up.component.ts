import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';
import { RoleEnum } from '../users/user-list/models/user';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  isVisiblePassword: boolean = false;
  isVisibleConfirmPassword: boolean = false;
  emailCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email, emailFormatValidator],
  });
  phoneNumberCtrl: FormControl<number | null> = new FormControl<number | null>(
    231542236,
    {
      nonNullable: false,
      validators: [Validators.required],
    }
  );
  firstNameCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  roleCtrl: FormControl<RoleEnum> = new FormControl<RoleEnum>(RoleEnum.Admin, {
    nonNullable: true,
    validators: [Validators.required],
  });
  lastNameCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  passwordCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(60),
    ],
  });
  confirmPasswordCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(60),
    ],
  });
  private unsubscribe: Subject<any>;
  today: number = Date.now();
  roles: RoleEnum[] = [RoleEnum.Admin, RoleEnum.Utilisateur];
  constructor(
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private router: Router
  ) {
    this.unsubscribe = new Subject();
  }
  onChangeConfirmPasswordVisibility() {
    this.isVisibleConfirmPassword = !this.isVisibleConfirmPassword;
  }
  onChangePasswordVisibility() {
    this.isVisiblePassword = !this.isVisiblePassword;
  }
  ngOnInit(): void {
    window.sessionStorage.clear();
    this.initLoginForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe.complete();
  }

  initLoginForm() {
    this.signupForm = this.fb.group({
      usernameCtrl: this.emailCtrl,
      passwordCtrl: this.passwordCtrl,
      confirmPasswordCtrl: this.confirmPasswordCtrl,
      firstNameCtrl: this.firstNameCtrl,
      lastNameCtrl: this.lastNameCtrl,
      roleCtrl: this.roleCtrl,
      phoneNumberCtrl: this.phoneNumberCtrl,
    });
  }
  submit() {
    const controls = this.signupForm.controls;
    if (this.signupForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      return;
    }

    this.signUpService
      .registerUser(
        this.firstNameCtrl.value,
        this.lastNameCtrl.value,
        this.emailCtrl.value,
        this.passwordCtrl.value,
        this.roleCtrl.value,
        this.phoneNumberCtrl.value ?? undefined
      )
      .subscribe((result: any) => {
        this.router.navigate(['login']);
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
