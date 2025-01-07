import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  Advertisement,
  AdvertisementStatus,
  CreateAdvertisementDTO,
} from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';
import { AdvertisementFormDialogComponent } from '../advertisement-form-dialog/advertisement-form-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-advertisement-list',
  templateUrl: './advertisement-list.component.html',
  styleUrls: ['./advertisement-list.component.scss']
})
export class AdvertisementListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'image',
    'title',
    'type',
    'position',
    'dates',
    'actions',
  ];
  dataSource: MatTableDataSource<Advertisement>;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  selectedType: string = 'all';
  selectedStatus: string = 'all';
  selectedPosition: string = 'all';
  totalAds: number = 0;
  activeAds: number = 0;
  get inactiveAds(): number {
    return this.dataSource.data.filter((ad) => ad.status === 'paused').length;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adService: AdvertisementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Advertisement>();
  }

  ngOnInit() {
    this.loadAds();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAds() {
    this.adService
      .getAdvertisements()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ads) => {
        this.dataSource.data = ads;
        this.updateStats(ads);
      });
  }

  updateStats(ads: Advertisement[]) {
    this.totalAds = ads.length;
    this.activeAds = ads.filter((ad) => ad.status === 'active').length;
  }

  applyFilters() {
    let filteredData = this.dataSource.data;

    if (this.selectedStatus !== 'all') {
      filteredData = filteredData.filter(
        (ad) => ad.status === this.selectedStatus
      );
    }

    if (this.selectedType !== 'all') {
      filteredData = filteredData.filter((ad) => ad.type === this.selectedType);
    }

    if (this.selectedPosition !== 'all') {
      filteredData = filteredData.filter(
        (ad) => ad.position === this.selectedPosition
      );
    }

    this.dataSource.data = filteredData;
  }

  openAdDialog(ad?: Advertisement): void {
    const dialogRef = this.dialog.open(AdvertisementFormDialogComponent, {
      width: '600px',
      data: ad ? { advertisement: ad } : undefined,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.isEditMode(result)) {
          this.adService
            .updateAdvertisement(result.id, result)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedAd) => {
                const index = this.dataSource.data.findIndex((a) => a.id === result.id);
                if (index !== -1) {
                  this.dataSource.data = [
                    ...this.dataSource.data.slice(0, index),
                    updatedAd,
                    ...this.dataSource.data.slice(index + 1),
                  ];
                }
                this.snackBar.open('Publicité mise à jour avec succès', 'Fermer', {
                  duration: 3000,
                });
              },
              error: (error) => {
                console.error('Error updating advertisement:', error);
                this.snackBar.open(
                  'Erreur lors de la mise à jour de la publicité',
                  'Fermer',
                  {
                    duration: 3000,
                  }
                );
              },
            });
        } else {
          this.adService
            .createAdvertisement(result)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (newAd) => {
                this.dataSource.data = [...this.dataSource.data, newAd];
                this.snackBar.open('Publicité créée avec succès', 'Fermer', {
                  duration: 3000,
                });
              },
              error: (error) => {
                console.error('Error creating advertisement:', error);
                this.snackBar.open(
                  'Erreur lors de la création de la publicité',
                  'Fermer',
                  {
                    duration: 3000,
                  }
                );
              },
            });
        }
      }
    });
  }

  private isEditMode(result: any): result is Advertisement {
    return 'id' in result;
  }

  editAd(ad: Advertisement) {
    this.openAdDialog(ad);
  }

  updateAdStatus(ad: Advertisement, newStatus: AdvertisementStatus): void {
    this.adService
      .updateAdvertisement(ad.id, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedAd) => {
          const index = this.dataSource.data.findIndex((a) => a.id === ad.id);
          if (index !== -1) {
            this.dataSource.data = [
              ...this.dataSource.data.slice(0, index),
              updatedAd,
              ...this.dataSource.data.slice(index + 1),
            ];
          }
          this.snackBar.open('Statut mis à jour avec succès', 'Fermer', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating ad status:', error);
          this.snackBar.open(
            'Erreur lors de la mise à jour du statut',
            'Fermer',
            {
              duration: 3000,
            }
          );
        },
      });
  }

  duplicateAd(ad: Advertisement): void {
    const duplicatedAd: CreateAdvertisementDTO = {
      title: `${ad.title} (copie)`,
      description: ad.description,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      type: ad.type,
      position: ad.position,
      startDate: ad.startDate,
      endDate: ad.endDate,
      targetAudience: [...(ad.targetAudience || [])]
    };

    this.adService
      .createAdvertisement(duplicatedAd)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newAd) => {
          this.dataSource.data = [...this.dataSource.data, newAd];
          this.snackBar.open('Publicité dupliquée avec succès', 'Fermer', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error duplicating ad:', error);
          this.snackBar.open(
            'Erreur lors de la duplication de la publicité',
            'Fermer',
            {
              duration: 3000,
            }
          );
        },
      });
  }

  deleteAd(ad: Advertisement) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      this.adService.deleteAdvertisement(ad.id).subscribe(() => this.loadAds());
    }
  }

  exportAds() {
    const data = this.dataSource.data.map((ad) => ({
      ...ad,
      status: this.getStatusLabel(ad.status),
      type: this.getTypeLabel(ad.type),
      position: this.getPositionLabel(ad.position),
    }));

    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `publicites_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  refreshAds() {
    this.loadAds();
  }

  defaultImageUrl = 'https://via.placeholder.com/60x60';

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImageUrl;
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      active: 'Actif',
      inactive: 'Inactif',
      scheduled: 'Planifié',
    };
    return statusLabels[status] || status;
  }

  getTypeLabel(type: string): string {
    const typeLabels: { [key: string]: string } = {
      banner: 'Bannière',
      video: 'Vidéo',
      sponsored: 'Sponsorisé',
    };
    return typeLabels[type] || type;
  }

  getTypeIcon(type: string): string {
    const typeIcons: { [key: string]: string } = {
      banner: 'view_carousel',
      video: 'play_circle',
      sponsored: 'star',
    };
    return typeIcons[type] || 'help';
  }

  getPositionLabel(position: string): string {
    const positionLabels: { [key: string]: string } = {
      header: 'En-tête',
      sidebar: 'Barre latérale',
      content: 'Contenu',
      footer: 'Pied de page',
    };
    return positionLabels[position] || position;
  }

  formatDate(date: string | Date): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]);
    const rows = data.map((obj) => headers.map((header) => obj[header]));
    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
