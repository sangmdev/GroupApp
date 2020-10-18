import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Group } from '../interfaces/group';
import { Message } from '../interfaces/message';
import { ChatService } from '../services/chat.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit {
  newMessage: string;
  groupMessageId: string;
  messageListId: string;
  messages: Message[] = [];
  @Input() selectedGroup: Group;

  constructor(private chatService: ChatService, private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property === 'selectedGroup' && this.selectedGroup) {
        // When selected group is changed from one to another.
        this.chatService.getMessageListIdByGroupId(this.selectedGroup.id).then(messageListId => {
          // Get Group Message List Id
          this.messageListId = messageListId;
          this.getMessageHistory();
        });
      }
    }
  }

  // Get message history based on message list Id.
  getMessageHistory() {
    // Get message history.
    this.messages = [];
    this.chatService.getAllMessagesByMessageListId(this.messageListId).then(messages => {
      messages.forEach(message => {
        this.messages.push(message);
      })
    });
  }

  // Send a new message, and refresh message history.
  sendMessage() {
    const message: Message = {
      message_list_id: this.messageListId,
      created_at: Date.now(),
      text: this.newMessage,
      uid: this.authService.userData.uid
    }
    this.chatService.sendMessage(message).then(
      () => {
        this.getMessageHistory();
        this.newMessage = "";
      });
  }
}
