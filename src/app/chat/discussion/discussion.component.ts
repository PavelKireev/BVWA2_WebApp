import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ChatService } from "../../service/chat-service/chat-showcase.service";

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  messageForm: FormGroup;

  users: UserModel[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private httpClient: HttpClient,
              private chatService: ChatService
  ) {
    this.messageForm = new FormGroup({
      userEmailTo: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.httpClient.get<UserModel[]>('api/user/all')
                   .subscribe({
                     next: (response) => {
                       this.users = response;
                     }
                   });
    console.log(this.users);
  }

  send(): void {
    if (this.messageForm.valid) {
      const msgData = this.messageForm.value;
      console.log(msgData); // Log the form data
      this.httpClient.post('api/message/send', JSON.stringify(msgData),
                           { headers: { 'Content-Type': 'application/json' } })
                     .subscribe({
                       next: (response) => {
                         this.successMessage = 'Message sent successfully';
                         setTimeout(() => {
                           this.successMessage = '';
                         }, 1500);
                         this.messageForm.reset();
                         this.httpClient.get("api/message/new-messages")
                           .subscribe({
                             next: (response) => this.chatService.notifyNewMessagesAvailable
                                                                         .next(response as boolean)
                           });
                         },
                       error: (error) => {
                         this.errorMessage = 'Server error';
                         console.error(error);
                         setTimeout(() => {
                           this.errorMessage = '';
                         }, 1500);
                       }
                     });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 1500);
    }
  }
}

interface UserModel {
  userId: string;
  email: string;
}
