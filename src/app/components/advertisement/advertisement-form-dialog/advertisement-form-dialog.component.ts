import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Advertisement } from '../../../models/advertisement.model';
import { AdvertisementService } from '../../../services/advertisement.service';

interface DialogData {
  advertisement?: Advertisement;
}

@Component({
  selector: 'app-advertisement-form-dialog',
  templateUrl: './advertisement-form-dialog.component.html',
  styleUrls: ['./advertisement-form-dialog.component.scss']
})
export class AdvertisementFormDialogComponent implements OnInit {
  adForm!: FormGroup;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdvertisementFormDialogComponent>,
    private adService: AdvertisementService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.initializeForm();
    
    if (data?.advertisement) {
      this.isEditing = true;
      this.adForm.patchValue({
        title: data.advertisement.title,
        description: data.advertisement.description,
        imageUrl: data.advertisement.imageUrl,
        linkUrl: data.advertisement.linkUrl,
        type: data.advertisement.type,
        position: data.advertisement.position,
        startDate: new Date(data.advertisement.startDate),
        endDate: new Date(data.advertisement.endDate)
      });
    }
  }

  private initializeForm(): void {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      linkUrl: ['', Validators.required],
      type: ['banner', Validators.required],
      position: ['header', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.adForm.valid) {
      const formData = {
        ...this.adForm.value,
        startDate: this.adForm.value.startDate.toISOString(),
        endDate: this.adForm.value.endDate.toISOString()
      };
      
      if (this.isEditing && this.data.advertisement) {
        this.dialogRef.close({
          ...formData,
          id: this.data.advertisement.id
        });
      } else {
        this.dialogRef.close(formData);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
