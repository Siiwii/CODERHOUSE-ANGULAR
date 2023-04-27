import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date;
  curso: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private estudiantes$ = new BehaviorSubject<Estudiante[]>([
    { id: 1, nombre: 'Juan', apellido: 'Sosa', fecha_nacimiento: new Date('2000-05-30'), curso: ['Frontend', 'Marketing'] },
    { id: 2, nombre: 'Sofía', apellido: 'García', fecha_nacimiento: new Date('1998-04-02'), curso: ['Backend', 'Databases'] },
    { id: 3, nombre: 'Luis', apellido: 'Martínez', fecha_nacimiento: new Date('1987-12-15'), curso: ['Marketing'] },
    { id: 4, nombre: 'Ana', apellido: 'González', fecha_nacimiento: new Date('1994-08-07'), curso: ['Databases'] },
    { id: 5, nombre: 'Diego', apellido: 'Rodríguez', fecha_nacimiento: new Date('1991-11-22'), curso: ['Marketing', 'Frontend'] },
    { id: 6, nombre: 'Carla', apellido: 'Fernández', fecha_nacimiento: new Date('1998-06-18'), curso: ['Frontend', 'Backend'] },
    { id: 7, nombre: 'Mateo', apellido: 'Hernández', fecha_nacimiento: new Date('1993-09-03'), curso: ['Frontend'] },
    { id: 8, nombre: 'Valentina', apellido: 'López', fecha_nacimiento: new Date('1990-03-14'), curso: ['Backend', 'Databases'] },
  ]);

  constructor() { }

  getStudents() {
    return this.estudiantes$.asObservable();
  }

  getStudentsById(id:number): Observable<Estudiante | undefined>{
    return this.estudiantes$.asObservable()
    .pipe(
      map((alumnos) => alumnos.find((a) => a.id === id ))
    )
  }

  addStudent(estudiante: Estudiante) {
    const currentStudents = this.estudiantes$.getValue();
    this.estudiantes$.next([...currentStudents, estudiante]);
  }

  updateStudent(updatedEstudiante: Estudiante) {
    const currentStudents = this.estudiantes$.getValue();
    const updatedStudents = currentStudents.map(estudiante => {
      if (estudiante.id === updatedEstudiante.id) {
        return updatedEstudiante;
      }
      return estudiante;
    });
    this.estudiantes$.next(updatedStudents);
  }

  deleteStudent(id: number) {
    const currentStudents = this.estudiantes$.getValue();
    const updatedStudents = currentStudents.filter(estudiante => estudiante.id !== id);
    this.estudiantes$.next(updatedStudents);
  }
}
