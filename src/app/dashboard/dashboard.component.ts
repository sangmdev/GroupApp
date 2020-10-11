import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupManagerComponent } from '../group-manager/group-manager.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  openGroupManager() {
    const dialogRef = this.dialog.open(GroupManagerComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result.endsWith("successfully.")) {
        this.addGroupSuccessSnackBar(result);
      }
    });
  }

  addGroupSuccessSnackBar(message) {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      panelClass: ['bg-success']
    });
  }
}
