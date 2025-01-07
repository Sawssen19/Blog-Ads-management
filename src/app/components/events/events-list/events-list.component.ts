import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="events-container">
      <div class="events-header">
        <h1>Événements</h1>
        <button mat-raised-button color="primary" routerLink="create">
          <mat-icon>add</mat-icon>
          Créer un événement
        </button>
      </div>

      <div class="events-grid">
        <mat-card *ngFor="let event of events" class="event-card">
          <img mat-card-image [src]="event.imageUrl" [alt]="event.title">
          <mat-card-content>
            <h2>{{ event.title }}</h2>
            <p class="event-date">
              <mat-icon>calendar_today</mat-icon>
              {{ event.date | date:'longDate' }}
            </p>
            <p class="event-location">
              <mat-icon>location_on</mat-icon>
              {{ event.location }}
            </p>
            <p class="event-description">{{ event.description }}</p>
            <div class="event-details">
              <mat-chip>{{ event.category }}</mat-chip>
              <mat-chip>{{ event.price | currency:'EUR' }}</mat-chip>
              <mat-chip>{{ event.currentRegistrations }}/{{ event.capacity }} places</mat-chip>
            </div>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button color="primary" [routerLink]="[event.id]">
              S'inscrire
            </button>
            <button mat-button color="accent" [routerLink]="[event.id, 'edit']">
              Modifier
            </button>
            <button mat-button color="warn" (click)="deleteEvent(event.id)">
              Supprimer
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .events-container {
      padding: 24px;
    }
    .events-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .event-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .event-card img {
      height: 200px;
      object-fit: cover;
    }
    .event-date, .event-location {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(0, 0, 0, 0.6);
    }
    .event-description {
      margin: 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .event-details {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin: 8px 0;
    }
    mat-card-actions {
      margin-top: auto;
      padding: 8px;
    }
  `]
})
export class EventsListComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  deleteEvent(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      // TODO: Implement delete in EventService
      console.log('Suppression de l\'événement:', id);
    }
  }
}
