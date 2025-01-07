import { Component, inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rate-snackbar',
  templateUrl: './rate-snackbar.component.html',
  styleUrls: ['./rate-snackbar.component.css']
})
export class RateSnackbarComponent implements OnInit {
 data: { stars: number } =
    inject(MAT_SNACK_BAR_DATA);

  constructor() { }

  ngOnInit(): void {
  }

}
