import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { StatementsComponent } from 'src/app/modules/statements/statements.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FitnessComponent } from 'src/app/modules/fitness/fitness.component';
import { MindfulnessComponent } from 'src/app/modules/mindfulness/mindfulness.component';
import { OutreachComponent } from 'src/app/modules/outreach/outreach.component';
import { WeddingComponent } from 'src/app/modules/wedding/wedding.component';
import { DevotionalComponent } from 'src/app/modules/devotional/devotional.component';
import { AboutComponent } from 'src/app/modules/about/about.component';
import { WordModule } from 'src/app/modules/word/word.module';


@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    StatementsComponent,

    FitnessComponent,
    MindfulnessComponent,
    OutreachComponent,
    WeddingComponent,
    DevotionalComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    MatTableModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    WordModule
  ]
})
export class DefaultModule { }
