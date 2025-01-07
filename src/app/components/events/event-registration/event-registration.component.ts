import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Event, EventRegistration, TicketType } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Inscription à {{ data.event.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="registrationForm" class="registration-form">
        <mat-form-field appearance="fill">
          <mat-label>Type de billet</mat-label>
          <mat-select formControlName="ticketType">
            <mat-option *ngFor="let type of ticketTypes" [value]="type">
              {{ type | titlecase }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Nombre de places</mat-label>
          <input matInput type="number" formControlName="quantity" min="1" 
                 [max]="data.event.capacity - data.event.currentRegistrations">
          <mat-hint>Places disponibles : {{ data.event.capacity - data.event.currentRegistrations }}</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Besoins spéciaux</mat-label>
          <textarea matInput formControlName="specialRequirements" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Nom complet</mat-label>
          <input matInput formControlName="fullName">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Téléphone</mat-label>
          <input matInput formControlName="phoneNumber">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Adresse</mat-label>
          <input matInput formControlName="address">
        </mat-form-field>

        <div class="price-summary">
          <p>Prix unitaire : {{ data.event.price | currency:'EUR' }}</p>
          <p>Total : {{ getTotalPrice() | currency:'EUR' }}</p>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="!registrationForm.valid"
              (click)="register()">
        Confirmer l'inscription
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .registration-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
      padding: 16px 0;
    }
    .price-summary {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin-top: 16px;
    }
    .price-summary p {
      margin: 8px 0;
    }
  `]
})
export class EventRegistrationComponent {
  registrationForm: FormGroup;
  ticketTypes: TicketType[] = ['standard', 'vip', 'early_bird', 'student', 'group'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventRegistrationComponent>,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event }
  ) {
    this.registrationForm = this.fb.group({
      ticketType: ['standard', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), 
                    Validators.max(data.event.capacity - data.event.currentRegistrations)]],
      specialRequirements: [''],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  getTotalPrice(): number {
    const quantity = this.registrationForm.get('quantity')?.value || 0;
    return quantity * this.data.event.price;
  }

  register(): void {
    if (this.registrationForm.valid) {
      const registration: Omit<EventRegistration, 'id' | 'registrationDate' | 'status'> = {
        eventId: this.data.event.id,
        userId: 'current-user-id', // TODO: Get from auth service
        paymentStatus: 'pending',
        fullName: this.registrationForm.get('fullName')?.value,
        email: this.registrationForm.get('email')?.value,
        phoneNumber: this.registrationForm.get('phoneNumber')?.value,
        address: this.registrationForm.get('address')?.value,
        ticketType: this.registrationForm.get('ticketType')?.value,
        quantity: this.registrationForm.get('quantity')?.value,
        specialRequirements: this.registrationForm.get('specialRequirements')?.value,
        totalAmount: this.getTotalPrice()
      };

      this.dialogRef.close(registration);
    }
  }
}
