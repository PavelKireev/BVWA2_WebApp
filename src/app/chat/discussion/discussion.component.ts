import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  messageForm: FormGroup;

  users: UserModel[] = [
    { userId: 'Sender 1', email: 'user1@email.com' },
    { userId: 'Sender 2', email: 'user2@email.com' },
    { userId: 'Sender 3', email: 'user3@email.com' },
    // ... more items
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.messageForm = new FormGroup({
      selectedUser: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    console.log(this.users);
  }

  send(): void {
    if (this.messageForm.valid) {
      const msgData = this.messageForm.value;
      console.log(msgData); // Log the form data
      this.successMessage = 'Message sent successfully';
      setTimeout(() => {
        this.successMessage = '';
      }, 1500);
      this.messageForm.reset();
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
