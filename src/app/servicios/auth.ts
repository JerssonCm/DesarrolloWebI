import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface DatosUsuario {
  idUsuario: number;
  nombre: string;
  email: string;
  rol: string;
}

// Coincide exactamente con el JSON que devuelve el backend al hacer login
export interface RespuestaLogin {
  token: string;
  idUsuario: number;
  nombre: string;
  email: string;
  rol: string;
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
  private usersUrl = 'http://localhost:8080/api/users';

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
        const usuarioParaGuardar: DatosUsuario = {
          idUsuario: respuesta.idUsuario,
          nombre: respuesta.nombre,
          email: respuesta.email,
          rol: respuesta.rol
        };

        sessionStorage.setItem('token', respuesta.token);
        sessionStorage.setItem('rol', respuesta.rol);
        sessionStorage.setItem('usuario', JSON.stringify(usuarioParaGuardar));
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

  obtenerRol(): string | null {
    return sessionStorage.getItem('rol') || this.obtenerUsuario()?.rol || null;
  }

  esAdmin(): boolean {
    return this.obtenerRol()?.toUpperCase() === 'ADMIN';
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('usuario');
  }

  obtenerUsuarios(): Observable<DatosUsuario[]> {
    return this.http.get<DatosUsuario[]>(this.usersUrl);
  }
}