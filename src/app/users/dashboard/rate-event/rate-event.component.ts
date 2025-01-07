import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RateSnackbarComponent } from './rate-snackbar/rate-snackbar.component';

@Component({
  selector: 'app-rate-event',
  templateUrl: './rate-event.component.html',
  styleUrls: ['./rate-event.component.css'],
})
export class RateEventComponent implements OnInit {
  selectedRate: number = 0;
  durationInSeconds = 5;
  private _snackBar = inject(MatSnackBar);

  onRate(index: number) {
    this.selectedRate = index;
  }
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private dialogRef: MatDialog) {}

  ngOnInit(): void {}

  openSnackBar(stars: number) {
    this._snackBar.openFromComponent(RateSnackbarComponent, {
      duration: this.durationInSeconds * 500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
      data: {
        stars: stars,
      },
    });
  }

  changeRate(index: number) {
    this.openSnackBar(index + 1);
    this.dialogRef.closeAll();
  }
}
