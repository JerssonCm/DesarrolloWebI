import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface DatosUsuario {
  idUsuario: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface RespuestaLogin {
  usuario: DatosUsuario;
  token: string;
}

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
}

export interface DatosLogin {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  registrar(datos: DatosRegistro): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/register`,
      datos,
      { responseType: 'text' }
    );
  }

  iniciarSesion(datos: DatosLogin): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(
      `${this.apiUrl}/login`,
      datos
    ).pipe(
      tap(respuesta => {
        sessionStorage.setItem('token', respuesta.token);
        sessionStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
      })
    );
  }

  obtenerUsuario(): DatosUsuario | null {
    const usuario = sessionStorage.getItem('usuario');

    return usuario ? JSON.parse(usuario) as DatosUsuario : null;
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem('token');
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
}
