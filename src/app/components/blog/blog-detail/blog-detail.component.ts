import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Blog } from '../../../models/blog.model';
import { Comment } from '../../../models/comment.model';
import { BlogService } from '../../../services/blog.service';
import { BlogFormDialogComponent } from '../blog-form-dialog/blog-form-dialog.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    BlogFormDialogComponent
  ],
  template: `
    <div class="blog-detail-container" *ngIf="blog">
      <div class="blog-header">
        <div class="header-content">
          <h1>{{ blog.title }}</h1>
          <div class="meta">
            <div class="author">
              <img [src]="blog.authorAvatar || 'assets/images/default-avatar.svg'" 
                   [alt]="blog.author"
                   (error)="handleAvatarError($event)">
              <span>{{ blog.author }}</span>
            </div>
            <span class="date">{{ blog.createdAt | date:'dd MMM yyyy' }}</span>
          </div>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="editBlog()">
              <mat-icon>edit</mat-icon>
              <span>Modifier</span>
            </button>
            <button mat-raised-button color="warn" (click)="deleteBlog()">
              <mat-icon>delete</mat-icon>
              <span>Supprimer</span>
            </button>
          </div>
        </div>
        <div class="header-image" *ngIf="blog.imageUrl">
          <img [src]="blog.imageUrl" [alt]="blog.title" (error)="handleImageError($event)">
        </div>
      </div>

      <div class="blog-content">
        <div class="content-wrapper">
          <div class="article-content">
            {{ blog.content }}
          </div>

          <div class="tags" *ngIf="blog.tags?.length">
            <span class="tag" *ngFor="let tag of blog.tags">#{{ tag }}</span>
          </div>

          <div class="stats">
            <button mat-icon-button>
              <mat-icon>visibility</mat-icon>
              <span>{{ blog.views }}</span>
            </button>
            <button mat-icon-button>
              <mat-icon>chat_bubble_outline</mat-icon>
              <span>{{ blog.comments?.length || 0 }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="comments-section">
        <h2>Commentaires ({{ blog.comments?.length || 0 }})</h2>
        
        <div class="comment-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Ajouter un commentaire</mat-label>
            <textarea matInput
                      [(ngModel)]="newComment"
                      placeholder="Votre commentaire..."
                      rows="3"></textarea>
            <button mat-icon-button matSuffix (click)="addComment()"
                    [disabled]="!newComment?.trim()">
              <mat-icon>send</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <div class="comments-list">
          <mat-card *ngFor="let comment of blog.comments" class="comment-card">
            <mat-card-header>
              <img mat-card-avatar
                   [src]="comment.authorAvatar || 'assets/images/default-avatar.svg'"
                   [alt]="comment.author"
                   (error)="handleAvatarError($event)">
              <mat-card-title>{{ comment.author }}</mat-card-title>
              <mat-card-subtitle>
                {{ comment.createdAt | date:'dd MMM yyyy' }}
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <p *ngIf="editingCommentId !== comment.id">{{ comment.content }}</p>
              <mat-form-field *ngIf="editingCommentId === comment.id" class="full-width">
                <textarea matInput [(ngModel)]="editingCommentContent" rows="3"></textarea>
              </mat-form-field>
            </mat-card-content>

            <mat-card-actions align="end">
              <div *ngIf="editingCommentId === comment.id">
                <button mat-raised-button color="primary" (click)="submitEdit(comment)"
                        [disabled]="!editingCommentContent?.trim()">
                  Enregistrer
                </button>
                <button mat-button (click)="cancelEdit()">Annuler</button>
              </div>
              <div *ngIf="editingCommentId !== comment.id">
                <button mat-icon-button (click)="startEditing(comment)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteComment(comment)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blog-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .blog-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    h1 {
      font-size: 2.5rem;
      margin: 0;
      color: #333;
    }

    .meta {
      display: flex;
      align-items: center;
      gap: 16px;
      color: #666;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .author img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .header-image {
      margin-top: 24px;
      border-radius: 8px;
      overflow: hidden;
      max-height: 400px;
    }

    .header-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .blog-content {
      margin: 32px 0;
    }

    .article-content {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #333;
      white-space: pre-wrap;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 24px 0;
    }

    .tag {
      padding: 4px 12px;
      background: #f0f0f0;
      border-radius: 16px;
      color: #666;
      font-size: 0.9rem;
    }

    .stats {
      display: flex;
      gap: 16px;
      color: #666;
    }

    .stats button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .comments-section {
      margin-top: 48px;
    }

    .comment-form {
      margin: 24px 0;
    }

    .comment-card {
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    button {
      mat-icon {
        margin-right: 4px;
      }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  newComment = '';
  editingCommentId: string | null = null;
  editingCommentContent = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadBlog(id);
      }
    });
  }

  loadBlog(id: string): void {
    this.blogService.getBlogById(id).subscribe({
      next: (blog) => {
        if (blog) {
          this.blog = blog;
        } else {
          this.router.navigate(['/blogs']);
          this.snackBar.open('Article non trouvé', 'Fermer', {
            duration: 3000
          });
        }
      },
      error: (error: Error) => {
        console.error('Error loading blog:', error);
        this.snackBar.open('Erreur lors du chargement de l\'article', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/blogs']);
      }
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/default-blog.jpg';
  }

  handleAvatarError(event: any) {
    event.target.src = 'assets/images/default-avatar.svg';
  }

  editBlog() {
    if (!this.blog) return;

    const dialogRef = this.dialog.open(BlogFormDialogComponent, {
      width: '600px',
      data: this.blog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.blogService.updateBlog(result).subscribe({
          next: (updatedBlog) => {
            this.blog = updatedBlog;
            this.snackBar.open('Article mis à jour avec succès', 'Fermer', {
              duration: 3000
            });
          },
          error: (error) => {
            console.error('Error updating blog:', error);
            this.snackBar.open('Erreur lors de la mise à jour de l\'article', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  deleteBlog() {
    if (!this.blog?.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.blogService.deleteBlog(this.blog.id).subscribe({
        next: () => {
          this.snackBar.open('Article supprimé avec succès', 'Fermer', {
            duration: 3000
          });
          this.router.navigate(['/blogs']);
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
          this.snackBar.open('Erreur lors de la suppression de l\'article', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  addComment(): void {
    if (!this.blog || !this.newComment.trim()) return;

    const comment: Partial<Comment> = {
      content: this.newComment.trim(),
      author: 'Utilisateur actuel',
      createdAt: new Date().toISOString()
    };

    this.blogService.addComment(this.blog.id, comment).subscribe({
      next: (updatedBlog) => {
        this.blog = updatedBlog;
        this.newComment = '';
        this.snackBar.open('Commentaire ajouté avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error: Error) => {
        console.error('Error adding comment:', error);
        this.snackBar.open('Erreur lors de l\'ajout du commentaire', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  startEditing(comment: Comment) {
    this.editingCommentId = comment.id;
    this.editingCommentContent = comment.content;
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editingCommentContent = '';
  }

  submitEdit(comment: Comment): void {
    if (!this.blog || !this.editingCommentContent.trim()) return;

    this.blogService.updateComment(
      this.blog.id,
      comment.id,
      this.editingCommentContent.trim()
    ).subscribe({
      next: (updatedBlog) => {
        this.blog = updatedBlog;
        this.editingCommentId = null;
        this.editingCommentContent = '';
        this.snackBar.open('Commentaire mis à jour avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error: Error) => {
        console.error('Error updating comment:', error);
        this.snackBar.open('Erreur lors de la mise à jour du commentaire', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  deleteComment(comment: Comment): void {
    if (!this.blog) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.blogService.deleteComment(this.blog.id, comment.id).subscribe({
        next: (updatedBlog) => {
          this.blog = updatedBlog;
          this.snackBar.open('Commentaire supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error: Error) => {
          console.error('Error deleting comment:', error);
          this.snackBar.open('Erreur lors de la suppression du commentaire', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
}
