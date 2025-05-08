import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { RegistroProfesorComponent } from './auth/registro-profes/registro-profes.component';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { OpinionesComponent } from './opiniones/opiniones.component';
import { NuevaOfertaComponent } from './nueva-oferta/nueva-oferta.component';
import { DetallesAlumnoComponent } from './detalles-alumno/detalles-alumno.component';
import { PerfilAlumnoComponent } from './perfil-alumno/perfil-alumno.component';
import { PerfilProfesorComponent } from './perfil-profesor/perfil-profesor.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'registro-profes', component: RegistroProfesorComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'alumnos', component: AlumnosComponent },
  { path: 'opiniones', component: OpinionesComponent },
  {
    path: 'nueva-oferta',
    component: NuevaOfertaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'alumnos/:id',
    component: DetallesAlumnoComponent,
  },
  { path: 'perfil', component: PerfilAlumnoComponent },
  { path: 'perfil-profesor', component: PerfilProfesorComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
