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
                mergeMap((doctors: Doctor[]) =>
                    this.doctorList = doctors
                )).subscribe();
        //workaround
        this.dateTimeList = ["12-12-2020 12:00", "12-12-2020 12:30"]
    }

    update(dateTime: string, doctorUuid: string, patientUuid: string) {
        let date = new Date(dateTime);
        const data: AppointmentModel = {
            patientUuid: patientUuid,
            doctorUuid: doctorUuid,
            dateTime: date
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
                    return this.httpClient.get<string[]>("api/working-hours/available?doctorUuid=" + doctorUuid)
                }),
            mergeMap((value) => this.dateTimeList = ["12-12-2020 12:00", "12-12-2020 12:30"])
        ).subscribe();
    }

    fillTable(): void {
        this.appointmentTable = [];
        this.httpClient.get<AppointmentDto[]>("api/appointment/list").subscribe(
            (appointments: AppointmentDto[]) => {
                this.appointmentTable = appointments;
            }
        );
        console.log(this.appointmentTable?.toString());
    }

    onDoctorChange($event: any) {
        this.httpClient.get<string[]>("api/working-hours/available?doctorUuid=" + $event.value)
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

    delete($event: any, id: number) {
        this.httpClient.delete("api/appointment/delete?id=" + id).subscribe({
                next: _ => this.fillTable()
            }
        );
    }
}

interface AppointmentModel {
    doctorUuid: string;
    patientUuid: string;
    dateTime: Date;
}

interface AppointmentDto {
    uuid: number;
    doctorName: string;
    doctorUuid: string;
    patientName: string;
    patientUuid: string;
    dateTime: string;
}
