import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {LoginFormDto} from "../authentication/login/login.component";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  login(loginForm: LoginFormDto): Observable<string> {
    const httpOptions = {
      headers: {
        Authorization: 'Basic ' + window.btoa(loginForm.email + ':' + loginForm.password)
      },
      responseType: 'text' as 'text',
    };
    return this.http.post("api/authentication/sign-in", loginForm , httpOptions);
  }

  public isUserAuthenticated(): boolean {
    const token = sessionStorage.getItem("app.token");
    return !!(token && !this.jwtHelper.isTokenExpired(token));
  }

  public logout = () => {
    sessionStorage.removeItem("app.token");
  }

  public isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  public isDoctor(): boolean {
    return this.getRole() === 'DOCTOR';
  }

  public isPatient(): boolean {
    return this.getRole() === 'PATIENT';
  }

  public getAuthUserEmail(): string {
    let token = sessionStorage.getItem("app.token");
    if (token !== null) {
      return this.jwtHelper.decodeToken(token)["email"];
    } else {
      return '';
    }
  }

  public getAuthUserId(): number {
    let token = sessionStorage.getItem("app.token");
    if (token !== null) {
      return this.jwtHelper.decodeToken(token)["id"];
    } else {
      return 0;
    }
  }

  public getUserUuid(): string {
    let token = sessionStorage.getItem("app.token");
    if (token !== null) {
      return this.jwtHelper.decodeToken(token)["uuid"];
    } else {
      return String();
    }
  }

  private getRole(): string {
    let token = sessionStorage.getItem("app.token");
    if (token !== null) {
      return this.jwtHelper.decodeToken(token)["role"];
    } else {
      return '';
    }
  }
}
