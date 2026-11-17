import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, DatosUsuario, UsuarioUpdate } from '../../../servicios/auth';

@Component({
  selector: 'app-panel-cliente',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './panel-cliente.html',
  styleUrl: './panel-cliente.css'
})
export class PanelCliente implements OnInit {
  usuario: DatosUsuario | null = null;
  esAdmin: boolean = false;

  modoEdicion: boolean = false;
  guardando: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  formulario: UsuarioUpdate = {
    idUsuario: 0,
    nombre: '',
    email: '',
    password: ''
  };

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

    this.cargarDatosEnFormulario();
  }

  cargarDatosEnFormulario(): void {
    if (!this.usuario) return;
    this.formulario = {
      idUsuario: this.usuario.idUsuario,
      nombre: this.usuario.nombre,
      email: this.usuario.email,
      password: ''
    };
  }

  activarEdicion(): void {
    this.cargarDatosEnFormulario();
    this.mensajeExito = '';
    this.mensajeError = '';
    this.modoEdicion = true;
  }

  cancelarEdicion(): void {
    this.cargarDatosEnFormulario();
    this.mensajeError = '';
    this.modoEdicion = false;
  }

  guardarCambios(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (!this.formulario.nombre.trim() || !this.formulario.email.trim() || !this.formulario.password.trim()) {
      this.mensajeError = 'Por favor, completa tu nombre, correo y contraseña para confirmar los cambios.';
      return;
    }

    this.guardando = true;
    const id = this.formulario.idUsuario;

    this.authService.actualizarUsuario(id, this.formulario).subscribe({
      next: (respuesta) => {
        this.usuario = this.authService.obtenerUsuario();
        this.guardando = false;
        this.modoEdicion = false;
        this.formulario.password = '';
        this.mensajeExito = respuesta || 'Los datos del usuario se actualizaron correctamente.';
      },
      error: (err) => {
        console.error('Error al actualizar datos:', err);
        this.guardando = false;
        this.mensajeError = err.error || 'No se actualizaron los datos: verifica tu información o si el correo ya está en uso.';
      }
    });
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.usuario = null;
    this.router.navigate(['/']);
  }
}