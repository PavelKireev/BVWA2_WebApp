import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, switchMap } from 'rxjs';
import configurl from '../../assets/config/config.json'
import { WorkingHours } from '../working-hours/working-hours.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkingHoursService {

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
  ) { }

  public saveWorkingHours(workingHours: WorkingHours, day: string): Observable<WorkingHours[]> {
    workingHours.dayOfWeek = day;
    return this.httpClient.post<WorkingHours[]>("api/working-hours/create?doctorUuid=" +
                                                this.authService.getUserUuid(), JSON.stringify(workingHours), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).pipe(shareReplay());
  }

  public remove(uuid?: string): Observable<WorkingHours[]> {
    return this.httpClient.delete<WorkingHours[]>("api/working-hours/delete?uuid=" + uuid).pipe(shareReplay());
  }

  public getAllByDoctorUuid(): Observable<WorkingHours[]> {
    return this.httpClient.get<WorkingHours[]>('api/working-hours/list?doctorUuid=' + this.authService.getUserUuid());
  }
}
