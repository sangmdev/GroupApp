import { Component, OnInit, Input } from '@angular/core';
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
  selectedGroup: Group;
  groupIsSelected = false;
  isMobile = false;
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private groupService: GroupService, public authService: AuthenticationService) { }

  ngOnInit(): void {
    if (window.screen.width < 577) { // 577px portrait
      this.isMobile = true;
    }
    this.getUserGroups();
  }

  openGroupManager() {
    const dialogRef = this.dialog.open(GroupManagerComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.endsWith("was created successfully.")) {
        this.groupManagerSuccessSnackBar(result);
        this.getUserGroups();
      }
      else if (result && result.endsWith("Please wait for group admin to approve.")) {
        this.groupManagerSuccessSnackBar(result);
      }
    });
  }

  groupManagerSuccessSnackBar(message) {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      panelClass: ['bg-success']
    });
  }

  // Get user's groups
  async getUserGroups() {
    this.userGroups = [];
    this.authService.getUserData();
    this.groupService.getGroupsByUser(this.authService.userData.uid).then(groups =>
      groups.forEach(async groupId => {
        this.userGroups.push(await this.groupService.getGroupByGroupId(groupId));
      }));
  }
}
