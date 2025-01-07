import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <div mat-card-avatar class="profile-avatar">
            <mat-icon>person</mat-icon>
          </div>
          <mat-card-title>Nom d'utilisateur</mat-card-title>
          <mat-card-subtitle>email@example.com</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="profile-info">
            <p><strong>Nom complet:</strong> John Doe</p>
            <p><strong>Téléphone:</strong> +1234567890</p>
            <p><strong>Adresse:</strong> 123 Rue Example, Ville</p>
            <p><strong>Membre depuis:</strong> Janvier 2024</p>
          </div>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button color="primary">Modifier le profil</button>
          <button mat-button color="warn">Changer le mot de passe</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .profile-card {
      width: 100%;
    }
    .profile-avatar {
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .profile-info {
      margin-top: 20px;
    }
    .profile-info p {
      margin: 8px 0;
    }
  `]
})
export class ProfileComponent {}
