import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import configurl from '../../../assets/config/config.json';
import { JwtHelperService } from '@auth0/angular-jwt';
import {AuthService} from "../../service/auth.service";
import { JwtPayload, jwtDecode } from "jwt-decode";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  invalidLogin?: boolean;
  url = configurl.apiServer.url + '/api/authentication/';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
  ) { }

  public login(loginForm: NgForm): void {
    const values = loginForm.value as any;

    const loginFormDto: LoginFormDto = {
      email: values.email,
      password: values.password
    }
    sessionStorage.removeItem("app.token");
    this.authService.login(loginFormDto)
      .subscribe({
        next: (token) => {
          sessionStorage.setItem("app.token", token);
          const decodedToken = jwtDecode<JwtPayload>(token);
          if (typeof decodedToken.aud === "string") {
            sessionStorage.setItem("app.roles", decodedToken.aud);
          }
          //todo: add domain resolution
          this.invalidLogin = false;
          this.router.navigateByUrl("list");
        },
        error: (error) => {
          this.invalidLogin = true;
          console.error(`Login failed: ${error.status}`, "OK")
        }
      });
  }

  isUserAuthenticated() {
    const token = sessionStorage.getItem("app.token");
    return !!(token && !this.jwtHelper.isTokenExpired(token));
  }
}

export interface LoginFormDto {
  email: string,
  password: string
}
