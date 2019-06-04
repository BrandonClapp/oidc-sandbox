import { Component, OnDestroy, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { filter, take } from 'rxjs/operators';
 
@Component({
    selector: 'home',
    template: `
    <h1>Secured Home Page</h1>
    <hr />

    <button *ngIf="!isAuthenticated" (click)="login()">Login</button>
    <button *ngIf="isAuthenticated" (click)="logout()">Logout</button>
    
    <hr />
    
    Is Authenticated: {{ isAuthenticated }}
    
    <br />
    <br />
    
    {{ userData | json }}
    `,
})
export class HomeComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean;
    userData: any;
 
    constructor(public oidcSecurityService: OidcSecurityService) {
        if (this.oidcSecurityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.doCallbackLogicIfRequired();
            });
        }
    }
 
    ngOnInit() {
        this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
            this.isAuthenticated = auth;
        });
 
        this.oidcSecurityService.getUserData().subscribe(userData => {
            this.userData = userData;
        });
    }
 
    ngOnDestroy(): void {}
 
    // login() {
    //     this.oidcSecurityService.authorize();
    // }
 
    logout() {
        this.oidcSecurityService.logoff();
    }
 
    private doCallbackLogicIfRequired() {
        // Will do a callback, if the url has a code and state parameter.
        this.oidcSecurityService.authorizedCallbackWithCode(window.location.toString());
    }
}