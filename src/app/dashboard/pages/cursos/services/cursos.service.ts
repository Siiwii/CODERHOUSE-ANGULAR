import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, take, tap } from 'rxjs';
import { Curso } from '../models';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environments';

const CURSOS_MOCKS: Curso[] = [
  {
    id: 1,
    nombre: 'Frontend',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
  },
  {
    id: 2,
    nombre: 'Marketing',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
  },
  {
    id: 3,
    nombre: 'Backend',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
  },
  {
    id: 4,
    nombre: 'Databases',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private cursos$ = new BehaviorSubject<Curso[]>(
    []
  );

  constructor(
    private httpClient: HttpClient
  ) {}

  get cursos(): Observable<Curso[]> {
    return this.cursos$.asObservable();
  }

  obtenerCursos(): Observable<Curso[]> {
    return this.httpClient.get<Curso[]>(`${enviroment.apiBaseUrl}/cursos`)
      .pipe(
        tap((cursos) => this.cursos$.next(cursos)),
        mergeMap(() => this.cursos$.asObservable())
      );
  }

  getCursoById(cursoId: number): Observable<Curso | undefined> {
    return this.cursos$.asObservable()
      .pipe(
        map((cursos) => cursos.find((c) => c.id === cursoId))
      )
  }

  addCourse(course: Curso) {
    const currentCourses = this.cursos$.getValue();
    this.cursos$.next([...currentCourses, course]);
  }

  updateCourse(updatedCourse: Curso) {
    const currentCourses = this.cursos$.getValue();
    const updatedCourses = currentCourses.map(curso => {
      if (curso.id === updatedCourse.id) {
        return updatedCourse;
      }
      return curso;
    });
    this.cursos$.next(updatedCourses);
  }

  deleteCourse(id: number) {
    const currentCourses = this.cursos$.getValue();
    const updatedCourses = currentCourses.filter(curso => curso.id !== id);
    this.cursos$.next(updatedCourses);
  }
}