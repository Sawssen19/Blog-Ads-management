import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateSnackbarComponent } from './rate-snackbar.component';

describe('RateSnackbarComponent', () => {
  let component: RateSnackbarComponent;
  let fixture: ComponentFixture<RateSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
