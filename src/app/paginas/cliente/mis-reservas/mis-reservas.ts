import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, DatosUsuario } from '../../../servicios/auth';
import { MiReservaVista,ReservaService } from '../../../servicios/reserva';
import { Observable } from 'rxjs';

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
  esAdmin: boolean = false;

  reservas$!: Observable<MiReservaVista[]>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    this.reservas$ = this.reservaService.verMisReservas();
    if(this.usuario?.rol?.toUpperCase() === 'ADMIN'){
      this.esAdmin = true;
    }

  }


  filtrarReservas(reservas: MiReservaVista[]): MiReservaVista[] {
    if (this.filtroEstado === 'TODAS') {
      return reservas;
    }
    return reservas.filter(r => r.estado === this.filtroEstado);
  }

  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}