import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { v4 as uuidv4 } from 'uuid';
import { Group } from "../interfaces/group";
import { AuthenticationService } from '../services/authentication.service';
import { ChatService } from '../services/chat.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.css']
})
export class GroupManagerComponent implements OnInit {
  groupAction = 'create';
  groupCode: string;
  groupName: string;
  isPublic = true;
  submitButtonClicked = false;
  userId;
  joinGroupMessage = "";

  constructor(private groupService: GroupService, private authService: AuthenticationService, private chatService: ChatService, public dialogRef: MatDialogRef<GroupManagerComponent>) { }

  ngOnInit(): void {
    this.userId = this.authService.userData.uid;
  }

  createGroup() {
    const group: Group = {
      id: uuidv4(),
      name: this.groupName,
      admin_uid: this.authService.userData.uid,
      is_public: this.isPublic,
      message_list_id: uuidv4()
    }
    this.groupService.createGroup(group).then(() => {
      this.groupService.addUserToGroup(group.id, group.admin_uid, true);
      this.chatService.createMessageList(group.id, group.message_list_id);
      this.closeGroupManagerDialog("create");
    });
  }

  async joinGroup() {
    this.joinGroupMessage = "";
    await this.groupService.getGroupByGroupId(this.groupCode)
      .then(group => {
        // Check if group exists
        if (group.id) {
          // Check that the user is not already in the group.
          this.groupService.getUserMembershipInGroup(this.userId, group.id).then(membership => {
            if (membership.user_id) {
              if (membership.is_approved) {
                this.joinGroupMessage = "You are already a member of this group.";
              }
              else if (!membership.is_approved) {
                this.joinGroupMessage = "You request to join is currently pending. Please wait for group admin to approve.";
              }
            }
            else {
              // Add user to the group but still has to be approved.
              this.groupService.addUserToGroup(this.groupCode, this.userId, false);
              this.groupName = group.name;
              this.joinGroupMessage = "You have requested to be added to this group, please wait for group admin to approve.";
              this.closeGroupManagerDialog("join");
            }
          });
        }
        else {
          this.joinGroupMessage = "Group code is invalid.";
        }
    })
  }

  closeGroupManagerDialog(action) {
    if (action == "create") {
      this.dialogRef.close(`Group '${this.groupName}' was created successfully.`);
    }
    else if (action === "join") {
      this.dialogRef.close(`Your request to join ${this.groupName} was successful. Please wait for group admin to approve.`)
    }
  }
}
