import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { State } from './store/inscripciones.reducer';
import { selectInscripcionesState } from './store/inscripciones.selectors';
import { InscripcionesActions } from './store/inscripciones.actions';
import { InscripcionesService } from './services/inscripciones.service';
import { InscripcionesDialogComponent } from './inscripciones-dialog/inscripciones-dialog.component';

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css'],
})
export class InscripcionesComponent implements OnInit {
  state$: Observable<State>;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'id',
    'nombre',
    'curso',
    'fecha_inscripcion',
    'eliminar',
  ];

  constructor(
    private inscripcionesService: InscripcionesService,
    private matDialog: MatDialog,
    private store: Store
  ) {
    this.state$ = this.store.select(selectInscripcionesState);
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.store.dispatch(InscripcionesActions.loadInscripciones());
    this.state$.subscribe((state) => {
      this.dataSource.data = state.inscripciones;
    });
  }

  eliminarInscripcionPorId(id: number): void {
    this.store.dispatch(InscripcionesActions.deleteInscripcion({ id }));
  }

  crearInscripcion(): void {
    this.matDialog.open(InscripcionesDialogComponent);
  }
}
