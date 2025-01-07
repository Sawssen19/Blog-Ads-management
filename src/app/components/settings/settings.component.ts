import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="settings-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Paramètres</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="settingsForm" class="settings-form">
            <h3>Notifications</h3>
            <div class="settings-section">
              <mat-slide-toggle formControlName="emailNotifications">
                Notifications par email
              </mat-slide-toggle>
              <mat-slide-toggle formControlName="pushNotifications">
                Notifications push
              </mat-slide-toggle>
            </div>

            <h3>Préférences d'affichage</h3>
            <div class="settings-section">
              <mat-form-field appearance="fill">
                <mat-label>Thème</mat-label>
                <mat-select formControlName="theme">
                  <mat-option value="light">Clair</mat-option>
                  <mat-option value="dark">Sombre</mat-option>
                  <mat-option value="system">Système</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Langue</mat-label>
                <mat-select formControlName="language">
                  <mat-option value="fr">Français</mat-option>
                  <mat-option value="en">English</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <h3>Confidentialité</h3>
            <div class="settings-section">
              <mat-slide-toggle formControlName="profileVisibility">
                Profil public
              </mat-slide-toggle>
              <mat-slide-toggle formControlName="activityVisibility">
                Activités visibles
              </mat-slide-toggle>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="resetSettings()">Réinitialiser</button>
          <button mat-raised-button color="primary" (click)="saveSettings()">
            Enregistrer
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .settings-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    h3 {
      margin: 0;
      color: rgba(0, 0, 0, 0.87);
    }
  `]
})
export class SettingsComponent {
  settingsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      emailNotifications: [true],
      pushNotifications: [true],
      theme: ['system'],
      language: ['fr'],
      profileVisibility: [false],
      activityVisibility: [false]
    });
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      console.log('Settings saved:', this.settingsForm.value);
      // Implement actual saving logic here
    }
  }

  resetSettings(): void {
    this.settingsForm.reset({
      emailNotifications: true,
      pushNotifications: true,
      theme: 'system',
      language: 'fr',
      profileVisibility: false,
      activityVisibility: false
    });
  }
}
