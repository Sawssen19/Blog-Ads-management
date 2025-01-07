import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventService } from '../../../services/event.service';
import { PaymentService } from '../../../services/payment.service';
import { Event, EventRegistration } from '../../../models/event.model';
import { PaymentFormComponent } from '../../payment/payment-form.component';
import { EventRegistrationComponent } from '../event-registration/event-registration.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    PaymentFormComponent,
    EventRegistrationComponent
  ],
  template: `
    <div class="event-detail-container" *ngIf="event">
      <mat-card class="event-card">
        <img mat-card-image [src]="event.imageUrl" [alt]="event.title">
        <mat-card-header>
          <mat-card-title>{{ event.title }}</mat-card-title>
          <mat-card-subtitle>{{ event.category | titlecase }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p class="description">{{ event.description }}</p>
          <div class="event-info">
            <p><strong>Date:</strong> {{ event.date | date:'longDate' }}</p>
            <p><strong>Lieu:</strong> {{ event.location }}</p>
            <p><strong>Prix:</strong> {{ event.price }}€</p>
            <p><strong>Capacité:</strong> {{ event.capacity }} personnes</p>
            <p><strong>Places restantes:</strong> {{ event.capacity - event.currentRegistrations }} places</p>
            <p><strong>Organisateur:</strong> {{ event.organizer }}</p>
            <p><strong>Date limite d'inscription:</strong> {{ event.registrationDeadline | date:'longDate' }}</p>
          </div>
          <div class="tags" *ngIf="event.tags && event.tags.length">
            <span class="tag" *ngFor="let tag of event.tags">{{ tag }}</span>
          </div>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="goBack()">Retour</button>
          <button mat-button color="primary" (click)="editEvent()" *ngIf="canEdit">Modifier</button>
          <button mat-raised-button color="primary" (click)="startRegistration()" 
                  [disabled]="isRegistrationClosed() || isEventFull()">
            {{ getRegistrationButtonText() }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .event-detail-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .event-card {
      margin-bottom: 24px;
    }
    .event-card img {
      max-height: 400px;
      object-fit: cover;
    }
    .description {
      margin: 16px 0;
      white-space: pre-line;
    }
    .event-info {
      margin: 16px 0;
    }
    .event-info p {
      margin: 8px 0;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }
    .tag {
      background-color: #e0e0e0;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 14px;
    }
    mat-card-actions {
      padding: 16px;
    }
  `]
})
export class EventDetailComponent implements OnInit {
  event?: Event;
  canEdit = false; // À implémenter avec l'authentification

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    } else {
      this.router.navigate(['/events']);
    }
  }

  loadEvent(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        if (event) {
          this.event = event;
        } else {
          this.showError('Événement non trouvé');
          this.router.navigate(['/events']);
        }
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.showError('Erreur lors du chargement de l\'événement');
        this.router.navigate(['/events']);
      }
    });
  }

  isRegistrationClosed(): boolean {
    if (!this.event) return true;
    const deadline = new Date(this.event.registrationDeadline);
    return deadline < new Date();
  }

  isEventFull(): boolean {
    if (!this.event) return true;
    return this.event.currentRegistrations >= this.event.capacity;
  }

  getRegistrationButtonText(): string {
    if (!this.event) return 'S\'inscrire';
    if (this.isEventFull()) return 'Complet';
    if (this.isRegistrationClosed()) return 'Inscriptions closes';
    return 'S\'inscrire';
  }

  startRegistration(): void {
    if (!this.event) return;

    const registrationDialog = this.dialog.open(EventRegistrationComponent, {
      width: '500px',
      data: { event: this.event }
    });

    registrationDialog.afterClosed().subscribe(registration => {
      if (registration) {
        // Ouvrir le dialogue de paiement
        const dialogRef = this.dialog.open(PaymentFormComponent, {
          width: '500px',
          disableClose: true,
          data: { amount: registration.totalAmount * 100 } // Stripe requires amount in cents
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            // Mettre à jour le statut de paiement
            registration.paymentStatus = 'completed';
            
            this.eventService.registerForEvent(registration).subscribe({
              next: () => {
                this.showSuccess('Inscription confirmée !');
                this.loadEvent(this.event!.id); // Recharger les détails de l'événement
              },
              error: (error) => {
                console.error('Error registering for event:', error);
                this.showError('Erreur lors de l\'inscription');
              }
            });
          }
        });
      }
    });
  }

  editEvent(): void {
    if (this.event) {
      this.router.navigate(['/events', this.event.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
