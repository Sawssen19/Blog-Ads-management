import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-snackbar',
  templateUrl: './reservation-snackbar.component.html',
  styleUrls: ['./reservation-snackbar.component.css'],
})
export class ReservationSnackbarComponent implements OnInit {
  data: { firstName: string; lastName: string; event: string } =
    inject(MAT_SNACK_BAR_DATA);

  constructor() {}

  ngOnInit(): void {}
}
