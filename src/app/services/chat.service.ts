import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GroupMessages } from "../interfaces/group-messages";
import { Message } from "../interfaces/message";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: AngularFirestore) { }

  createMessageList(groupId, messageListId) {
    const groupMessage: GroupMessages = {
      group_id: groupId,
      message_list_id: messageListId
    }
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("group_messages")
        .add(groupMessage)
        .then(
          res => { resolve() },
          err => reject(err));
    });
  }

  // Get MesssageListId based on GroupId passed in.
  async getMessageListIdByGroupId(groupId) {
    var messageListId = "";
    await this.firestore.collection("group_messages").ref.where("group_id", "==", groupId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          messageListId = doc.data().message_list_id;
        });
      })
      .catch(function (error) {
        console.log("Error getting groups: ", error);
      });
    return messageListId;
  }

  async getAllMessagesByMessageListId(messageListId) {
    var messages = [];
    await this.firestore.collection("messages").ref.where("message_list_id", "==", messageListId)
      .orderBy("created_at")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => messages.push(doc.data()));
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      })
    return messages;
  }

  sendMessage(message: Message) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("messages")
        .add(message)
        .then(
          res => { resolve() },
          err => reject(err));
    });
  }
}
