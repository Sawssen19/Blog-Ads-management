export interface AdvertisementStatistics {
  views: number;
  clicks: number;
  clickThroughRate: number;
  revenue: number;
}

export type AdvertisementStatus = 'active' | 'paused' | 'ended' | 'scheduled';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  type: 'banner' | 'video' | 'popup';
  position: 'header' | 'sidebar' | 'footer';
  startDate: Date;
  endDate: Date;
  impressions: number;
  clicks: number;
  engagement: number;
  active: boolean;
  status: AdvertisementStatus;
  targetAudience?: string[];
}

export type CreateAdvertisementDTO = Omit<Advertisement, 'id' | 'impressions' | 'clicks' | 'engagement' | 'active' | 'status'> & {
  id?: string;
};
