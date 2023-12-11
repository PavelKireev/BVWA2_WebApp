import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from "@angular/router";
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import configurl from '../../../assets/config/config.json';
import { JwtHelperService } from '@auth0/angular-jwt';
import {AuthService} from "../../service/auth.service";
import { JwtPayload, jwtDecode } from "jwt-decode";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin?: boolean;
  errorMessage: string = ''; // Add this line
  loginForm: FormGroup;
  url = configurl.apiServer.url + '/api/authentication/';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.isUserAuthenticated()) {
      this.router.navigateByUrl('my-profile');
    }
  }

  public login(): void {
    if (this.loginForm.invalid) {
      this.invalidLogin = true;
      return;
    }
    this.invalidLogin = false;
    const loginFormDto: LoginFormDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    sessionStorage.removeItem('app.token');
    this.authService.login(loginFormDto)
      .subscribe({
        next: (token) => {
          sessionStorage.setItem('app.token', token);
          const decodedToken = jwtDecode<JwtPayload>(token);
          if (typeof decodedToken.aud === 'string') {
            sessionStorage.setItem('app.roles', decodedToken.aud);
          }
          this.router.navigateByUrl('my-profile');
        },
        error: (error) => {
          this.invalidLogin = true;
          this.errorMessage = 'Invalid email or password';
          console.error(`Login failed: ${error.status}`, 'OK');
        }
      });
  }

  cancel(): void {
    this.invalidLogin = false
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
