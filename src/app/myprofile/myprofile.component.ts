import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Component, Output} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'myprofile-component',
  templateUrl: './myprofile.component.html',
  styleUrls: ['myprofile.component.css']
})
export class MyProfileComponent {

  private readonly baseUrl: string = "api"

  @Output()
  public user: AuthUserDto = new AuthUserDto();

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private actRoute: ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    if (!this.isUserAuthenticated()) {
      return;
    }

    let uuid: string = this.authService.getUserUuid();

    if (this.isPatient()) {
      this.httpClient.get<AuthUserDto>(this.baseUrl + `/patient/${uuid}`)
                     .subscribe(response => this.user = response);
    }
    if (this.isDoctor()) {
      this.httpClient.get<AuthUserDto>(this.baseUrl + `/doctor/${uuid}`)
                     .subscribe(response => this.user = response);
    }
    if (this.isAdmin()) {
      this.httpClient.get<AuthUserDto>(this.baseUrl + `/admin/${uuid}`)
                     .subscribe(response => this.user = response);
    }
  }

  public update(user?: AuthUserDto): void {
    if (!this.isUserAuthenticated()) {
      return;
    }

    user!.uuid = this.authService.getUserUuid();
    if (this.isPatient()) {
      this.httpClient.post<AuthUserDto>(this.baseUrl + `/patient/update`, JSON.stringify(user), {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe(response => console.log(response));
    }
    if (this.isDoctor()) {
      this.httpClient.post<AuthUserDto>(this.baseUrl + `/doctor/update`, JSON.stringify(user), {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe(response => console.log(response));
    }
    if (this.isAdmin()) {
      this.httpClient.post<AuthUserDto>(this.baseUrl + `/admin/update`, JSON.stringify(user), {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe(
        response => console.log(response));
    }
  }

  public isUserAuthenticated(): boolean {
    return this.authService.isUserAuthenticated();
  }

  public isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public isDoctor(): boolean {
    return this.authService.isDoctor();
  }

  public isPatient(): boolean {
    return this.authService.isPatient();
  }

  changePassword() {
    this.router.navigate(['password-change']);
  }
}

export class AuthUserDto {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: number;
  birthDate?: Date;
  officeNumber?: number;
}
