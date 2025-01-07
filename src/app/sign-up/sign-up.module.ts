import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SignUpComponent } from './sign-up.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { RolePipe } from './role.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
  ],
  providers: [provideAnimations()],
  declarations: [	SignUpComponent,
      RolePipe
   ],
})
export class SignUpModule {}
