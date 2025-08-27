import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookingService } from '../../service/booking.service';
import { RegisterChairComponent } from '../register-chair/register-chair.component';
import { NotifyAllComponent } from '../notify-all/notify-all.component';
import { NotifySingleComponent } from '../notify-single/notify-single.component';
import { User } from '../../models/openspace.model';

@Component({
  selector: 'app-manage-chair',
  standalone: false,
  templateUrl: './manage-chair.component.html',
  styleUrl: './manage-chair.component.scss',
    animations: [
    trigger('tableEnterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class ManageChairComponent implements OnInit{

displayedColumns: string[] = ['username','street','actions'];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private wardexecutive: BookingService,
    private snackBar: MatSnackBar,
  ) {}

  openRegisterForm() {
    const dialogRef = this.dialog.open(RegisterChairComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Register form data:', result);
      }
    });
  }


  ngOnInit(): void {
    this.loadStreetLeaders();
  }


  loadStreetLeaders(): void {
    this.wardexecutive.getAllStreetLeaders().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Failed to load street leaders:', err);
        this.snackBar.open('Failed to load street leaders', 'Close', { duration: 3000 });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sendNotificationToAllAdmins() {
    const dialogRef = this.dialog.open(NotifyAllComponent, {
    width: '400px',
  });
  }

  sendNotificationToUser(user: any) {
  this.dialog.open(NotifySingleComponent, {
    width: '400px',
    data: { email: user.email } // Pass the email to the notification component
  });
}

  toggleStatus(user: any) {

}

deleteUser(user: any) {

}

}
