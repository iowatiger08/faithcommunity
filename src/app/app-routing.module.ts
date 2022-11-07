import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { AboutComponent } from './modules/about/about.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DevotionalComponent } from './modules/devotional/devotional.component';
import { FitnessComponent } from './modules/fitness/fitness.component';
import { MindfulnessComponent } from './modules/mindfulness/mindfulness.component';
import { OutreachComponent } from './modules/outreach/outreach.component';
import { StatementsComponent } from './modules/statements/statements.component';
import { WeddingComponent } from './modules/wedding/wedding.component';

import { WordComponent } from './modules/word/word.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'statements',
        component: StatementsComponent,
      },
      {
        path: 'word',
        component: WordComponent,
      },
      {
        path: 'fitness',
        component: FitnessComponent,
      },
      {
        path: 'devotionals',
        component: DevotionalComponent,
      },
      {
        path: 'mindfulness',
        component: MindfulnessComponent,
      },
      {
        path: 'outreach',
        component: OutreachComponent,
      },
      {
        path: 'wedding',
        component: WeddingComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
