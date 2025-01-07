import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationFormGroup } from './models/reseervation-form-group';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationSnackbarComponent } from './reservation-snackbar/reservation-snackbar.component';
@Component({
  selector: 'reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css'],
})
export class ReservationFormComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  data: 'string' = inject(MAT_DIALOG_DATA);
  reservationFormGroup: FormGroup<ReservationFormGroup> =
    new FormGroup<ReservationFormGroup>({
      firstNameCtrl: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastNameCtrl: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      emailCtrl: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      phoneNumberCtrl: new FormControl<number | null>(null, {
        nonNullable: false,
        validators: [Validators.required],
      }),
    });

  constructor(private dialogRef: Dialog) {}

  ngOnInit(): void {}
  onValidateForm() {
    if (this.reservationFormGroup.invalid) {
      this.reservationFormGroup.markAllAsTouched();
      return;
    }
    this.openSnackBar();
    this.dialogRef.closeAll();
  }

  onDenyClick() {
    this.dialogRef.closeAll();
  }
  openSnackBar() {
    this._snackBar.openFromComponent(ReservationSnackbarComponent, {
      duration: this.durationInSeconds * 500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
      data: {
        event: this.data,
        lastName: this.reservationFormGroup.controls.lastNameCtrl.value,
        firstName: this.reservationFormGroup.controls.firstNameCtrl.value,
      },
    });
  }
}
