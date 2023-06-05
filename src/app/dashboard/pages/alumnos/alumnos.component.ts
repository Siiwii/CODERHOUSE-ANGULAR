import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AbmAlumnosComponent } from './abm-alumnos/abm-alumnos.component';
import { MatDialog } from '@angular/material/dialog';
import { EstudiantesService } from 'src/app/dashboard/pages/alumnos/services/estudiantes.service';
import { DatePipe } from '@angular/common';
import { Estudiante } from './models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css'],
})

export class AlumnosComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource = new MatTableDataSource<Estudiante>();
  displayedColumns: string[] = ['id', 'nombreCompleto', 'fecha_nacimiento', 'opciones'];

  constructor(
    private matDialog: MatDialog,
    private estudiantesService: EstudiantesService,
    private datePipe: DatePipe
  ) {
    this.sort = new MatSort();
  }

  studentsSubscription: Subscription | null = null;

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.studentsSubscription = this.estudiantesService.getStudents().subscribe({
      next: (estudiantes) => {
        this.dataSource.data = estudiantes;
      }
    })
  }

  ngOnDestroy(): void {
    this.studentsSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(ev: Event): void {
    const inputValue = (ev.target as HTMLInputElement).value;
    this.dataSource.filter = inputValue.trim().toLowerCase();
  }

  abrirABMAlumnos(): void {
    const dialog = this.matDialog.open(AbmAlumnosComponent);
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const estudiantes = this.dataSource.data;
        const maxId = estudiantes.reduce((max, estudiante) => Math.max(max, estudiante.id), 0);
        const nuevoAlumno: Estudiante = {
          ...valor,
          id: maxId + 1,
        };
        this.estudiantesService.addStudent(nuevoAlumno).subscribe({
          next: () => {},
          error: (error) => {
            console.error('Error adding alumno:', error);
          }
        });
      }
    });
  }


  editarAlumno(row: Estudiante): void {
    const dialog = this.matDialog.open(AbmAlumnosComponent, {
      data: { alumno: row },
    });
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const estudianteActualizado = {
          ...valor,
          id: row.id,
        };
        this.estudiantesService.updateStudent(estudianteActualizado).subscribe({
          next: () => { },
          error: (error) => {
            console.error('Error updating alumno:', error);
          }
        });
      }
    });
  }

  eliminarAlumno(student: { id: number }): void {
    const id = student.id;
    this.estudiantesService.deleteStudent(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(s => s.id !== id);
      },
      error: (error) => {
        console.error('Error deleting alumno:', error);
      }
    });
  }
}
