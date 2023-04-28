import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CursosComponent } from './cursos.component';

import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AbmCursosModule } from './abm-cursos/abm-cursos.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CursosComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    AbmCursosModule,
    PipesModule,
    RouterModule.forChild([
      {
        path: '',
        component: CursosComponent
      }
    ])
  ],
  exports: [
    CursosComponent
  ],
  providers: [
    DatePipe
  ]
})
export class CursosModule { }
