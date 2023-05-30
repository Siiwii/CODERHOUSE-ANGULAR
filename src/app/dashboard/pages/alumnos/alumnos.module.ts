import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AlumnosComponent } from './alumnos.component';

import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AbmAlumnosModule } from './abm-alumnos/abm-alumnos.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AlumnosComponent,
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
    AbmAlumnosModule,
    PipesModule,
    RouterModule.forChild([
      {
        path: '',
        component: AlumnosComponent
      },
    ])
  ],
  exports: [
    AlumnosComponent
  ],
  providers: [
    DatePipe
  ]
})
export class AlumnosModule { }
