import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './viewswebsite/pages/header/header.component';
import { FooterComponent } from './viewswebsite/pages/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AlertaServiceService } from './services/alerta-service.service';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent,
    FooterComponent,
    BrowserAnimationsModule,
    OAuthModule.forRoot(),
    HttpClientModule,
  ],
  providers: [AlertaServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
