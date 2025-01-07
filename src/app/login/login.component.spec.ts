import { ChangeDetectorRef, DebugElement, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { A3dnUserService } from 'a3dn-shared-lib';
import { of } from 'rxjs';
import { EnvelopeOfResultOfDemanderSessionOuOuvrirSessionSuperAdminDto } from '../api-client/models';
import { AuthentificationService } from '../api-client/services';
import { AuthNoticeService } from '../auth-notice/auth-notice.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockRouter: jasmine.SpyObj<any>;
  let mockAuthNoticeService: any;
  let mockAuthentificationService: any;
  let mockTranslateService: any;

  let emailInput: DebugElement;
  let passwordDE: DebugElement;

  @Pipe({ name: 'translate' })
  class MockPipe implements PipeTransform {
    transform(value: string): string {
      return value;
    }
  }

  beforeEach(async () => {
    mockTranslateService = jasmine.createSpyObj(['setDefaultLang', 'use', 'instant']);
    mockAuthNoticeService = {
      onNoticeChanged$: { getValue: () => false },
      setNotice: () => null,
    };
    mockAuthentificationService = jasmine.createSpyObj(['demanderSession$Json']);
    mockRouter = jasmine.createSpyObj(['navigate', 'getCurrentNavigation']);
    await TestBed.configureTestingModule({
      declarations: [LoginComponent, MockPipe],
      providers: [
        FormBuilder,
        ChangeDetectorRef,
        { provide: Router, useValue: mockRouter },
        { provide: AuthNoticeService, useValue: mockAuthNoticeService },
        { provide: TranslateService, useValue: mockTranslateService },
        {
          provide: AuthentificationService,
          useValue: mockAuthentificationService,
        },
        {
          provide: A3dnUserService,
          useValue: {},
        },
      ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    mockRouter.getCurrentNavigation.and.returnValue({
      extras: {
        state: {
          adresseEmail: 'mail@mail',
          motDePasse: '123456',
        },
      },
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.environment = { name: 'developement' };
    fixture.detectChanges();

    emailInput = fixture.debugElement.query(By.css('input[type=email]'));

    passwordDE = fixture.debugElement.query(By.css('input[type=password]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm).toBeTruthy();
  });

  describe('Email Validation', () => {
    it('should display an error when email is not valid ', () => {
      component.loginForm.patchValue({ email: 'test' });
      component.loginForm.controls['email'].markAsTouched();
      (emailInput.nativeElement as HTMLElement).dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const emailErrorMessage = emailInput?.parent?.queryAll(By.css('mat-error'));
      expect(component.isControlHasError('email', 'email')).toBeTrue();
      expect(emailErrorMessage?.length).toBe(1);
    });

    it('should display an error when nothing is passed as parameter', () => {
      component.loginForm.patchValue({ email: '' });
      component.loginForm.controls['email'].markAsTouched();
      (emailInput.nativeElement as HTMLElement).dispatchEvent(new Event('input'));

      fixture.detectChanges();
      const emailErrorMessage = emailInput?.parent?.queryAll(By.css('mat-error'));
      expect(component.isControlHasError('email', 'required')).toBeTrue();
      expect(emailErrorMessage?.length).toBe(1);
    });

    it('should not display an error when the email is valid', () => {
      component.loginForm.patchValue({ email: 'sbelaid@seitconsulting.com' });
      component.loginForm.controls['email'].markAsTouched();
      (emailInput.nativeElement as HTMLElement).dispatchEvent(new Event('input'));

      fixture.detectChanges();
      const emailErrorMessage = emailInput?.parent?.queryAll(By.css('mat-error'));
      expect(emailErrorMessage?.length).toBeFalsy();
    });

    it('should display an error when the email is not valid', () => {
      component.loginForm.patchValue({ email: 'sbelaid@seitconsulting' });
      component.loginForm.controls['email'].markAsTouched();
      (emailInput.nativeElement as HTMLElement).dispatchEvent(new Event('input'));

      fixture.detectChanges();
      const emailErrorMessage = emailInput?.parent?.queryAll(By.css('mat-error'));
      expect(emailErrorMessage?.length).toBe(1);
    });
  });

  describe('Password validation', () => {
    it('should display an error when password input is touched and nothing is passed as parameter', () => {
      component.loginForm.patchValue({ password: '' });
      component.loginForm.controls['password'].markAsTouched();
      (passwordDE.nativeElement as HTMLElement).dispatchEvent(new Event('input'));

      fixture.detectChanges();
      const passwordErrorMessage = passwordDE?.parent?.queryAll(By.css('mat-error'));
      expect(component.isControlHasError('password', 'required')).toBeTrue();
      expect(passwordErrorMessage?.length).toBe(1);
    });

    it('should not display an error when password input is not touched and nothing is passed as parameter', () => {
      component.loginForm.patchValue({ password: '' });
      component.loginForm.controls['password'].markAsTouched();

      (passwordDE.nativeElement as HTMLElement).dispatchEvent(new Event('input'));

      const emailErrorMessage = passwordDE?.parent?.queryAll(By.css('mat-error'));
      expect(emailErrorMessage?.length).toBeFalsy();
    });
  });

  it('should display an error message when form is invalid and button submit is clicked', () => {
    component.loginForm.patchValue({ email: '', password: '' });
    const submitButtonDE = fixture.debugElement.query(By.css('#kt_login_signin_submit'));
    submitButtonDE.triggerEventHandler('click', {});
    fixture.detectChanges();
    const emailErrorMessage = emailInput?.parent?.queryAll(By.css('mat-error'));
    expect(emailErrorMessage?.length).toBe(1);
  });

  it('should set jwt on localstorage when submited with success', () => {
    mockAuthentificationService.demanderSession$Json.and.returnValue(of(SUCCESS_LOGIN));
    component.loginForm.patchValue({
      email: 'aa@a3dn.com',
      password: 'Welcome@Seit2019',
    });
    component.submit();
    expect(localStorage.getItem('jwt')).toBeTruthy();
  });

  // it('should notice user when false parameters are passed', () => {
  //   spyOn(mockAuthNoticeService, 'setNotice');
  //   mockAuthentificationService.demanderSession$Json.and.returnValue(
  //     throwError({
  //       error: {
  //         result: null,
  //         errorMessage: "Erreur d'authentification",
  //         timeGenerated: '2021-04-14T07:15:53.3714816Z',
  //         statusCode: 401,
  //       },
  //     })
  //   );
  //   component.loginForm.patchValue({
  //     email: 'aa@a3dn.com',
  //     password: 'Welcome@Seit2019',
  //   });
  //   component.submit();
  //   expect(mockAuthNoticeService.setNotice).toHaveBeenCalled();
  //   expect(component.loading).toBeFalse();
  // });
  it('should navigate to dashboard when admin has connected and fill the localstorage with information', () => {
    component.loginForm.patchValue({
      email: 'aa@a3dn.com',
      password: 'Welcome@Seit2019',
    });
    mockAuthentificationService.demanderSession$Json.and.returnValue(of(ADMIN_LOGIN));

    component.submit();

    expect(localStorage.getItem('jwt')).toBe(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYXNlQ2xpZW50IjoiYTNkblN0YWdpbmciLCJsb2dpbklkIjoiZDA4ZjExZTAtYjlmNy00ZDVlLWE4NzItMzIxMTk5ZWY1NzJlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsImV4cCI6MTYyODc1ODA5MCwiaXNzIjoiaHR0cDovL2EzZG4uY29tIiwiYXVkIjoiaHR0cDovL2EzZG4uY29tIn0.tMevDcmshtQZZ8ZS7M10opEQ0f0dUqOvVA8n_h0A5NI'
    );
    expect(localStorage.getItem('fullname')).toBe('Amin Admin');
    expect(localStorage.getItem('email')).toBe('superadmin@a3dn.com');
    expect(localStorage.getItem('role')).toBe('superAdmin');
    expect(component.loading).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/a/super-admin/trials/pending']);
  });

  it('should add user info when the route comes with data', () => {
    expect((emailInput.nativeElement as HTMLInputElement).value).toBe('mail@mail');
    expect((passwordDE.nativeElement as HTMLInputElement).value).toBe('123456');
  });
});

const SUCCESS_LOGIN = {
  result: {
    jeton:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbklkIjoiNTE0N2U1Y2YtMzhiMC00NTgyLWFmNmMtN2M0YTRhNTY0NTc1IiwiZXhwIjoxNjE4NjQzMTY3LCJpc3MiOiJodHRwOi8vYTNkbi5jb20iLCJhdWQiOiJodHRwOi8vYTNkbi5jb20ifQ.OGvyVakYWrPOxOuQcabupiZZVVWlxubjp_jHN2U4LmE',
    autorisations: [
      {
        loginId: '5147e5cf-38b0-4582-af6c-7c4a4a564575',
        codeLicence: 'D37B-F218-B506-4601',
        nomLicence: 'A3D STAGING 01',
        role: 'AccountAdmin',
        utilisateurUid: '276a1119-4be3-4feb-b559-df1a200163f6',
      },
      {
        loginId: '5147e5cf-38b0-4582-af6c-7c4a4a564575',
        codeLicence: 'D37B-F118-B506-4602',
        nomLicence: 'A3D STAGING 02',
        role: 'AccountAdmin',
        utilisateurUid: '276a1119-4be3-4feb-b559-df1a200163f6',
      },
    ],
  },
  errorMessage: null,
  timeGenerated: '2021-04-14T07:06:07.0099589Z',
  statusCode: 200,
};

const ADMIN_LOGIN = {
  result: {
    jeton: null,
    jetonsSessionSuperAdminDto: {
      expirationJetonApi: '2021-08-12T08:48:10.000Z',
      jetonApi:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYXNlQ2xpZW50IjoiYTNkblN0YWdpbmciLCJsb2dpbklkIjoiZDA4ZjExZTAtYjlmNy00ZDVlLWE4NzItMzIxMTk5ZWY1NzJlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsImV4cCI6MTYyODc1ODA5MCwiaXNzIjoiaHR0cDovL2EzZG4uY29tIiwiYXVkIjoiaHR0cDovL2EzZG4uY29tIn0.tMevDcmshtQZZ8ZS7M10opEQ0f0dUqOvVA8n_h0A5NI',
      nomSuperAdmin: 'Amin Admin',
      email: 'superadmin@a3dn.com',
      nomSociete: 'a3dnSuperAdmin',
    },
    autorisations: null,
  },
  errorMessage: null,
  timeGenerated: '2021-08-12T07:48:10.6129124Z',
  statusCode: 200,
};
