import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  showMsg = false;
  messageContent: string = '';
  showMessage: boolean = false;

  inboxItems: InboxItem[] = [
    { sender: 'Sender 1', body: 'This is the body of the second message. This is the body of the second message. ' +
        'This is the body of the second message. This is the body of the second message. ' +
        'This is the body of the second message. This is the body of the second message.', isExpanded: false , date: new Date()},
    { sender: 'Sender 2', body: 'This is the body of the second message.', isExpanded: false , date: new Date()},
    { sender: 'Sender 3', body: 'This is the body of the second message.', isExpanded: false , date: new Date()},

    // ... more items
  ];

  constructor() {
    setTimeout(() => {
      this.showMsg = true;
    }, );
  }

  ngOnInit(): void {
  }
  toggleExpand(index: number): void {
    this.inboxItems[index].isExpanded = !this.inboxItems[index].isExpanded;
  }
}

interface InboxItem {
  sender: string;
  body: string;
  isExpanded: boolean;
  date?: Date;
}

