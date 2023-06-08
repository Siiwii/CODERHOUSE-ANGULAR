import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AbmCursosComponent } from './abm-cursos/abm-cursos.component';
import { MatDialog } from '@angular/material/dialog';
import { CursosService } from 'src/app/dashboard/pages/cursos/services/cursos.service';
import { Curso, CursoWithSubject } from './models';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
})

export class CursosComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource = new MatTableDataSource<Curso>();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'fecha_inicio',
    'fecha_fin',
    'opciones'
  ];

  cursosWithSubjectSuscription: Subscription | null = null;

  constructor(
    private matDialog: MatDialog,
    private cursosService: CursosService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
    this.sort = new MatSort();
  }


  ngOnInit(): void {
    this.subscribeToCursosWithSubject();
  }
  
  isAdmin = false;
  
  private subscribeToCursosWithSubject(): void {
    this.cursosWithSubjectSuscription = this.cursosService.obtenerCursosWithSubject().subscribe({
      next: (cursos) => {
        this.dataSource.data = cursos;
        
        this.authService.getUserRole().subscribe(role => {
          console.log('User role:', role);
          this.isAdmin = role === 'admin';
          if (this.isAdmin) {
            this.displayedColumns = ['id', 'nombre', 'fecha_inicio', 'fecha_fin', 'opciones'];
          } else {
            this.displayedColumns = ['id', 'nombre', 'fecha_inicio', 'fecha_fin'];
          }
        });
      }
    })
  }
  
  
  ngOnDestroy(): void {
    this.cursosWithSubjectSuscription?.unsubscribe();
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(ev: Event): void {
    const inputValue = (ev.target as HTMLInputElement).value;
    this.dataSource.filter = inputValue.trim().toLowerCase();
  }


  abrirABMCursos(): void {
    const dialog = this.matDialog.open(AbmCursosComponent);
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const cursos = this.dataSource.data;
        const maxId = Math.max(...cursos.map(c => c.id));
        const nuevoCurso: Curso = {
          id: maxId + 1,
          subjectId: valor.subjectName,
          fecha_inicio: valor.fecha_inicio,
          fecha_fin: valor.fecha_fin,
        };
        this.cursosService.addCourse(nuevoCurso).subscribe({
          next: (createdCourse) => {
            cursos.push(createdCourse);
            this.dataSource.data = cursos;
          },
          error: (error) => {
            console.error('Error creating curso:', error);
          }
        });
      }
    });
  }




  editarCurso(row: CursoWithSubject): void {
    const dialog = this.matDialog.open(AbmCursosComponent, {
      data: { cursoWithSubject: row },
    });
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const cursoActualizado: Curso = {
          id: row.id,
          subjectId: valor.subjectName,
          fecha_inicio: valor.fecha_inicio,
          fecha_fin: valor.fecha_fin,
        };
        this.cursosService.updateCourse(cursoActualizado).subscribe({
          next: (updatedCourse) => {
            const cursos = this.dataSource.data;
            const cursoIndex = cursos.findIndex(c => c.id === updatedCourse.id);
            cursos[cursoIndex] = updatedCourse;
            this.dataSource.data = cursos;
          },
          error: (error) => {
            console.error('Error updating alumno:', error);
          }
        });
      }
    });
  }


  eliminarCurso(id: number): void {
    this.cursosService.deleteCourse(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(c => c.id !== id);
      },
      error: (error) => {
        console.error('Error deleting curso:', error);
      }
    });
  }
}
