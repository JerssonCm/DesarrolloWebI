
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
}
