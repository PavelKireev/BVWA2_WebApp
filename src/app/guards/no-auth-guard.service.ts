import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthService} from "../service/auth.service";

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isUserAuthenticated()) {
            this.router.navigate(['/my-profile']);
            return false;
        }
        return true;
    }
}
