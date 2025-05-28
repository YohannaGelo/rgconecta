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
import { OpinionesUsuarioComponent } from './opiniones/opiniones-usuario/opiniones-usuario.component';
import { PendingChangesGuard } from './core/guards/pending-changes.guard';
import { NoVerificadoComponent } from './no-verificado/no-verificado.component';
import { VerificarAlumnosComponent } from './profesor/verificar-alumnos/verificar-alumnos.component';
import { OfertasUsuarioComponent } from './ofertas/ofertas-usuario/ofertas-usuario.component';
import { DetalleOfertaComponent } from './ofertas/detalle-oferta/detalle-oferta.component';
import { PanelComponent } from './admin/panel/panel.component';

import { TitulacionesComponent as AdminTitulacionesComponent } from './admin/titulaciones/titulaciones.component';
import { TecnologiasComponent as AdminTecnologiasComponent } from './admin/tecnologias/tecnologias.component';
import { UsuariosComponent as AdminUsuariosComponent } from './admin/usuarios/usuarios.component';
import { ExperienciasComponent as AdminExperienciasComponent } from './admin/experiencias/experiencias.component';
import { EmpresasComponent as AdminEmpresasComponent } from './admin/empresas/empresas.component';
import { OfertasComponent as AdminOfertasComponent } from './admin/ofertas/ofertas.component';
import { OpinionesComponent as AdminOpinionesComponent } from './admin/opiniones/opiniones.component';
import { AlumnosComponent as AdminAlumnosComponent } from './admin/alumnos/alumnos.component';
import { ProfesoresComponent as AdminProfesoresComponent } from './admin/profesores/profesores.component';
import { ProfesoresVistaComponent } from './profesor/profesores-vista/profesores-vista.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { VerificarComponent } from './auth/verificar/verificar.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'registro',
    component: RegistroComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'registro-profes',
    component: RegistroProfesorComponent,
    canDeactivate: [PendingChangesGuard],
  },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'alumnos', component: AlumnosComponent },
  {
    path: 'opiniones',
    component: OpinionesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'nueva-oferta',
    component: NuevaOfertaComponent,
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'alumnos/:id',
    component: DetallesAlumnoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ofertas/:id',
    component: DetalleOfertaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil',
    component: PerfilAlumnoComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'perfil-profesor',
    component: PerfilProfesorComponent,
    canDeactivate: [PendingChangesGuard],
  },
  { path: 'mis-opiniones', component: OpinionesUsuarioComponent },
  { path: 'mis-ofertas', component: OfertasUsuarioComponent },
  {
    path: 'no-verificado',
    component: NoVerificadoComponent,
  },
  {
    path: 'verificar-alumnos',
    component: VerificarAlumnosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profesores',
    component: ProfesoresVistaComponent,
    canActivate: [AuthGuard],
  },
  { path: 'ayuda', component: AyudaComponent },
  { path: 'verificar', component: VerificarComponent }, // Ruta para verificar el email

  {
    path: 'admin',
    component: PanelComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'titulos', component: AdminTitulacionesComponent },
      { path: 'tecnologias', component: AdminTecnologiasComponent },
      { path: 'empresas', component: AdminEmpresasComponent },
      { path: 'experiencias', component: AdminExperienciasComponent },
      { path: 'ofertas', component: AdminOfertasComponent },
      { path: 'opiniones', component: AdminOpinionesComponent },
      { path: 'alumnos', component: AdminAlumnosComponent },
      { path: 'profesores', component: AdminProfesoresComponent },
      { path: 'usuarios', component: AdminUsuariosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
