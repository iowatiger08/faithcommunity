import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordComponent } from './word.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BloggerService } from './blogger.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [WordComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    HttpClientModule
  ],
  exports: [WordComponent],
  providers: [
    BloggerService
  ]
})
export class WordModule { }
