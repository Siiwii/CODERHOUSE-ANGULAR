import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Curso, CursoWithSubject } from '../models';
import { CursosService } from '../services/cursos.service';
import { Subject } from '../../subjects/models';

@Component({
  selector: 'app-abm-cursos',
  templateUrl: './abm-cursos.component.html',
  styleUrls: ['./abm-cursos.component.css']
})
export class AbmCursosComponent {

  subjects: Subject[] = [];
  
  nombreControl = new FormControl('', [Validators.required]);
  fechaInicioControl = new FormControl('', [Validators.required]);
  fechaFinControl = new FormControl('', [Validators.required]);

  cursoForm = new FormGroup({
    subjectName: this.nombreControl,
    fecha_inicio: this.fechaInicioControl,
    fecha_fin: this.fechaFinControl,
  });

  constructor(
    private dialogRef: MatDialogRef<AbmCursosComponent>,
    private cursosService: CursosService,
    @Inject(MAT_DIALOG_DATA) private data: { cursoWithSubject: CursoWithSubject },
  ) {
    if (data && data.cursoWithSubject) {
      const cursoParaEditar = data.cursoWithSubject;
      const subjectName = cursoParaEditar.subject.nombre;
      this.nombreControl.setValue(subjectName);
      this.fechaInicioControl.setValue(new Date(cursoParaEditar.fecha_inicio).toISOString());
      this.fechaFinControl.setValue(new Date(cursoParaEditar.fecha_fin).toISOString());
    }
  }

  ngOnInit() {
    this.getSubjects();
  }

  getSubjects() {
    this.cursosService.obtenerSubjects().subscribe(subjects => {
    this.subjects = subjects;
    });
   }
   

  guardar(): void {
    if (this.cursoForm.valid) {
      this.dialogRef.close(this.cursoForm.value)
    } else {
      this.cursoForm.markAllAsTouched();
    }
  }
}