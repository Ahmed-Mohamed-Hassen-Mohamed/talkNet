import { Component, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorService } from 'src/app/services/behavior.service';
import { ChatService } from 'src/app/services/chat.service';
import { GlobalService } from 'src/app/services/global.service';
import { RealTimeService } from 'src/app/services/real-time.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  logo = this.globalService.logo;
  messages: any[] = [];
  user: any;
  constructor(
    private realTimeService: RealTimeService,
    private chatService: ChatService,
    private userService: UserService,
    private behaviorService: BehaviorService,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    ) {}
  ngOnInit() {
    this.getLastMessages();
    this.getProfile();
    this.getNewMessage();
    this.updateSeen();
    this.id = this.route.snapshot.params['id'];
    this.behaviorService.updateNavbar(2);
  }
  id = this.route.snapshot.params['id'];

  ngOnDestroy(): void {
    this.id = undefined;
  }
  getNewMessage() {
    this.realTimeService.getNewMessage().subscribe((message: any) => {
      if (message) {
        this.messages = this.messages.filter(
          (mssg) => mssg.chatId !== message.chatId
        );
        if (message.chatId == this.id) {
          message.messagesNumber = 0;
          this.chatService.updateSeen(this.id).subscribe({
            next: (res: any) => {},
          });
        }
        this.messages.unshift(message);
        this.searchResults = this.messages;
      }
    });
  }
  updateSeen() {
    this.realTimeService.updateSeen().subscribe((seen: any) => {
      if (seen) {
        for (let i = 0; i < this.messages.length; i++) {
          if (this.messages[i].chatId === seen.chatId) {
            this.messages[i].isRead = true;
            break;
          }
        }
      }
    });
  }
  getProfile() {
    this.userService.getprofile().subscribe({
      next: (res: any) => {
        this.user = res;
      },
    });
  }
  getChats() {
    this.chatService.getChats().subscribe({
      next: (chats: any) => {
        // this.chats = chats;
      },
    });
  }
  searchResults: any[] = [];
  getLastMessages() {
    this.messages = [];
    this.chatService.getLastMessages().subscribe({
      next: (messages: any) => {
        this.messages = messages;
        this.searchResults = messages;
      },
    });
  }
  search(value: any): void {
    const searchTermLower = value.name.toLowerCase();
    this.searchResults = this.messages.filter((message) => {
      if (message.senderId._id == this.user._id) {
        const fullName =
          `${message.receiverId.firstName} ${message.receiverId.lastName}`.toLowerCase();
        return fullName.includes(searchTermLower);
      } else {
        const fullName =
          `${message.senderId.firstName} ${message.senderId.lastName}`.toLowerCase();
        return fullName.includes(searchTermLower);
      }
    });
  }
  openChat(i: any) {
    this.id = this.messages[i].chatId;
    this.messages[i].messagesNumber = 0;
  }
  handleMessage(message: any) {
    this.getLastMessages();
  }
  formattedDate(messageDate: any) {
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

    // Determine if the message was created yesterday
    const isYesterday =
      date.getDate() === currentDate.getDate() - 1 &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();

    // Format the date based on the conditions
    if (isSameDay) {
      // Show hour and minutes
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (isYesterday) {
      // Show "Yesterday"
      return 'Yesterday';
    } else if (isAfter24Hours) {
      // Show month and day
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      // Show year, month, and day
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
  }
}
