import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, DatosUsuario } from '../../../servicios/auth';

export interface MiReservaVista {
  idReserva: number;
  idMesa: number;
  fechaReserva: string;
  fecha: string;        
  horario: string;
  estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
}

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css'
})
export class MisReservas implements OnInit {
  usuario: DatosUsuario | null = null;
  filtroEstado: string = 'TODAS';

  reservas: MiReservaVista[] = [
    {
      idReserva: 104,
      idMesa: 5,
      fechaReserva: '2026-11-12',
      fecha: '2026-11-20',
      horario: '19:00 - 21:00',
      estado: 'PENDIENTE'
    },
    {
      idReserva: 101,
      idMesa: 2,
      fechaReserva: '2026-11-10',
      fecha: '2026-11-18',
      horario: '13:00 - 15:00',
      estado: 'PENDIENTE'
    },
    {
      idReserva: 89,
      idMesa: 8,
      fechaReserva: '2026-10-25',
      fecha: '2026-11-01',
      horario: '20:00 - 22:00',
      estado: 'COMPLETADA'
    },
    {
      idReserva: 74,
      idMesa: 3,
      fechaReserva: '2026-10-14',
      fecha: '2026-10-19',
      horario: '14:00 - 16:00',
      estado: 'CANCELADA'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
  }

  get reservasFiltradas(): MiReservaVista[] {
    if (this.filtroEstado === 'TODAS') {
      return this.reservas;
    }
    return this.reservas.filter(r => r.estado === this.filtroEstado);
  }

  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}