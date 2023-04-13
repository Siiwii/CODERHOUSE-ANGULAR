import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AbmAlumnosComponent } from './abm-alumnos/abm-alumnos.component';
import { MatDialog } from '@angular/material/dialog';


export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  curso: string[];
}

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
})

export class TablesComponent implements AfterViewInit {

  estudiantes: Estudiante[] = [
    { id: 1, nombre: 'Juan', apellido: 'Sosa', fecha_nacimiento: '30/5/2000', curso: ['Frontend', 'Marketing'] },
    { id: 2, nombre: 'Sofía', apellido: 'García', fecha_nacimiento: '02/04/1998', curso: ['Backend', 'Databases'] },
    { id: 3, nombre: 'Luis', apellido: 'Martínez', fecha_nacimiento: '15/12/1987', curso: ['Marketing'] },
    { id: 4, nombre: 'Ana', apellido: 'González', fecha_nacimiento: '07/08/1994', curso: ['Databases'] },
    { id: 5, nombre: 'Diego', apellido: 'Rodríguez', fecha_nacimiento: '22/11/1991', curso: ['Marketing', 'Frontend'] },
    { id: 6, nombre: 'Carla', apellido: 'Fernández', fecha_nacimiento: '18/06/1998', curso: ['Frontend', 'Backend'] },
    { id: 7, nombre: 'Mateo', apellido: 'Hernández', fecha_nacimiento: '03/09/1993', curso: ['Frontend'] },
    { id: 8, nombre: 'Valentina', apellido: 'López', fecha_nacimiento: '14/03/1990', curso: ['Backend', 'Databases'] },
  ];

  dataSource = new MatTableDataSource(this.estudiantes);
  displayedColumns: string[] = ['id', 'nombreCompleto', 'fecha_nacimiento', 'curso', 'opciones'];

  constructor(private matDialog: MatDialog) {
    this.sort = new MatSort();
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
    const dialog = this.matDialog.open(AbmAlumnosComponent)
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const nuevoAlumno = {
          ...valor,
          fecha_nacimiento: new Date(valor.fecha_nacimiento).toLocaleDateString('es-AR')
        };
        this.dataSource.data = [
          ...this.dataSource.data,
          {
            ...nuevoAlumno,
            id: this.dataSource.data.length + 1
          }
        ]
      }
    })
  }

  editarAlumno(row: Estudiante): void {
    const dialog = this.matDialog.open(AbmAlumnosComponent, {
      data: { alumno: row }
    });
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        const indice = this.dataSource.data.findIndex((est) => est.id === row.id);
        if (indice >= 0) {
          const nuevoAlumno = { ...valor, fecha_nacimiento: new Date(valor.fecha_nacimiento).toLocaleDateString('es-AR') };
          this.dataSource.data[indice] = {
            ...nuevoAlumno,
            id: row.id
          };
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }


  eliminarAlumno(row: Estudiante): void {
    const indice = this.dataSource.data.findIndex((est) => est.id === row.id);
    if (indice >= 0) {
      this.dataSource.data.splice(indice, 1);
      this.dataSource._updateChangeSubscription();
    }
  }



}