import { Component, OnDestroy, OnInit } from '@angular/core';
import { EstudiantesService } from '../../alumnos/services/estudiantes.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Estudiante } from '../../alumnos/models';
import { CursosService } from '../../cursos/services/cursos.service';
import { Curso, CursoWithSubject } from '../../cursos/models';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { InscripcionesActions } from '../store/inscripciones.actions';
import { CreateInscripcionData } from '../models';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-inscripciones-dialog',
  templateUrl: './inscripciones-dialog.component.html',
  styleUrls: ['./inscripciones-dialog.component.css'],
})
export class InscripcionesDialogComponent implements OnInit, OnDestroy {
  alumnos: Estudiante[] = [];
  cursos: CursoWithSubject[] = [];

  selectedCourseControl = new FormControl<Curso | null>(null);

  studentIdControl = new FormControl<number | null>(null, [
    Validators.required,
  ]);
  subjectIdControl = new FormControl<number | null>(null, [
    Validators.required,
  ]);
  courseIdControl = new FormControl<number | null>(null, [Validators.required]);

  incripcionForm = new FormGroup({
    subjectId: this.subjectIdControl,
    studentId: this.studentIdControl,
    courseId: this.courseIdControl,
  });

  destroyed$ = new Subject<void>();

  constructor(
    private alumnosService: EstudiantesService,
    private cursosService: CursosService,
    private dialogRef: DialogRef<InscripcionesDialogComponent>,
    private store: Store,
  ) {
    this.selectedCourseControl.valueChanges
    .pipe(takeUntil(this.destroyed$))
    .subscribe({
      next: (curso) => {
        if (curso) {
          this.subjectIdControl.setValue(curso.subjectId);
          this.courseIdControl.setValue(curso.id);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.cursosService.obtenerCursosWithSubject().subscribe({
      next: (res) => {
        this.cursos = res;
      },
    });
    this.alumnosService.getStudents().subscribe({
      next: (res) => {
        this.alumnos = res;
      },
    });
  }

  onSave(): void {
    const dateInscription = new Date();
    this.store.dispatch(
      InscripcionesActions.createInscripcion({
        data: {
          ...this.incripcionForm.value,
          dateInscription
        } as CreateInscripcionData,
      })
    );
    this.dialogRef.close();
  }
}