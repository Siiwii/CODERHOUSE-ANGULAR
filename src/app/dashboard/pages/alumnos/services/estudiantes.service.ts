import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, tap } from 'rxjs';
import { Estudiante } from '../models';
import { enviroment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  private estudiantes$ = new BehaviorSubject<Estudiante[]>(
    []
  );

  constructor(private http: HttpClient) { }

  get estudiantes(): Observable<Estudiante[]> {
    return this.estudiantes$.asObservable();
  }

  getStudents(): Observable<Estudiante[]> {
    return this.http
      .get<Estudiante[]>(`${enviroment.apiBaseUrl}/students`)
      .pipe(
        tap((estudiantes) => this.estudiantes$.next(estudiantes)),
        mergeMap(() => this.estudiantes$.asObservable())
      )
  }

  getStudentsById(id: number): Observable<Estudiante | undefined> {
    return this.estudiantes$.asObservable()
      .pipe(
        map((alumnos) => alumnos.find((a) => a.id === id))
      )
  }

  addStudent(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${enviroment.apiBaseUrl}/students`, estudiante)
      .pipe(
        tap((addedEstudiante) => {
          const currentStudents = this.estudiantes$.getValue();
          this.estudiantes$.next([...currentStudents, addedEstudiante]);
        })
      );
  }

  updateStudent(updatedEstudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${enviroment.apiBaseUrl}/students/${updatedEstudiante.id}`, updatedEstudiante)
      .pipe(
        tap(() => {
          const currentStudents = this.estudiantes$.getValue();
          const updatedStudents = currentStudents.map(estudiante => {
            if (estudiante.id === updatedEstudiante.id) {
              return updatedEstudiante;
            }
            return estudiante;
          });
          this.estudiantes$.next(updatedStudents);
        })
      );
  }

  deleteStudent(id: number) {
    return this.http.delete(
      `${enviroment.apiBaseUrl}/students/${id}`
    );
  }
}
