import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, DatosUsuario } from '../../../servicios/auth';
import { ReservaService, ReservaVista } from '../../../servicios/reserva';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css'
})
export class PanelAdmin implements OnInit {
  usuarioAdmin: DatosUsuario | null = null;
  pestanaActiva: 'reservas' | 'usuarios' = 'reservas';

  fechaFiltro: string = new Date().toISOString().split('T')[0];

  reservas: ReservaVista[] = [];
  usuarios: DatosUsuario[] = [];

  cargandoReservas: boolean = false;
  cargandoUsuarios: boolean = false;
  mensajeAlerta: string = '';
  esErrorAlerta: boolean = false;

  constructor(
    private authService: AuthService,
    private reservaService: ReservaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioAdmin = this.authService.obtenerUsuario();

    if (!this.usuarioAdmin) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.usuarioAdmin.rol !== 'ADMIN') {
      this.router.navigate(['/cliente']);
      return;
    }

    this.cargarReservasPorFecha();
    this.cargarUsuarios();
  }

  cambiarPestana(pestana: 'reservas' | 'usuarios'): void {
    this.pestanaActiva = pestana;
    this.mensajeAlerta = '';
  }

  cargarReservasPorFecha(): void {
    if (!this.fechaFiltro) return;

    this.cargandoReservas = true;
    this.reservaService.obtenerReservasPorFecha(this.fechaFiltro).subscribe({
      next: (data) => {
        this.reservas = data;
        this.cargandoReservas = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas por fecha:', err);
        this.reservas = [];
        this.cargandoReservas = false;
      }
    });
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.authService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargandoUsuarios = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.cargandoUsuarios = false;
      }
    });
  }

  cancelarReserva(reserva: ReservaVista): void {
    const idReserva = reserva.idReserva;
    const idUsuario = reserva.usuario?.idUsuario || this.usuarioAdmin?.idUsuario || 0;

    if (!confirm(`¿Seguro que deseas cambiar el estado de la reserva #${idReserva} a CANCELADA?`)) {
      return;
    }

    this.reservaService.cancelarReserva({ idUsuario, idReserva }).subscribe({
      next: (respuesta) => {
        reserva.estado = 'CANCELADA';
        this.esErrorAlerta = false;
        this.mensajeAlerta = respuesta || `La reserva #${idReserva} se canceló correctamente.`;
      },
      error: (err) => {
        console.error('Error al cancelar la reserva:', err);
        this.esErrorAlerta = true;
        this.mensajeAlerta = err.error || 'Error al cancelar la reserva.';
      }
    });
  }

  completarReserva(reserva: ReservaVista): void {
    const idReserva = reserva.idReserva;
    const idUsuario = reserva.usuario?.idUsuario || this.usuarioAdmin?.idUsuario || 0;

    if (!confirm(`¿Seguro que deseas marcar la reserva #${idReserva} como COMPLETADA?`)) {
      return;
    }

    this.reservaService.completarReserva({ idUsuario, idReserva }).subscribe({
      next: (respuesta) => {
        reserva.estado = 'COMPLETADA';
        this.esErrorAlerta = false;
        this.mensajeAlerta = respuesta || `La reserva #${idReserva} se completó correctamente.`;
      },
      error: (err) => {
        console.error('Error al completar la reserva:', err);
        this.esErrorAlerta = true;
        this.mensajeAlerta = err.error || 'Error al completar la reserva.';
      }
    });
  }

  obtenerTextoHorario(horarioTurno: any): string {
    if (!horarioTurno) return '-';
    return (
      horarioTurno.horario ||
      horarioTurno.turno ||
      (horarioTurno.horaInicio && horarioTurno.horaFin
        ? `${horarioTurno.horaInicio} - ${horarioTurno.horaFin}`
        : `Turno #${horarioTurno.idHorarioTurno || horarioTurno.id || ''}`)
    );
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}