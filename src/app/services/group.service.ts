import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Member } from "../interfaces/member";
import { Group } from '../interfaces/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private firestore: AngularFirestore) { }

  // Creates group by adding an entry into the groups collection.
  createGroup(group) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("groups")
        .add(group)
        .then(
          res => { resolve() },
          err => reject(err));
    });
  }

  // Add a user to a group by adding an entry into the membership collection.
  addUserToGroup(groupId, userId) {
    const member: Member = {
      user_id: userId,
      group_id: groupId
    }
    this.firestore
      .collection("membership")
      .add(member);
  }

  // Get groups based on userId passed in.
  async getGroupsByUser(userId) {
    var groups = [];
      await this.firestore.collection("membership").ref.where("user_id", "==", userId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => groups.push(doc.data().group_id));
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        })
    return groups;
  }

  // Get groups based on GroupId passed in.
  async getGroupByGroupId(groupId) {
    const group = {} as Group;
    await this.firestore.collection("groups").ref.where("id", "==", groupId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          group.admin_uid = doc.data().admin_uid;
          group.id = doc.data().id;
          group.is_public = doc.data().is_public;
          group.name = doc.data().name;
        });
      })
      .catch(function (error) {
        console.log("Error getting groups: ", error);
      });
    return group;
  }
}
