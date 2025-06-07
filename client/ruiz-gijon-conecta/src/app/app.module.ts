import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpinionesComponent } from './opiniones/opiniones.component';
import { NuevaOfertaComponent } from './nueva-oferta/nueva-oferta.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RegistroProfesorComponent } from './auth/registro-profes/registro-profes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetallesAlumnoComponent } from './detalles-alumno/detalles-alumno.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfilAlumnoComponent } from './perfil-alumno/perfil-alumno.component';
import { PerfilProfesorComponent } from './perfil-profesor/perfil-profesor.component';
import { OpinionesUsuarioComponent } from './opiniones/opiniones-usuario/opiniones-usuario.component';
import { VerificarAlumnosComponent } from './profesor/verificar-alumnos/verificar-alumnos.component';
import { OfertasUsuarioComponent } from './ofertas/ofertas-usuario/ofertas-usuario.component';
import { DetalleOfertaComponent } from './ofertas/detalle-oferta/detalle-oferta.component';
import { UsuariosComponent as AdminUsuariosComponent} from './admin/usuarios/usuarios.component';
import { EmpresasComponent as AdminEmpresasComponent} from './admin/empresas/empresas.component';
import { TitulacionesComponent as AdminTitulacionesComponent} from './admin/titulaciones/titulaciones.component';
import { TecnologiasComponent as AdminTecnologiasComponent} from './admin/tecnologias/tecnologias.component';
import { ExperienciasComponent as AdminExperienciasComponent} from './admin/experiencias/experiencias.component';
import { OpinionesComponent as AdminOpinionesComponent } from './admin/opiniones/opiniones.component';
import { OfertasComponent as AdminOfertasComponent } from './admin/ofertas/ofertas.component';
import { PanelComponent } from './admin/panel/panel.component';
import { AlumnosComponent as AdminAlumnoComponent} from './admin/alumnos/alumnos.component';
import { ProfesoresComponent as AdminProfesoresComponent } from './admin/profesores/profesores.component';
import { AutofocusDirective } from './shared/autofocus.directive';
import { FloatingContactPanelComponent } from './shared/components/floating-contact-panel/floating-contact-panel.component';
import { ProfesoresVistaComponent } from './profesor/profesores-vista/profesores-vista.component';
import { NoVerificadoComponent } from './no-verificado/no-verificado.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { VerificarComponent } from './auth/verificar/verificar.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { LinkifyPipe } from './pipes/linkify.pipe';
import { OcultarLinksPipe } from './pipes/ocultar-links.pipe';
import { VolverArribaComponent } from './shared/components/volver-arriba/volver-arriba.component';
import { PasswordToggleDirective } from './shared/components/password-toggle.directive';
import { AutologinComponent } from './autologin/autologin.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    OfertasComponent,
    AlumnosComponent,
    OpinionesComponent,
    NuevaOfertaComponent,
    RegistroComponent,
    RegistroProfesorComponent,
    DetallesAlumnoComponent,
    PerfilAlumnoComponent,
    PerfilProfesorComponent,
    OpinionesUsuarioComponent,
    NoVerificadoComponent,
    VerificarAlumnosComponent,
    OfertasUsuarioComponent,
    DetalleOfertaComponent,
    AdminUsuariosComponent,
    AdminEmpresasComponent,
    AdminTitulacionesComponent,
    AdminTecnologiasComponent,
    AdminExperienciasComponent,
    AdminOpinionesComponent,
    AdminOfertasComponent,
    PanelComponent,
    AdminAlumnoComponent,
    AdminProfesoresComponent,
    AutofocusDirective,
    FloatingContactPanelComponent,
    ProfesoresVistaComponent,
    AyudaComponent,
    VerificarComponent,
    LoaderComponent,
    LinkifyPipe,
    OcultarLinksPipe,
    VolverArribaComponent,
    PasswordToggleDirective,
    AutologinComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    HttpClientModule,
    NgSelectModule,
    ImageCropperModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000, // 3 segundos
      positionClass: 'toast-top-right', // arriba a la derecha
      preventDuplicates: true, // evita mensajes repetidos
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
