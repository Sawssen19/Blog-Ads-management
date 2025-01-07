import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Blog } from '../../../models/blog.model';

@Component({
  selector: 'app-blog-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <ng-container *ngIf="data">Modifier l'article</ng-container>
      <ng-container *ngIf="!data">Nouvel article</ng-container>
    </h2>
    <form [formGroup]="blogForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" placeholder="Titre de l'article">
          <mat-error *ngIf="blogForm.get('title')?.hasError('required')">
            Le titre est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="content" rows="4" 
                    placeholder="Contenu de l'article"></textarea>
          <mat-error *ngIf="blogForm.get('content')?.hasError('required')">
            Le contenu est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="imageUrl" 
                 placeholder="URL de l'image de couverture">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tags</mat-label>
          <input matInput formControlName="tags" 
                 placeholder="Tags séparés par des virgules">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" 
                [disabled]="blogForm.invalid">
          {{ data ? 'Mettre à jour' : 'Créer' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    textarea {
      min-height: 100px;
    }

    .dialog-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 16px;
    }
  `]
})
export class BlogFormDialogComponent {
  blogForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BlogFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Blog | null
  ) {
    this.blogForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      content: [data?.content || '', Validators.required],
      imageUrl: [data?.imageUrl || ''],
      tags: [data?.tags?.join(', ') || '']
    });
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      const formValue = this.blogForm.value;
      const blog: Partial<Blog> = {
        ...this.data,
        title: formValue.title,
        content: formValue.content,
        imageUrl: formValue.imageUrl,
        tags: formValue.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      };

      this.dialogRef.close(blog);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
