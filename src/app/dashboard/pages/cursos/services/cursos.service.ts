import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environments';
import { Curso, CursoWithSubject } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private cursos$ = new BehaviorSubject<Curso[]>(
    []
  );

  constructor(
    private http: HttpClient
  ) { }

  get cursos(): Observable<Curso[]> {
    return this.cursos$.asObservable();
  }

  obtenerCursos(): Observable<Curso[]> {
    return this.http
      .get<Curso[]>(`${enviroment.apiBaseUrl}/courses?_expand=subject`)
      .pipe(
        tap((cursos) => this.cursos$.next(cursos)),
        mergeMap(() => this.cursos$.asObservable())
      );
  }

  obtenerCursosWithSubject(): Observable<CursoWithSubject[]> {
    return this.http.get<CursoWithSubject[]>(
      `${enviroment.apiBaseUrl}/courses?_expand=subject`
    ).pipe(
      tap((cursos) => {
        console.log('Cursos with subject:', cursos);
        cursos.forEach(curso => {
          console.log('Curso subject:', curso.subject);
        });
      })
    );
  }
  

  getCursoById(cursoId: number): Observable<Curso | undefined> {
    return this.cursos$.asObservable()
      .pipe(
        map((cursos) => cursos.find((c) => c.id === cursoId))
      )
  }

  addCourse(course: Curso) {
    console.log('Adding course:', course);
    const currentCourses = this.cursos$.getValue();
    this.cursos$.next([...currentCourses, course]);
  }
  
  updateCourse(updatedCourse: Curso): Observable<Curso> {
    console.log('Updating course:', updatedCourse);
    return this.http.put<Curso>(`${enviroment.apiBaseUrl}/courses/${updatedCourse.id}`, updatedCourse)
      .pipe(
        tap(() => {
          const currentCourses = this.cursos$.getValue();
          const updatedCourses = currentCourses.map(curso => {
            if (curso.id === updatedCourse.id) {
              return updatedCourse;
            }
            return curso;
          });
          this.cursos$.next(updatedCourses);
        })
      );
  }
  
  deleteCourse(id: number) {
    return this.http.delete(
      `${enviroment.apiBaseUrl}/courses/${id}`
    );
  }
}