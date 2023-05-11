import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { Usuario } from '../core/models';
import { AuthService } from '../auth/services/auth.service';
import links from './nav-items';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnDestroy {
  showFiller = false;

  authUser$: Observable<Usuario | null>

  destroyed$ = new Subject<void>();

  links = links;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authUser$ = this.authService.obtenerUsuarioAutenticado();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  logout(): void {
    this.authService.logout();
  }
}
