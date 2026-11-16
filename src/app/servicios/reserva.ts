
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservaRegistro {
  idReserva: number | null;
  idMesa: number;
  idUsuario: number;
  fecha: string;
  nroPersonas: number;
  idHorarioTurno: number;
}

export interface CancelarReserva {
  idUsuario: number;
  idReserva: number;
}

export interface ReservaVista {
  idReserva: number;
  mesa: {
    idMesa: number;
    numero?: number;
    capacidad?: number;
    estado?: string;
  };
  usuario: {
    idUsuario: number;
    nombre: string;
  };
  fecha: string;
  fechaReserva: string;
  nroPersonas: number;
  horarioTurno: {
    idHorarioTurno?: number;
    id?: number;
    horario?: string;
    turno?: string;
    horaInicio?: string;
    horaFin?: string;
  };
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) {}

  obtenerHorarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/horarios`);
  }

  obtenerMesas(fecha: string, turnoId: number): Observable<any[]> {
    const params = new HttpParams()
      .set('fecha', fecha)
      .set('turnoId', turnoId);

    return this.http.get<any[]>(`${this.apiUrl}/mesas`, { params });
  }

  realizarReserva(datos: ReservaRegistro): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/realizar`,
      datos,
      { responseType: 'text' }
    );
  }


  obtenerReservasPorFecha(fecha: string): Observable<ReservaVista[]> {
    return this.http.get<ReservaVista[]>(`${this.apiUrl}/fecha/${fecha}`);
  }

  cancelarReserva(datos: CancelarReserva): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/cancelar`,
      datos,
      { responseType: 'text' }
    );
  }

  verReservaPorId(id: number): Observable<ReservaVista> {
    return this.http.get<ReservaVista>(`${this.apiUrl}/reserva/${id}`);
  }
}