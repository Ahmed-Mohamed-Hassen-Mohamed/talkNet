import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { GlobalService } from 'src/app/services/global.service';
import { RealTimeService } from 'src/app/services/real-time.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  logo = this.globalService.logo;
  @Input() id: any;
  @Output() messageEvent = new EventEmitter<string>();
  messages: any[] = [];
  chat: any;
  user: any;
  value: string = '';
  constructor(
    private realTimeService: RealTimeService,
    private chatService: ChatService,
    private userService: UserService,
    private globalService:GlobalService
  ) {}
  ngOnInit() {
    this.getProfile();
    // this.getChat();
    // this.getMessages();
    this.getNewMessage();
    this.updateSeen();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.getChat();
      this.getMessages();
      this.replayMessage = undefined;
    }
  }

  getProfile() {
    this.userService.getprofile().subscribe({
      next: (res: any) => {
        this.user = res;
      },
    });
  }

  getNewMessage() {
    this.realTimeService.getNewMessage().subscribe((message: any) => {
      if (message && message.chatId == this.id) {
        const isDuplicate = this.messages.some(
          (msg) => msg._id === message._id
        );
        if (!isDuplicate) {
          this.messages.push(message);
        }
      }
    });
  }

  getChat() {
    this.chatService.getChatById(this.id).subscribe({
      next: (chat: any) => {
        this.chat = chat;
      },
    });
  }

  updateSeen() {
    this.realTimeService.updateSeen().subscribe((seen: any) => {
      if (seen) {
        if (this.chat._id === seen.chatId) {
          for (let i = 0; i < this.messages.length; i++) {
            this.messages[i].isRead = true;
          }
        }
      }
    });
  }

  getMessages() {
    this.chatService.getMessages(this.id).subscribe({
      next: (messages: any) => {
        this.messages = messages;
      },
    });
  }
  replayMessage: any;
  replayToMessage(message: any): void {
    this.replayMessage = message;
  }

  createMessage(value: any) {
    let message = {
      chatId: this.id,
      senderId: this.user._id,
      receiverId:
        this.user._id == this.chat.user1Id._id
          ? this.chat.user2Id._id
          : this.chat.user1Id._id,
      content: value.message,
      replyToId: undefined
    };
    if (this.replayMessage && this.replayMessage._id) {
      message.replyToId = this.replayMessage._id;
    }
    this.messages.push({
      chatId: this.id,
      senderId: this.user,
      receiverId:
        this.user._id == this.chat.user1Id._id
          ? this.chat.user2Id
          : this.chat.user1Id,
      content: value.message,
      createdAt: new Date().toISOString(),
      replyToId: this.replayMessage,
    });

    this.realTimeService.sendMessage(message);
    this.replayMessage = undefined;
    this.value = '';
    this.messageEvent.emit('');
  }
  cancelReplayMessage() {
    this.replayMessage = undefined;
  }
  @ViewChild('chatContainer') private chatContainer: any;
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom error:', err);
    }
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
