
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {

  usuario;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario = this.authService.obtenerUsuario();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.usuario = null;
    this.router.navigate(['/']);
  }

}
