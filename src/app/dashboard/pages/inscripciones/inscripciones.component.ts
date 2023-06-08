import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { State } from './store/inscripciones.reducer';
import { selectInscripcionesState } from './store/inscripciones.selectors';
import { InscripcionesActions } from './store/inscripciones.actions';
import { InscripcionesService } from './services/inscripciones.service';
import { InscripcionesDialogComponent } from './inscripciones-dialog/inscripciones-dialog.component';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css'],
})
export class InscripcionesComponent implements OnInit, AfterViewInit {
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
    private store: Store,
    private authService: AuthService
  ) {
    this.state$ = this.store.select(selectInscripcionesState);
    this.dataSource = new MatTableDataSource();
    this.sort = new MatSort();
  }

  isAdmin = false;
  
  @ViewChild(MatSort) sort: MatSort;
  
  ngOnInit(): void {
    this.store.dispatch(InscripcionesActions.loadInscripciones());
    this.state$.subscribe((state) => {
      this.dataSource.data = state.inscripciones;

      this.authService.getUserRole().subscribe(role => {
        console.log('User role:', role);
        if (role === 'admin') {
          this.displayedColumns = ['id', 'nombre', 'curso', 'fecha_inscripcion', 'eliminar'];
        } else {
          this.displayedColumns = ['id', 'nombre', 'curso', 'fecha_inscripcion'];
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(ev: Event): void {
    const inputValue = (ev.target as HTMLInputElement).value;
    this.dataSource.filter = inputValue.trim().toLowerCase();
  }

  eliminarInscripcionPorId(id: number): void {
    this.store.dispatch(InscripcionesActions.deleteInscripcion({ id }));
  }

  crearInscripcion(): void {
    this.matDialog.open(InscripcionesDialogComponent);
  }
}
