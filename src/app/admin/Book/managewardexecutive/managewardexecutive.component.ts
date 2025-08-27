import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RegisterWardComponent } from '../register-ward/register-ward.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BookingService } from '../../../service/booking.service';
import { NotificationComponent } from '../notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { NotificationSingleComponent } from '../notification-single/notification-single.component';

@Component({
  selector: 'app-managewardexecutive',
  standalone: false,
  templateUrl: './managewardexecutive.component.html',
  styleUrl: './managewardexecutive.component.scss',
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
export class ManagewardexecutiveComponent implements OnInit{

  displayedColumns: string[] = ['ward', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  originalData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private wardexecutive: BookingService,
    private snackBar: MatSnackBar,
  ) {}

  openRegisterForm() {

    const dialogRef = this.dialog.open(RegisterWardComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Register form data:', result);
      }
    });
  }

  ngOnInit() {
    this.loadExecutives();
  }

  loadExecutives() {
    this.wardexecutive.getAllExecutives().subscribe((data) =>{
      this.dataSource.data = data;
      this.originalData = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
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
    const dialogRef = this.dialog.open(NotificationComponent, {
    width: '400px',
  });
  }

  sendNotificationToUser(user: any) {
    this.dialog.open(NotificationSingleComponent, {
      width: '400px',
      data: { email: user.email }
    });
  }

  toggleStatus(user: any) {
    // Toggle user status logic here
    user.isActive = !user.isActive;
    this.snackBar.open(`Executive ${user.isActive ? 'activated' : 'deactivated'} successfully`, 'Close', {
      duration: 3000
    });
  }

  deleteUser(user: any) {
    // Delete user logic here
    console.log('Delete user:', user);
  }

  // New helper methods for the enhanced UI
  getActiveExecutivesCount(): number {
    return this.dataSource.data.filter(exec => exec.isActive !== false).length;
  }

  getInactiveExecutivesCount(): number {
    return this.dataSource.data.filter(exec => exec.isActive === false).length;
  }

  getUniqueWardsCount(): number {
    const wards = this.dataSource.data.map(exec => exec.ward).filter(Boolean);
    return new Set(wards).size;
  }

  getUniqueWards(): string[] {
    const wards = this.originalData.map(exec => exec.ward).filter(Boolean);
    return [...new Set(wards)];
  }

  getStatusClass(isActive: boolean): string {
    return isActive !== false ? 'active' : 'inactive';
  }

  getStatusIcon(isActive: boolean): string {
    return isActive !== false ? 'check_circle' : 'cancel';
  }

  getStatusText(isActive: boolean): string {
    return isActive !== false ? 'Active' : 'Inactive';
  }

  getToggleButtonTitle(isActive: boolean): string {
    return isActive !== false ? 'Deactivate executive' : 'Activate executive';
  }

  refreshData(): void {
    this.loadExecutives();
    this.snackBar.open('Ward executives refreshed successfully', 'Close', {
      duration: 3000
    });
  }

  filterByStatus(status: string): void {
    if (status === 'all') {
      this.dataSource.data = this.originalData;
    } else if (status === 'active') {
      this.dataSource.data = this.originalData.filter(exec => exec.isActive !== false);
    } else if (status === 'inactive') {
      this.dataSource.data = this.originalData.filter(exec => exec.isActive === false);
    }
    this.dataSource._updateChangeSubscription();
  }

  filterByWard(ward: string): void {
    if (ward === 'all') {
      this.dataSource.data = this.originalData;
    } else {
      this.dataSource.data = this.originalData.filter(exec => exec.ward === ward);
    }
    this.dataSource._updateChangeSubscription();
  }

  viewExecutiveProfile(user: any): void {
    console.log('View executive profile:', user);
    this.snackBar.open('Profile view feature coming soon', 'Close', {
      duration: 3000
    });
  }

  editExecutive(user: any): void {
    console.log('Edit executive:', user);
    this.snackBar.open('Edit feature coming soon', 'Close', {
      duration: 3000
    });
  }

  resetPassword(user: any): void {
    console.log('Reset password for:', user);
    this.snackBar.open('Password reset feature coming soon', 'Close', {
      duration: 3000
    });
  }

  viewActivity(user: any): void {
    console.log('View activity for:', user);
    this.snackBar.open('Activity view feature coming soon', 'Close', {
      duration: 3000
    });
  }

  changePermissions(user: any): void {
    console.log('Change permissions for:', user);
    this.snackBar.open('Permissions feature coming soon', 'Close', {
      duration: 3000
    });
  }

  deleteExecutive(user: any): void {
    console.log('Delete executive:', user);
    this.snackBar.open('Delete feature requires confirmation', 'Close', {
      duration: 3000
    });
  }

}
