import {Component, OnInit, Output} from "@angular/core";
import {MatSelect} from "@angular/material/select";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import configurl from "../../assets/config/config.json";
import {User} from "../homepage/homepage.component";
import {Patient} from "../patient/patient.component";
import {map, mergeMap, of} from "rxjs";
import {Doctor} from "../doctor/doctor.component";
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'appointment-component',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  title = 'Zdravotni System App';

  @Output()
  doctorList?: (string | undefined)[];
  @Output()
  patientList?: (string | undefined)[];
  @Output()
  dateTimeList?: (string | undefined)[];
  @Output()
  public appointmentTable?: AppointmentDto[];

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.fillTable();
    this.httpClient.get<Patient[]>(configurl.apiServer.url + "/api/patient/list")
                   .pipe(
                     mergeMap( (patients: Patient[]) => {
                       this.patientList = patients.map(patient => patient.email);
                       return this.httpClient.get<Doctor[]>(configurl.apiServer.url + "/api/doctor/list")
                     }),
                     mergeMap((doctors: Doctor[]) =>
                       this.doctorList = doctors.map((doctor => doctor.email)))
                   ).subscribe();
  }

  update(dateTime: string, doctorEmail: string, patientEmail: string) {
    const data: AppointmentModel = {
      patientEmail: patientEmail,
      doctorEmail: doctorEmail,
      dateTime: dateTime
    }
    this.httpClient.post(
      configurl.apiServer.url + "/api/appointment/create",
      JSON.stringify(data),
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }
    ).pipe(
      mergeMap(
        () => {
          this.fillTable();
          return this.httpClient.get<string[]>(
            configurl.apiServer.url + "/api/working-hours/available?doctorEmail=" + doctorEmail)
        }),
      mergeMap((value) => this.dateTimeList = value)
    ).subscribe();
  }

  fillTable(): void {
    this.appointmentTable = [];
    this.httpClient.get<AppointmentDto[]>(configurl.apiServer.url + "/api/appointment/list").subscribe(
      (appointments: AppointmentDto[]) => { this.appointmentTable = appointments; }
    );
    console.log(this.appointmentTable?.toString());
  }

  onDoctorChange($event: any) {
    this.httpClient.get<string[]>(configurl.apiServer.url + "/api/working-hours/available?doctorEmail=" + $event.value)
                   .subscribe({ next: value => this.dateTimeList = value });
  }

  isUserAuthenticated(): boolean {
    return this.authService.isUserAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isDoctor(): boolean {
    return this.authService.isDoctor();
  }

  delete($event: any, id: number) {
    this.httpClient.delete(configurl.apiServer.url + "/api/appointment/delete?id=" + id).subscribe({
        next: _ => this.fillTable()
      }
    );
  }
}

interface AppointmentModel {
  doctorEmail: string;
  patientEmail: string;
  dateTime: string;
}

interface AppointmentDto {
  id: number;
  doctorEmail: string;
  patientEmail: string;
  dateTime: string;
}
