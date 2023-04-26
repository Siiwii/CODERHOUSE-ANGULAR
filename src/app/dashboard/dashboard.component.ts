import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../core/models';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  showFiller = false;

  authUser$: Observable<Usuario>
  
  constructor(
    private authService: AuthService,
  ) {
    const user: Usuario = { usuario: 'Juan', nombre: 'Juan Sosa', id: 11 };
    this.authUser$ = of(user);
    // this.authUser$ = this.authService.obtenerUsuarioAutenticado()
  }
}
