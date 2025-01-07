import { Component, inject, OnInit } from '@angular/core';
import { Evenement } from '../user-list/models/event';
import { DashboardService } from './dashboard.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { RateEventComponent } from './rate-event/rate-event.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
onBlogClick() {
  this.router.navigate(['blogs']);
}
  signOut() {
    this.router.navigate(['login']);
  }
  readonly dialog = inject(MatDialog);
  stars: number[] = [1, 2, 3, 4, 5];

  eventList: Evenement[] = [];
  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.getEvents().subscribe((value) => {
      this.eventList = value;
    });
  }
  rateEvent() {
    this.dialog.open(RateEventComponent, {
      width: '270px',
      height: '100px',
    });
  }
  openReservationDialog(title: string) {
    this.dialog.open(ReservationFormComponent, {
      width: '35vw',
      height: '70vh',
      data: title,
    });
  }
}
