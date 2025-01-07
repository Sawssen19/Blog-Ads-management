import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogRoutingModule } from './blog-routing.module';

@NgModule({
  imports: [
    RouterModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
