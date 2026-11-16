
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { ReservaService } from '../../../servicios/reserva';
import { AuthService } from '../../../servicios/auth';

@Component({
  selector: 'app-nueva-reserva',
  imports: [RouterLink],
  templateUrl: './nueva-reserva.html',
  styleUrl: './nueva-reserva.css'
})
export class NuevaReserva implements OnInit {

  horarios: any[] = [];

  fecha: string = '';
  turnoId: number | null = null;
  numeroPersonas: number | null = null;

  mesas: any[] = [];
  mesasFiltradas: any[] = [];

  mesaSeleccionada: number | null = null;
  consultaRealizada: boolean = false;

  constructor(
    private reservaService: ReservaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.reservaService.obtenerHorarios().subscribe({
      next: (respuesta) => {
        this.horarios = respuesta;
        this.cdr.detectChanges();

        console.log('Horarios obtenidos:', respuesta);
      },
      error: (error) => {
        console.error('Error al obtener horarios:', error);
      }
    });

  }

  consultarDisponibilidad(): void {

    this.mesaSeleccionada = null;
    this.mesas = [];
    this.mesasFiltradas = [];
    this.consultaRealizada = false;

    const personas = Number(this.numeroPersonas);

    if (
      !this.fecha ||
      this.turnoId === null ||
      this.numeroPersonas === null ||
      !Number.isInteger(personas) ||
      personas < 1
    ) {
      alert('Completa todos los campos correctamente.');
      this.cdr.detectChanges();
      return;
    }

    const fechaConsultada = this.fecha;
    const turnoConsultado = this.turnoId;

    this.numeroPersonas = personas;

    console.log('Consultando disponibilidad...');
    console.log('Fecha:', fechaConsultada);
    console.log('Turno:', turnoConsultado);
    console.log('Personas:', personas);

    this.reservaService.obtenerMesas(
      fechaConsultada,
      turnoConsultado
    ).subscribe({

      next: (respuesta) => {

        console.log('Mesas recibidas del backend:', respuesta);

        this.mesas = respuesta;

        this.mesasFiltradas = respuesta.filter(mesa => {
          const capacidad = Number(mesa.capacidadMaxima);
          return capacidad >= personas;
        });

        console.log('Mesas mostradas:', this.mesasFiltradas);

        this.consultaRealizada = true;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Error al consultar mesas:', error);

        this.mesas = [];
        this.mesasFiltradas = [];
        this.consultaRealizada = false;

        this.cdr.detectChanges();

        alert('No se pudo consultar la disponibilidad de las mesas.');

      }

    });

  }

  /*seleccionarMesa(id: number): void {

    const mesa = this.mesasFiltradas.find(m => m.id === id);

    if (!mesa || mesa.estado !== 'DISPONIBLE') {
      return;
    }

    this.mesaSeleccionada = id;

  }*/
 seleccionarMesa(id: number): void {

  console.log('Clic detectado en mesa:', id);

  const mesa = this.mesasFiltradas.find(m => Number(m.id) === Number(id));

  console.log('Mesa encontrada:', mesa);

  if (!mesa || mesa.estado !== 'DISPONIBLE') {
    console.log('No se puede seleccionar esta mesa');
    return;
  }

  this.mesaSeleccionada = id;

  console.log('Mesa seleccionada:', this.mesaSeleccionada);

  this.cdr.detectChanges();

}

  confirmarReserva(): void {

    const usuario = this.authService.obtenerUsuario();

    if (!usuario) {
      alert('Debes iniciar sesión para realizar una reserva.');
      return;
    }

    if (
      !this.fecha ||
      this.turnoId === null ||
      this.mesaSeleccionada === null ||
      this.numeroPersonas === null
    ) {
      alert('Completa los datos y selecciona una mesa.');
      return;
    }

    const datosReserva = {
      idReserva: null,
      idMesa: this.mesaSeleccionada,
      idUsuario: usuario.idUsuario,
      fecha: this.fecha,
      nroPersonas: this.numeroPersonas,
      idHorarioTurno: this.turnoId
    };

    this.reservaService.realizarReserva(datosReserva).subscribe({

      next: (respuesta) => {

        alert(respuesta);

        // Redirigir al panel del cliente.
        this.router.navigate(['/cliente']);

      },

      error: (error) => {

        console.error('Error al realizar la reserva:', error);

        alert(
          error.error ||
          'No se pudo realizar la reserva. Verifica la disponibilidad.'
        );

      }

    });

  }

}
