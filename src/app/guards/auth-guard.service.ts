import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  public canActivate(): boolean {

    const token = sessionStorage.getItem("app.token");

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    this.router.navigate(["login"]).then(r => console.log(r));
    return false;
  }
}
