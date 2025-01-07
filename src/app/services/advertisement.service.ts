import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Advertisement, CreateAdvertisementDTO } from '../models/advertisement.model';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  private mockAds: Advertisement[] = [
    {
      id: '1',
      title: 'Publicité Test 1',
      description: 'Description de la publicité test 1',
      imageUrl: 'https://via.placeholder.com/300x200',
      linkUrl: 'https://example.com',
      type: 'banner',
      position: 'header',
      startDate: new Date(),
      endDate: new Date(),
      impressions: 100,
      clicks: 10,
      engagement: 10,
      active: true,
      status: 'active'
    },
    {
      id: '2',
      title: 'Publicité Test 2',
      description: 'Description de la publicité test 2',
      imageUrl: 'https://via.placeholder.com/300x200',
      linkUrl: 'https://example.com',
      type: 'banner',
      position: 'sidebar',
      startDate: new Date(),
      endDate: new Date(),
      impressions: 200,
      clicks: 20,
      engagement: 10,
      active: true,
      status: 'active'
    }
  ];

  getAdvertisements(): Observable<Advertisement[]> {
    return of(this.mockAds);
  }

  createAdvertisement(ad: CreateAdvertisementDTO): Observable<Advertisement> {
    const newAd: Advertisement = {
      ...ad,
      id: (this.mockAds.length + 1).toString(),
      impressions: 0,
      clicks: 0,
      engagement: 0,
      active: true,
      status: 'active'
    };
    this.mockAds.push(newAd);
    return of(newAd);
  }

  updateAdvertisement(id: string, changes: Partial<Omit<Advertisement, 'id'>>): Observable<Advertisement> {
    const index = this.mockAds.findIndex((ad) => ad.id === id);
    if (index === -1) {
      return throwError(() => new Error('Advertisement not found'));
    }

    this.mockAds[index] = {
      ...this.mockAds[index],
      ...changes,
    };

    return of(this.mockAds[index]);
  }

  deleteAdvertisement(id: string): Observable<void> {
    const index = this.mockAds.findIndex(ad => ad.id === id);
    if (index !== -1) {
      this.mockAds.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Advertisement not found');
  }
}
