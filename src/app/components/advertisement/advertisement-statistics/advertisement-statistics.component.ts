import { Component, OnInit, OnDestroy } from '@angular/core';
import { Advertisement } from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-advertisement-statistics',
  template: `
    <div class="stats-container">
      <div class="stats-grid">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Total des impressions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ totalImpressions }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Total des clics</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ totalClicks }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Taux d'engagement moyen</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">
              {{ averageEngagement | number : '1.1-2' }}%
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="performance-table">
        <mat-card-header>
          <mat-card-title>Performance des publicités</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="advertisements">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Titre</th>
              <td mat-cell *matCellDef="let ad">{{ ad.title }}</td>
            </ng-container>

            <ng-container matColumnDef="impressions">
              <th mat-header-cell *matHeaderCellDef>Impressions</th>
              <td mat-cell *matCellDef="let ad">{{ ad.impressions }}</td>
            </ng-container>

            <ng-container matColumnDef="clicks">
              <th mat-header-cell *matHeaderCellDef>Clics</th>
              <td mat-cell *matCellDef="let ad">{{ ad.clicks }}</td>
            </ng-container>

            <ng-container matColumnDef="engagement">
              <th mat-header-cell *matHeaderCellDef>Taux d'engagement</th>
              <td mat-cell *matCellDef="let ad">
                {{ ad.engagement | number : '1.1-2' }}%
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .stats-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      .stat-value {
        font-size: 36px;
        font-weight: bold;
        color: #1976d2;
        text-align: center;
        padding: 20px 0;
      }

      .performance-table {
        margin-top: 20px;
      }

      table {
        width: 100%;
      }

      .mat-column-title {
        flex: 2;
      }

      .mat-column-impressions,
      .mat-column-clicks,
      .mat-column-engagement {
        flex: 1;
        justify-content: center;
      }
    `,
  ],
})
export class AdvertisementStatisticsComponent implements OnInit, OnDestroy {
  advertisements: Advertisement[] = [];
  displayedColumns: string[] = ['title', 'impressions', 'clicks', 'engagement'];
  totalImpressions = 0;
  totalClicks = 0;
  averageEngagement = 0;
  private subscription: Subscription = new Subscription();

  constructor(private advertisementService: AdvertisementService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadStatistics(): void {
    this.subscription.add(
      this.advertisementService.getAdvertisements().subscribe(ads => {
        this.advertisements = ads;
        this.calculateStatistics();
      })
    );
  }

  calculateStatistics(): void {
    this.totalImpressions = this.advertisements.reduce(
      (sum, ad) => sum + (ad.impressions || 0),
      0
    );
    this.totalClicks = this.advertisements.reduce(
      (sum, ad) => sum + (ad.clicks || 0),
      0
    );
    this.averageEngagement =
      this.advertisements.length > 0
        ? this.advertisements.reduce(
            (sum, ad) => sum + (ad.engagement || 0),
            0
          ) / this.advertisements.length
        : 0;
  }
}
