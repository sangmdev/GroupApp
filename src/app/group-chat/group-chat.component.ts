import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Group } from '../interfaces/group';
import { Message } from '../interfaces/message';
import { ChatService } from '../services/chat.service';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore/';

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
  userId;
  unsubscribeListener;
  messageBody;

  constructor(private chatService: ChatService, private authService: AuthenticationService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.userId = this.authService.userData.uid;
    this.messageBody = document.querySelector('#message-history');
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property === 'selectedGroup' && this.selectedGroup) {
        if (this.unsubscribeListener) {
          this.unsubscribeListener();
        }
        // When selected group is changed from one to another.
        this.chatService.getMessageListIdByGroupId(this.selectedGroup.id).then(messageListId => {
          // Get Group Message List Id
          this.messageListId = messageListId;
          this.messages = [];
          // Attach new listener
          this.unsubscribeListener = this.firestore.firestore.collection(this.messageListId)
            .onSnapshot(querySnapshot => {
              querySnapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                  const message: Message = {
                    created_at: change.doc.data().created_at,
                    text: change.doc.data().text,
                    uid: change.doc.data().uid

                  }
                  this.messages.push(message);
                }
              })
          });
        });
      }
    }
  }

  // Get message history based on message list Id.
  getMessageHistory() {
    // Get message history.
    this.chatService.getAllMessagesByMessageListId(this.messageListId).then(messages => {
      messages.forEach(message => {
        this.messages.push(message);
      })
    });
  }

  // Send a new message, and refresh message history.
  sendMessage() {
    const message: Message = {
      created_at: Date.now(),
      text: this.newMessage,
      uid: this.userId
    }
    this.chatService.sendMessage(this.messageListId, message).then(
      () => {
        this.newMessage = "";
        this.messageBody.scrollTop = this.messageBody.scrollHeight - this.messageBody.clientHeight;
      });
  }
}
