import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environments';
import { Curso, CursoWithSubject } from '../models';
import { Subject } from '../../subjects/models';

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

  obtenerSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(
      `${enviroment.apiBaseUrl}/subjects`
    );
  }


  obtenerCursosWithSubject(): Observable<CursoWithSubject[]> {
    return this.http.get<CursoWithSubject[]>(
      `${enviroment.apiBaseUrl}/courses?_expand=subject`
    )
  }


  getCursoById(cursoId: number): Observable<Curso | undefined> {
    return this.cursos$.asObservable()
      .pipe(
        map((cursos) => cursos.find((c) => c.id === cursoId))
      )
  }

  addCourse(addedCourse: Curso): Observable<CursoWithSubject> {
    return this.http.post<Curso>(`${enviroment.apiBaseUrl}/courses`, addedCourse)
      .pipe(
        switchMap((createdCourse) => this.http.get<CursoWithSubject>(`${enviroment.apiBaseUrl}/courses/${createdCourse.id}?_expand=subject`)),
        tap((cursoWithSubject) => {
          const currentCourses = this.cursos$.getValue();
          currentCourses.push(cursoWithSubject);
          this.cursos$.next(currentCourses);
        })
      );
  }


  updateCourse(updatedCourse: Curso): Observable<CursoWithSubject> {

    return this.http.put<Curso>(`${enviroment.apiBaseUrl}/courses/${updatedCourse.id}`, updatedCourse)
      .pipe(
        switchMap(() => this.http.get<CursoWithSubject>(`${enviroment.apiBaseUrl}/courses/${updatedCourse.id}?_expand=subject`)),
        tap((cursoWithSubject) => {
          const currentCourses = this.cursos$.getValue();
          const updatedCourses = currentCourses.map(curso => {
            if (curso.id === cursoWithSubject.id) {
              return cursoWithSubject;
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