import {BehaviorSubject, ReplaySubject, Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from "../auth.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ChatService {
  public readonly responses: Subject<string> = new Subject<string>();

  public notifyNewMessagesAvailable: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private authService: AuthService,
              private httpClient: HttpClient
  ) {
  }
  public submit(question: string): void {
    const length = question.length;
    const answer = `"${question}" contains exactly ${length} symbols.`;

    setTimeout(() => this.responses.next(answer), 1000);
  }
}
