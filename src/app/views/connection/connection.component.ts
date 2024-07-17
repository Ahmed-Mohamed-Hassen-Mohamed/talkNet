import { Component } from '@angular/core';
import { BehaviorService } from 'src/app/services/behavior.service';
import { ChatService } from 'src/app/services/chat.service';
import { GlobalService } from 'src/app/services/global.service';
import { RealTimeService } from 'src/app/services/real-time.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css'],
})
export class ConnectionComponent {
  logo = this.globalService.logo;
  chats: any[] = [];
  users: any[] = [];
  user: any;
  constructor(
    private realTimeService: RealTimeService,
    private chatService: ChatService,
    private userService: UserService,
    private behaviorService:BehaviorService,
    private globalService:GlobalService
  ) {}
  ngOnInit() {
    this.getChats();
    this.getNewChat();
    this.getProfile();
    this.behaviorService.updateNavbar(3);
  }

  getProfile() {
    this.userService.getprofile().subscribe({
      next: (res: any) => {
        this.user = res;
      },
    });
  }

  getNewChat() {
    this.realTimeService.getNewChat().subscribe((chat: any) => {
      if (chat) {
        this.chats.push(chat);
        this.searchResults.push(chat)
      }
    });
  }
  searchResults: any[] = [];
  getChats() {
    this.chatService.getChats().subscribe({
      next: (chats: any) => {
        this.chats = chats;
        this.searchResults = chats;
      },
    });
  }
  Search(value: any) {
    if (value.email == '') {
      this.users = [];
      return;
    }
    this.userService.getUserByEmail(value).subscribe({
      next: (users: any) => {
        this.users = users;
      },
    });
  }
  search(value: any): void {
    const searchTermLower = value.name.toLowerCase();
    this.searchResults = this.chats.filter((chat) => {
      if (chat.user1Id._id == this.user._id) {
        const fullName =
          `${chat.user2Id.firstName} ${chat.user2Id.lastName}`.toLowerCase();
        return fullName.includes(searchTermLower);
      } else {
        const fullName =
          `${chat.user1Id.firstName} ${chat.user1Id.lastName}`.toLowerCase();
        return fullName.includes(searchTermLower);
      }
    });
  }

  createChat(user2: any) {
    const chat = {
      user1Id: this.user._id,
      user2Id: user2._id,
    };
    this.chats.push({
      user1Id: this.user,
      user2Id: user2,
      creationDate: Date.now(),
    });
    this.realTimeService.CreateChat(chat);
  }
  formattedDate(messageDate: string): string {
    const date = new Date(messageDate);
    const currentDate = new Date();

    // Determine the time difference in seconds
    const timeDifferenceInSeconds =
      (currentDate.getTime() - date.getTime()) / 1000;

    // Check if the message was created within the last 60 seconds
    if (timeDifferenceInSeconds <= 60) {
      return 'Now';
    }

    // Determine if the message was created on the same day
    const isSameDay =
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();

    // Determine if the message was created after 24 hours
    const isAfter24Hours =
      date.getTime() < currentDate.getTime() - 24 * 60 * 60 * 1000;

    // Format the date based on the conditions
    if (isSameDay) {
      // Show hour and minutes
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (isAfter24Hours) {
      // Show month and day
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } else {
      // Show year, month, and day
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }
}
