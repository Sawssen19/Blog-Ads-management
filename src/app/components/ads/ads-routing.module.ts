import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertisementListComponent } from '../advertisement/advertisement-list/advertisement-list.component';
import { AdvertisementManagementComponent } from '../advertisement/advertisement-management/advertisement-management.component';
import { AdvertisementStatisticsComponent } from '../advertisement/advertisement-statistics/advertisement-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: AdvertisementListComponent
  },
  {
    path: 'management',
    component: AdvertisementManagementComponent
  },
  {
    path: 'statistics',
    component: AdvertisementStatisticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdsRoutingModule { }
