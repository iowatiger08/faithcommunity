import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordComponent } from './word.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BloggerService } from './blogger.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


@NgModule({ declarations: [WordComponent],
    exports: [WordComponent], imports: [CommonModule,
        MatCardModule,
        MatDividerModule], providers: [
        BloggerService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class WordModule { }
