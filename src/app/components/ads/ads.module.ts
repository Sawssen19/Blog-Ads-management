import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';

import { AdsRoutingModule } from './ads-routing.module';
import { AdvertisementListComponent } from '../advertisement/advertisement-list/advertisement-list.component';
import { AdvertisementManagementComponent } from '../advertisement/advertisement-management/advertisement-management.component';
import { AdvertisementStatisticsComponent } from '../advertisement/advertisement-statistics/advertisement-statistics.component';
import { AdvertisementFormDialogComponent } from '../advertisement/advertisement-form/advertisement-form-dialog.component';

@NgModule({
  declarations: [
    AdvertisementListComponent,
    AdvertisementManagementComponent,
    AdvertisementStatisticsComponent,
    AdvertisementFormDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdsRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatNativeDateModule
  ],
  exports: [
    AdvertisementListComponent,
    AdvertisementManagementComponent,
    AdvertisementStatisticsComponent,
    AdvertisementFormDialogComponent
  ]
})
export class AdsModule { }
