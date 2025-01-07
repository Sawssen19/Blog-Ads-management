import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Advertisement } from '../../models/advertisement.model';
import { AdvertisementService } from '../../services/advertisement.service';
import { AdvertisementModule } from '../advertisement/advertisement.module';
import { AdvertisementFormDialogComponent } from '../advertisement/advertisement-form-dialog/advertisement-form-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatMenuModule,
    AdvertisementModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  activeAds: Advertisement[] = [];
  totalImpressions = 0;
  totalClicks = 0;
  averageEngagement = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private adService: AdvertisementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadActiveAds();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadActiveAds(): void {
    this.subscription.add(
      this.adService.getAdvertisements().subscribe({
        next: (ads) => {
          this.activeAds = ads.filter(ad => ad.active);
          this.calculateStats();
        },
        error: (error) => {
          console.error('Error loading active ads:', error);
          this.snackBar.open('Erreur lors du chargement des publicités', 'Fermer', {
            duration: 3000
          });
        }
      })
    );
  }

  calculateStats(): void {
    this.totalImpressions = this.activeAds.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
    this.totalClicks = this.activeAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    this.averageEngagement = this.activeAds.length > 0
      ? this.activeAds.reduce((sum, ad) => sum + (ad.engagement || 0), 0) / this.activeAds.length
      : 0;
  }

  openCreateAdDialog(): void {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadActiveAds();
      }
    });
  }

  editAd(ad: Advertisement): void {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', ad }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadActiveAds();
      }
    });
  }

  pauseAd(ad: Advertisement): void {
    if (!ad.id) return;
    
    this.adService.updateAdvertisement(ad.id, { ...ad, active: false }).subscribe({
      next: () => {
        this.loadActiveAds();
        this.snackBar.open('Publicité mise en pause', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error pausing ad:', error);
        this.snackBar.open('Erreur lors de la mise en pause', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  activateAd(ad: Advertisement): void {
    if (!ad.id) return;
    
    this.adService.updateAdvertisement(ad.id, { ...ad, active: true }).subscribe({
      next: () => {
        this.loadActiveAds();
        this.snackBar.open('Publicité réactivée', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error activating ad:', error);
        this.snackBar.open('Erreur lors de la réactivation', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  deleteAd(ad: Advertisement): void {
    if (!ad.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      this.adService.deleteAdvertisement(ad.id).subscribe({
        next: () => {
          this.loadActiveAds();
          this.snackBar.open('Publicité supprimée', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting ad:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
}
