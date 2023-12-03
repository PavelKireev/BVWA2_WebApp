import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Component, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import configurl from '../../assets/config/config.json';
import { AuthService } from "../service/auth.service";

@Component({
  selector: 'patient-component',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
})
export class PatientComponent {

  @Output()
  public patient: Patient = new Patient();

  private readonly baseUrl: string = configurl.apiServer.url + "/api/patient/"

  constructor(
    private jwtHelper: JwtHelperService,
    private httpClient: HttpClient,
    private actRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPatient(this.actRoute.snapshot.params['uuid'])
        .subscribe(response => this.patient = response);
  }

  isUserAuthenticated(): boolean {
    return this.authService.isUserAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  idDoctor(): boolean {
    return this.authService.isDoctor();
  }

  private getPatient(uuid: string): Observable<Patient> {
    return this.httpClient.get<Patient>(`api/patient/${uuid}`);
  }

  public update(patient: Patient): void {
    this.httpClient.post(`api/patient/update`, JSON.stringify(patient), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe();
  }
}

export class Patient {
  uuid?: string = "";
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: number;
  insuranceNumber?: string;
  birthDate?: Date;
}
