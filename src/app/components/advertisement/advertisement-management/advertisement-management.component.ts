import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Advertisement } from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';
import { AdvertisementFormDialogComponent } from '../advertisement-form/advertisement-form-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-advertisement-management',
  template: `
    <div class="management-container">
      <div class="header">
        <h1>Gestion des publicités</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Nouvelle publicité
        </button>
      </div>

      <div class="ads-grid">
        <mat-card *ngFor="let ad of advertisements">
          <img
            mat-card-image
            [src]="ad.imageUrl || 'assets/images/placeholder.jpg'"
            [alt]="ad.title"
          />
          <mat-card-header>
            <mat-card-title>{{ ad.title }}</mat-card-title>
            <mat-card-subtitle>{{ ad.type | titlecase }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ ad.description }}</p>
            <div class="stats">
              <div class="stat">
                <mat-icon>visibility</mat-icon>
                <span>{{ ad.impressions }}</span>
              </div>
              <div class="stat">
                <mat-icon>touch_app</mat-icon>
                <span>{{ ad.clicks }}</span>
              </div>
              <div class="stat">
                <mat-icon>trending_up</mat-icon>
                <span>{{ ad.engagement | number:'1.1-2' }}%</span>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="openEditDialog(ad)">
              <mat-icon>edit</mat-icon>
              Modifier
            </button>
            <button mat-button color="warn" (click)="deleteAd(ad.id)">
              <mat-icon>delete</mat-icon>
              Supprimer
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .management-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .ads-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .stats {
        display: flex;
        justify-content: space-around;
        margin-top: 16px;
      }

      .stat {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      mat-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      mat-card-content {
        flex-grow: 1;
      }

      mat-card-actions {
        display: flex;
        justify-content: space-between;
        padding: 8px;
      }

      img[mat-card-image] {
        height: 200px;
        object-fit: cover;
      }
    `,
  ],
})
export class AdvertisementManagementComponent implements OnInit, OnDestroy {
  advertisements: Advertisement[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private advertisementService: AdvertisementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAdvertisements();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAdvertisements(): void {
    this.subscription.add(
      this.advertisementService.getAdvertisements().subscribe(ads => {
        this.advertisements = ads;
      })
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.advertisementService.createAdvertisement(result).subscribe(() => {
            this.loadAdvertisements();
          });
        }
      })
    );
  }

  openEditDialog(ad: Advertisement): void {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', advertisement: ad }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.advertisementService
            .updateAdvertisement(ad.id!, result)
            .subscribe(() => {
              this.loadAdvertisements();
            });
        }
      })
    );
  }

  deleteAd(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      this.advertisementService.deleteAdvertisement(id).subscribe(() => {
        this.loadAdvertisements();
      });
    }
  }
}
