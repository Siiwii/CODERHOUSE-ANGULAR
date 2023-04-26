import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AbmAlumnosComponent } from './abm-alumnos/abm-alumnos.component';
import { MatDialog } from '@angular/material/dialog';
import { EstudiantesService, Estudiante } from 'src/app/services/estudiantes.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
})
export class TablesComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<Estudiante>();
  displayedColumns: string[] = ['id', 'nombreCompleto', 'fecha_nacimiento', 'curso', 'opciones'];

  constructor(
    private matDialog: MatDialog,
    private estudiantesService: EstudiantesService,
    private datePipe: DatePipe
  ) {
    this.sort = new MatSort();

    this.estudiantesService.getStudents().subscribe((estudiantes) => {
      this.dataSource.data = estudiantes.map((estudiante: Estudiante) => {
        const alumno: Estudiante = {
          ...estudiante,
        }
        return alumno;
      });
    });
  }

  @ViewChild(MatSort) sort: MatSort;

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
        const nuevoAlumno: Estudiante = {
          ...valor,
          id: estudiantes.length +1,
        };
        this.estudiantesService.addStudent(nuevoAlumno);
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
          fecha_nacimiento: this.datePipe.transform(valor.fecha_nacimiento, 'MM/dd/yyyy'),
          id: row.id,
        };
        this.estudiantesService.updateStudent(estudianteActualizado);
      }
    });
  }

  eliminarAlumno(id: number): void {
    this.estudiantesService.deleteStudent(id);
  }
}
