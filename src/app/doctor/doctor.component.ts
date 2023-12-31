import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Component, OnInit, Output} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import configurl from '../../assets/config/config.json';

@Component({
  selector: 'doctor-component',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  @Output()
  public doctor: Doctor = new Doctor();

  private readonly baseUrl: string = configurl.apiServer.url + "/api/doctor/"

  constructor(
    private jwtHelper: JwtHelperService,
    private httpClient: HttpClient,
    private actRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDoctor(this.actRoute.snapshot.params['uuid'])
      .subscribe(response => this.doctor = response);
  }

  isUserAuthenticated(): boolean {
    const token = sessionStorage.getItem("app.token");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  private getDoctor(uuid: string): Observable<Doctor> {
    return this.httpClient.get<Doctor>(`api/doctor/${uuid}`);
  }

  public update(doctor: Doctor): void {
    this.httpClient.post(`api/doctor/update`, JSON.stringify(doctor), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe({
      next: (_) => this.router.navigate(["homepage"]),
      //error: (err: HttpErrorResponse) => {
      //  this.errorMessage = err.message;
      //  this.showError = true;
      //}
    });
  }
}

export class Doctor {
  uuid: string = "";
  firstName?: string;
  lastName?: string;
  email?: string;
  officeNumber?: string;
}
