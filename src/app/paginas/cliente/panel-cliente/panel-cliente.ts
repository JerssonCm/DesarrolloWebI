import { Component,OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth';
import {DatosUsuario} from '../../../servicios/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel-cliente',
  imports: [RouterLink,CommonModule],
  templateUrl: './panel-cliente.html',
  styleUrl: './panel-cliente.css'
})
export class PanelCliente implements OnInit {
  usuario:DatosUsuario | null = null;
  esAdmin: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.usuario.rol?.toUpperCase() === 'ADMIN') {
      this.esAdmin = true;
    }
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.usuario = null;
    this.router.navigate(['/']);
  }
}