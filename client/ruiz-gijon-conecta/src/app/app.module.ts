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
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
    DetallesAlumnoComponent
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
    ToastrModule.forRoot({
      timeOut: 3000, // 3 segundos
      positionClass: 'toast-top-right', // arriba a la derecha
      preventDuplicates: true, // evita mensajes repetidos
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
