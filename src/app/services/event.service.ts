import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Event, EventRegistration, Payment } from '../models/event.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly EVENTS_STORAGE_KEY = 'events';
  private readonly REGISTRATIONS_STORAGE_KEY = 'event_registrations';
  private readonly PAYMENTS_STORAGE_KEY = 'event_payments';
  
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  private registrationsSubject = new BehaviorSubject<EventRegistration[]>([]);
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);

  events$ = this.eventsSubject.asObservable();
  registrations$ = this.registrationsSubject.asObservable();
  payments$ = this.paymentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    // Load events
    const storedEvents = localStorage.getItem(this.EVENTS_STORAGE_KEY);
    if (storedEvents) {
      this.eventsSubject.next(JSON.parse(storedEvents));
    } else {
      this.initializeDefaultEvents();
    }

    // Load registrations
    const storedRegistrations = localStorage.getItem(this.REGISTRATIONS_STORAGE_KEY);
    if (storedRegistrations) {
      this.registrationsSubject.next(JSON.parse(storedRegistrations));
    }

    // Load payments
    const storedPayments = localStorage.getItem(this.PAYMENTS_STORAGE_KEY);
    if (storedPayments) {
      this.paymentsSubject.next(JSON.parse(storedPayments));
    }
  }

  private initializeDefaultEvents(): void {
    const defaultEvents: Event[] = [
      {
        id: '1',
        title: 'Concert de Jazz',
        description: 'Une soirée exceptionnelle de jazz avec les meilleurs artistes.',
        imageUrl: 'assets/images/default-blog.jpg',
        date: new Date('2024-02-15'),
        location: 'Salle de Concert XYZ',
        capacity: 200,
        price: 45,
        organizer: 'Jazz Club',
        category: 'cultural',
        status: 'published',
        registrationDeadline: new Date('2024-02-14'),
        currentRegistrations: 150,
        isPublished: true,
        tags: ['jazz', 'musique', 'concert']
      },
      {
        id: '2',
        title: 'Exposition d\'Art Moderne',
        description: 'Découvrez les œuvres contemporaines d\'artistes locaux.',
        imageUrl: 'assets/images/default-blog.jpg',
        date: new Date('2024-03-01'),
        location: 'Galerie ABC',
        capacity: 100,
        price: 15,
        organizer: 'Association des Arts',
        category: 'cultural',
        status: 'published',
        registrationDeadline: new Date('2024-02-28'),
        currentRegistrations: 45,
        isPublished: true,
        tags: ['art', 'exposition', 'moderne']
      },
      {
        id: '3',
        title: 'Marathon de la Ville',
        description: 'Participez au grand marathon annuel de la ville.',
        imageUrl: 'assets/images/default-blog.jpg',
        date: new Date('2024-04-10'),
        location: 'Centre-ville',
        capacity: 1000,
        price: 30,
        organizer: 'Club Sportif Municipal',
        category: 'sports',
        status: 'published',
        registrationDeadline: new Date('2024-04-01'),
        currentRegistrations: 750,
        isPublished: true,
        tags: ['sport', 'marathon', 'course']
      },
      {
        id: '4',
        title: 'Conférence Tech Innovation',
        description: 'Une journée dédiée aux dernières innovations technologiques.',
        imageUrl: 'assets/images/default-blog.jpg',
        date: new Date('2024-03-15'),
        location: 'Centre des Congrès',
        capacity: 300,
        price: 75,
        organizer: 'TechHub',
        category: 'conference',
        status: 'published',
        registrationDeadline: new Date('2024-03-10'),
        currentRegistrations: 280,
        isPublished: true,
        tags: ['technologie', 'innovation', 'conférence']
      }
    ];

    this.eventsSubject.next(defaultEvents);
    localStorage.setItem(this.EVENTS_STORAGE_KEY, JSON.stringify(defaultEvents));
  }

  // Event CRUD operations
  getEvents(): Observable<Event[]> {
    return this.events$;
  }

  getEventById(id: string): Observable<Event | undefined> {
    return this.events$.pipe(
      map(events => events.find(event => event.id === id))
    );
  }

  createEvent(event: Omit<Event, 'id'>): Observable<Event> {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
      currentRegistrations: 0,
      isPublished: false
    };

    return of(newEvent).pipe(
      tap(event => {
        const currentEvents = this.eventsSubject.value;
        this.eventsSubject.next([...currentEvents, event]);
        localStorage.setItem(this.EVENTS_STORAGE_KEY, JSON.stringify(this.eventsSubject.value));
      })
    );
  }

  updateEvent(id: string, eventData: Partial<Event>): Observable<Event> {
    return this.events$.pipe(
      map(events => {
        const eventIndex = events.findIndex(e => e.id === id);
        if (eventIndex === -1) {
          throw new Error('Event not found');
        }

        const updatedEvent = {
          ...events[eventIndex],
          ...eventData,
          id // Ensure ID doesn't change
        };

        const updatedEvents = [...events];
        updatedEvents[eventIndex] = updatedEvent;
        
        this.eventsSubject.next(updatedEvents);
        localStorage.setItem(this.EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
        
        return updatedEvent;
      })
    );
  }

  // Registration operations
  registerForEvent(registration: Omit<EventRegistration, 'id' | 'registrationDate' | 'status'>): Observable<EventRegistration> {
    const currentRegistrations = this.registrationsSubject.value;
    const newRegistration: EventRegistration = {
      id: crypto.randomUUID(),
      registrationDate: new Date(),
      status: 'confirmed',
      ...registration
    };

    const updatedRegistrations = [...currentRegistrations, newRegistration];
    this.registrationsSubject.next(updatedRegistrations);
    localStorage.setItem(this.REGISTRATIONS_STORAGE_KEY, JSON.stringify(updatedRegistrations));

    // Mettre à jour le nombre d'inscriptions pour l'événement
    const currentEvents = this.eventsSubject.value;
    const eventIndex = currentEvents.findIndex(e => e.id === registration.eventId);
    if (eventIndex !== -1) {
      const updatedEvents = [...currentEvents];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        currentRegistrations: (updatedEvents[eventIndex].currentRegistrations || 0) + registration.quantity
      };
      this.eventsSubject.next(updatedEvents);
      localStorage.setItem(this.EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    }

    return of(newRegistration);
  }

  // Payment operations
  processPayment(payment: Omit<Payment, 'id' | 'paymentDate' | 'status'>): Observable<Payment> {
    const newPayment: Payment = {
      ...payment,
      id: crypto.randomUUID(),
      paymentDate: new Date(),
      status: 'completed'
    };

    return of(newPayment).pipe(
      tap(payment => {
        const currentPayments = this.paymentsSubject.value;
        this.paymentsSubject.next([...currentPayments, payment]);
        localStorage.setItem(this.PAYMENTS_STORAGE_KEY, JSON.stringify(this.paymentsSubject.value));
        
        // Update registration status
        this.updateRegistrationPaymentStatus(payment.registrationId);
      })
    );
  }

  private updateRegistrationPaymentStatus(registrationId: string): void {
    const registrations = this.registrationsSubject.value;
    const registration = registrations.find(r => r.id === registrationId);
    if (registration) {
      registration.paymentStatus = 'completed';
      registration.status = 'confirmed';
      this.registrationsSubject.next([...registrations]);
      localStorage.setItem(this.REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
    }
  }

  // Additional helper methods
  getRegistrationsByEventId(eventId: string): Observable<EventRegistration[]> {
    return this.registrations$.pipe(
      map(registrations => registrations.filter(reg => reg.eventId === eventId))
    );
  }

  getPaymentByRegistrationId(registrationId: string): Observable<Payment | undefined> {
    return this.payments$.pipe(
      map(payments => payments.find(payment => payment.registrationId === registrationId))
    );
  }

  getUserRegistrations(userId: string): Observable<EventRegistration[]> {
    return this.registrations$.pipe(
      map(registrations => registrations.filter(reg => reg.userId === userId))
    );
  }
}
