import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth';

@Component({
  selector: 'app-panel-cliente',
  imports: [RouterLink],
  templateUrl: './panel-cliente.html',
  styleUrl: './panel-cliente.css'
})
export class PanelCliente {
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