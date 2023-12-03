import {Component, OnInit, Output} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Patient} from "../patient/patient.component";
import {mergeMap, of} from "rxjs";
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
    doctorList?: Doctor[];
    @Output()
    patientList?: Patient[];
    @Output()
    dateTimeList?: (string | undefined)[];
    @Output()
    public appointmentTable?: AppointmentDto[];

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.fillTable();
        this.httpClient.get<Patient[]>("api/patient/list")
                       .pipe(
                         mergeMap((patients: Patient[]) => {
                           this.patientList = patients;
                           return this.httpClient.get<Doctor[]>("api/doctor/list")
                         }),
                         mergeMap((doctors: Doctor[]) => {
                             this.doctorList = doctors;
                              return of(doctors);
                           }
                         )).subscribe();
    }

    update(dateTime: string, doctorUuid: string, patientUuid: string) {
      let dateTimeParts = dateTime.split(' ');
      let dateParts = dateTimeParts[0].split('-');
      let timeParts = dateTimeParts[1].split(':');
      let date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1,
                                parseInt(dateParts[2]), parseInt(timeParts[0]), parseInt(timeParts[1]));
      const data: AppointmentModel = {
        patientUuid: patientUuid,
        doctorUuid: doctorUuid,
        time: date
      }
      this.httpClient.post("api/appointment/create",
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
            return this.httpClient.get<string[]>("appointments/available?doctorUuid=" + doctorUuid)
          }),
        mergeMap((value) => this.dateTimeList = value)
      ).subscribe();
    }

    fillTable(): void {
        this.appointmentTable = [];

        if (this.authService.isPatient()) {
            this.httpClient.get<AppointmentDto[]>("api/appointment/patient?patientUuid=" + this.authService.getUserUuid())
                           .subscribe((appointments: AppointmentDto[]) => {
                               this.appointmentTable = appointments;
                           });
        } else if (this.authService.isDoctor() || this.authService.isAdmin()) {
            this.httpClient.get<AppointmentDto[]>("api/appointment/list").subscribe(
                (appointments: AppointmentDto[]) => {
                    this.appointmentTable = appointments;
                });
        }
    }

    onDoctorChange($event: any) {
        this.httpClient.get<string[]>("appointments/available?doctorUuid=" + $event.target.value)
                       .subscribe({next: value => this.dateTimeList = value});
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

    delete($event: any, uuid: string) {
        this.httpClient.delete("api/appointment/delete?uuid=" + uuid).subscribe({
                next: _ => this.fillTable()
            }
        );
    }
}

interface AppointmentModel {
    doctorUuid: string;
    patientUuid: string;
    time: Date;
}

interface AppointmentDto {
    uuid: string;
    doctorName: string;
    doctorUuid: string;
    patientName: string;
    patientUuid: string;
    time: string;
}
