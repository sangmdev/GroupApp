import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupManagerComponent } from '../group-manager/group-manager.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Group } from '../interfaces/group';
import { GroupService } from '../services/group.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userGroups: Group[];
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private groupService: GroupService, public authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getUserGroups();
  }

  openGroupManager() {
    const dialogRef = this.dialog.open(GroupManagerComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.endsWith("successfully.")) {
        this.addGroupSuccessSnackBar(result);
        this.getUserGroups();
      }
    });
  }

  addGroupSuccessSnackBar(message) {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      panelClass: ['bg-success']
    });
  }

  // Get users
  async getUserGroups() {
    this.userGroups = [];
    this.authService.getUserData();
    this.groupService.getGroupsByUser(this.authService.userData.uid).then(test =>
      test.forEach(async groupId => {
        this.userGroups.push(await this.groupService.getGroupByGroupId(groupId));
      }));
  }
}
