import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import {
  AuthModule,
  AuthWellKnownEndpoints,
  OidcConfigService,
  OidcSecurityService,
  OpenIDImplicitFlowConfiguration,
} from 'angular-auth-oidc-client';
import { AuthorizationGuard } from './authorization.guard';
import { AuthorizeComponent } from './authorize/authorize.component';

const oidc_configuration = 'assets/auth.clientConfiguration.json';

export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load(oidc_configuration);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthorizeComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot()
  ],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true
    },
    AuthorizationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
    this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
      const oidcFlowConfig = new OpenIDImplicitFlowConfiguration();

      Object.assign(oidcFlowConfig, this.oidcConfigService.clientConfiguration);
      this.oidcSecurityService.setupModule(oidcFlowConfig, this.oidcConfigService.wellKnownEndpoints);
    });
  }
 }
