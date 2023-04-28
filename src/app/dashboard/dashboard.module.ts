import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TablesModule } from './pages/tables/tables.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TablesModule,
    MatListModule,
    RouterModule.forChild([
      {
        path: 'estudiantes',
        loadChildren: () => import('./pages/tables/tables.module').then((m) => m.TablesModule)
      },
      {
        path: 'cursos',
        loadChildren: () => import('./pages/cursos/cursos.module').then((m) => m.CursosModule),
      }
    ])
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
