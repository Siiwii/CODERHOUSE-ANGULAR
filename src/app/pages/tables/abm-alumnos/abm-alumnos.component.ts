import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-abm-alumnos',
  templateUrl: './abm-alumnos.component.html',
  styleUrls: ['./abm-alumnos.component.css']
})

export class AbmAlumnosComponent {

  alumnosForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    curso: new FormControl('', [Validators.required]),
  })

  cursos: string[] = ['Frontend', 'Backend', 'Databases', 'Marketing']
  
  constructor(private dialogRef: MatDialogRef<AbmAlumnosComponent>) {}

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