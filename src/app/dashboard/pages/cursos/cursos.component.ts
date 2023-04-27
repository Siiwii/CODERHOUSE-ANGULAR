import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AbmCursosComponent } from './abm-cursos/abm-cursos.component';
import { MatDialog } from '@angular/material/dialog';
import { CursosService } from 'src/app/dashboard/pages/cursos/services/cursos.service';
import { Curso } from './models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
})
export class CursosComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<Curso>();
  displayedColumns: string[] = ['id', 'nombre', 'fecha_inicio', 'fecha_fin', 'opciones'];

  constructor(
    private matDialog: MatDialog,
    private cursosService: CursosService,
    private datePipe: DatePipe
  ) {
    this.sort = new MatSort();

    this.cursosService.getCursos().subscribe((cursos) => {
      this.dataSource.data = cursos.map((curso: Curso) => {
        const course: Curso = {
          ...curso,
        }
        return course;
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

  abrirABMCursos(): void {
    const dialog = this.matDialog.open(AbmCursosComponent);
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const cursos = this.dataSource.data;
        const nuevoCurso: Curso = {
          ...valor,
          id: cursos.length +1,
        };
        this.cursosService.addCourse(nuevoCurso);
      }
    });
  }

  editarCurso(row: Curso): void {
    const dialog = this.matDialog.open(AbmCursosComponent, {
      data: { alumno: row },
    });
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const cursoActualizado = {
          ...valor,
          fecha_nacimiento: this.datePipe.transform(valor.fecha_nacimiento, 'dd/MM/yyyy'),
          id: row.id,
        };
        this.cursosService.updateCourse(cursoActualizado);
      }
    });
  }

  eliminarCurso(id: number): void {
    this.cursosService.deleteCourse(id);
  }
}
