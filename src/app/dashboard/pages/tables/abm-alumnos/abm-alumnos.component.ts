import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-abm-alumnos',
  templateUrl: './abm-alumnos.component.html',
  styleUrls: ['./abm-alumnos.component.css']
})

export class AbmAlumnosComponent implements OnInit{

  alumnosForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    curso: new FormControl('', [Validators.required]),
  })

  alumno: any;

  cursos: string[] = ['Frontend', 'Backend', 'Databases', 'Marketing']

  constructor(
    private dialogRef: MatDialogRef<AbmAlumnosComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }


  ngOnInit(): void {
    if (this.data) {
      this.alumno = this.data.alumno;
      this.alumnosForm.patchValue({
        nombre: this.alumno.nombre,
        apellido: this.alumno.apellido,
        fecha_nacimiento: this.alumno.fecha_nacimiento,
        curso: this.alumno.curso
      });
    }
  }

  guardar(): void {
    if (this.alumnosForm.valid) {
      const nuevoAlumno = {
        nombre: this.alumnosForm.get('nombre')?.value,
        apellido: this.alumnosForm.get('apellido')?.value,
        fecha_nacimiento: this.alumnosForm.get('fecha_nacimiento')?.value,
        curso: this.alumnosForm.get('curso')?.value
      };
      this.dialogRef.close(nuevoAlumno);
    } else {
      this.alumnosForm.markAllAsTouched();
    }
  }

}