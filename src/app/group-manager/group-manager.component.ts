import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { v4 as uuidv4 } from 'uuid';
import { Group } from "../interfaces/group";
import { AuthenticationService } from '../services/authentication.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.css']
})
export class GroupManagerComponent implements OnInit {
  groupAction = 'create';
  groupName: string;
  isPublic = true;

  constructor(private groupService: GroupService, private authService: AuthenticationService, public dialogRef: MatDialogRef<GroupManagerComponent>) { }

  ngOnInit(): void {
  }

  createGroup() {
    const group: Group = {
      gid: uuidv4(),
      group_name: this.groupName,
      admin_uid: this.authService.userData.uid,
      is_public: this.isPublic
    }
    this.groupService.createGroup(group).then(() =>
      this.closeGroupMangerDialog());
  }

  closeGroupMangerDialog() {
    this.dialogRef.close(`Group '${this.groupName}' was created successfully.`);
  }
}
