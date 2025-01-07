import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationSnackbarComponent } from './reservation-snackbar.component';

describe('ReservationSnackbarComponent', () => {
  let component: ReservationSnackbarComponent;
  let fixture: ComponentFixture<ReservationSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
