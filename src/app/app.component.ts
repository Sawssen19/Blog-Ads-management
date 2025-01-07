import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gestion-evenement';

  constructor(private router: Router) {}

  logout() {
    // TODO: Implement actual logout logic here
    this.router.navigate(['/login']);
  }
}
