import { Routes } from '@angular/router';
import { Home } from './paginas/home/home';
import { Login } from './paginas/auth/login/login';
import { Registro } from './paginas/auth/registro/registro';
import { PanelCliente } from './paginas/cliente/panel-cliente/panel-cliente';
import { NuevaReserva } from './paginas/cliente/nueva-reserva/nueva-reserva';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'cliente', component: PanelCliente },
  { path: 'cliente/nueva-reserva', component: NuevaReserva },
  { path: '**', redirectTo: '' }
];