import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCardComponent } from './user-list/user-card/user-card.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReservationFormComponent } from './dashboard/reservation-form/reservation-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ReservationSnackbarComponent } from './dashboard/reservation-form/reservation-snackbar/reservation-snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { RateEventComponent } from './dashboard/rate-event/rate-event.component';
import { RateSnackbarComponent } from './dashboard/rate-event/rate-snackbar/rate-snackbar.component';
import { PaymentComponent } from './dashboard/reservation-form/payment/payment.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UserListComponent,
    UserCardComponent,
    ReservationFormComponent,
    ReservationSnackbarComponent,
    RateEventComponent,
    RateSnackbarComponent,
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
  ],
})
export class UsersModule {}
