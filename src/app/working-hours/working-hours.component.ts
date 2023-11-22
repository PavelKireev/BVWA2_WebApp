import { HttpClient } from '@angular/common/http';
import { Component, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { WorkingHoursService } from '../service/working-hours.service';

@Component({
  selector: 'working-hours',
  templateUrl: './working-hours.component.html',
})
export class WorkingHoursComponent {
  @Output()
  public workingHours: WorkingHours = new WorkingHours();
  @Output()
  public list: Observable<WorkingHours[]> = of();
  @Output()
  public days: string[] = [];

  @Output()
  public selectedDay: string = '';

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private workingHoursService: WorkingHoursService
  ) { }

  ngOnInit(): void {
    this.list = this.workingHoursService.getAllByDoctorUuid();
    this.list.subscribe(response => {
      this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        .filter(day => !response.some(wh => wh.dayOfWeek === day));
    });
  }

  public create(workingHours: WorkingHours, day: string): void {
    workingHours.doctorUuid = this.authService.getUserUuid();
    this.list = this.workingHoursService.saveWorkingHours(workingHours, day);
    this.list.subscribe(response => {
      this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].filter(
        day => !response.some(wh => wh.dayOfWeek === day));

    });
  }

  public delete(uuid?: string): void {
    this.list = this.workingHoursService.remove(uuid);
    this.list.subscribe(response => {
      this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].filter(
        day => !response.some(wh => wh.dayOfWeek === day));
    });
  }

  public isUserAuthenticated(): boolean {
    return this.authService.isUserAuthenticated();
  }

}

export class WorkingHours {
  uuid?: string;
  dayOfWeek: string = '';
  hourFrom?: number;
  hoursCount?: number;
  doctorUuid?: string;
}
