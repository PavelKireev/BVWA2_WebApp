import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {ChatService} from "../service/chat-service/chat-showcase.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  showMsg = false;
  messageContent: string = '';
  showMessage: boolean = false;

  inboxItems: InboxItem[] = [];

  constructor(private httpClient: HttpClient,
              private chatService: ChatService
  ) {
    setTimeout(() => {
      this.showMsg = true;
      },);
  }

  ngOnInit(): void {
    this.httpClient.get<InboxItem[]>('api/message/inbox')
                   .subscribe({
                     next: (response) => {
                       this.inboxItems = response;
                       this.chatService.notifyNewMessagesAvailable.next(false);
                     }
                   });
  }

  toggleExpand(index: number): void {
      this.inboxItems[index].isExpanded = !this.inboxItems[index].isExpanded;
  }
}

interface InboxItem {
  userEmailFrom: string;
  content: string;
  isExpanded: boolean;
  time?: Date;
}

