import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventService } from '../../../services/event.service';
import { Event, EventCategory } from '../../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="event-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Créer un événement</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="event-form">
            <mat-form-field appearance="fill">
              <mat-label>Titre</mat-label>
              <input matInput formControlName="title" required>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4" required></textarea>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" required>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Date limite d'inscription</mat-label>
              <input matInput [matDatepicker]="deadlinePicker" formControlName="registrationDeadline" required>
              <mat-datepicker-toggle matSuffix [for]="deadlinePicker"></mat-datepicker-toggle>
              <mat-datepicker #deadlinePicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Lieu</mat-label>
              <input matInput formControlName="location" required>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Capacité</mat-label>
              <input matInput type="number" formControlName="capacity" required min="1">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Prix</mat-label>
              <input matInput type="number" formControlName="price" required min="0">
              <span matSuffix>€</span>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Organisateur</mat-label>
              <input matInput formControlName="organizer" required>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Catégorie</mat-label>
              <mat-select formControlName="category" required>
                <mat-option *ngFor="let category of categories" [value]="category">
                  {{ category | titlecase }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>URL de l'image</mat-label>
              <input matInput formControlName="imageUrl" required>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Tags (séparés par des virgules)</mat-label>
              <input matInput formControlName="tags">
              <mat-hint>Exemple: musique, concert, jazz</mat-hint>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/events">Annuler</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!eventForm.valid || isSubmitting">
                {{ isEditMode ? 'Mettre à jour' : 'Créer' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .event-form-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .event-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  currentEventId?: string;
  categories: EventCategory[] = ['conference', 'workshop', 'seminar', 'networking', 'cultural', 'sports', 'other'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      registrationDeadline: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [100, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      organizer: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: ['assets/images/default-blog.jpg', Validators.required],
      tags: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentEventId = id;
      this.loadEventData(id);
    }
  }

  loadEventData(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        if (event) {
          // Convert tags array to string for the form
          const tagsString = event.tags ? event.tags.join(', ') : '';
          
          this.eventForm.patchValue({
            ...event,
            tags: tagsString
          });
        } else {
          this.showError('Événement non trouvé');
          this.router.navigate(['/events']);
        }
      },
      error: (error) => {
        this.showError('Erreur lors du chargement de l\'événement');
        console.error('Error loading event:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Convert form value to Event type
      const formValue = this.eventForm.value;
      const eventData = {
        ...formValue,
        tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [],
        status: 'published',
        isPublished: true
      };

      if (this.isEditMode && this.currentEventId) {
        this.eventService.updateEvent(this.currentEventId, eventData).subscribe({
          next: () => {
            this.showSuccess('Événement mis à jour avec succès');
            this.router.navigate(['/events']);
          },
          error: (error) => {
            this.showError('Erreur lors de la mise à jour de l\'événement');
            console.error('Error updating event:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      } else {
        this.eventService.createEvent(eventData).subscribe({
          next: () => {
            this.showSuccess('Événement créé avec succès');
            this.router.navigate(['/events']);
          },
          error: (error) => {
            this.showError('Erreur lors de la création de l\'événement');
            console.error('Error creating event:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      }
    }
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
