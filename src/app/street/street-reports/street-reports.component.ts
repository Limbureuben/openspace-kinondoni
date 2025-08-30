import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookingService } from '../../service/booking.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
import { OpenspaceService } from '../../service/openspace.service';
import { ReplyDialogComponent } from '../reply-dialog/reply-dialog.component';

@Component({
  selector: 'app-street-reports',
  standalone: false,
  templateUrl: './street-reports.component.html',
  styleUrl: './street-reports.component.scss',
  animations: [
    trigger('fadeScale', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition(':enter', [
        animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('tableEnterAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('rowAnimation', [
      state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),
      transition(':enter', [
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class StreetReportsComponent {
   dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['space_name', 'district', 'street', 'created_at', 'actions'];
  // displayedColumns: string[] = ['space', 'username', 'contact', 'date', 'duration', 'purpose', 'district', 'file', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedReport: any = null;
  showPopup: boolean = false;
  backendUrl = 'http://localhost:8000';
  isLoading: boolean = false;

  constructor(
    private bookingService: BookingService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private reportService: OpenspaceService
  ) {}


  ngOnInit(): void {
  this.loadStreetReports();
  }

  loadStreetReports() {
    this.isLoading = true;
    this.bookingService.getStreetReports().subscribe({
      next: (reports) => {
        this.dataSource.data = reports;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading street reports', err);
        this.toastr.error('Failed to load reports');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  closePopup(): void {
  this.showPopup = false;
  this.selectedReport = null;
}

  getFullFileUrl(filePath: string): string {
      if (!filePath) return '';
      return `${this.backendUrl}${filePath}`;
  }


  confirmReport(reportId: number): void {
    console.log('Confirming booking:', reportId);
  }

forwardReport(row: any) {
    this.reportService.forwardReportToWard(row.id).subscribe({
      next: (res) => {
        this.snackBar.open(res.message || 'Report forwarded', 'Close', { duration: 3000 });
        // Mark as forwarded to disable button
        row.forwarded_to_admin = true;
      },
      error: (err) => {
        this.snackBar.open(err.error?.error || 'Failed to forward report', 'Close', { duration: 4000 });
      }
    });
  }


private performForwardReport(forwardId: number, message: string = ''): void {
  this.isLoading = true;
  console.log('Forwarding report with forwardId:', forwardId, 'and message:', message);

  this.bookingService.forwardReportToAdmin(forwardId, message).subscribe({
    next: () => {
      this.toastr.success('Report forwarded to admin successfully!', 'Success', {
        positionClass: 'toast-top-right',
        timeOut: 3000
      });

      // Refresh the table
      this.loadStreetReports();
      Swal.fire({
        title: 'Forwarded!',
        text: 'The report has been successfully forwarded to the admin.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error forwarding report:', error);

      let errorMessage = 'Failed to forward report to admin.';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.toastr.error(errorMessage, 'Error', {
        positionClass: 'toast-top-right',
        timeOut: 5000
      });

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });

      this.isLoading = false;
    }
  });
}


viewReportDetails(report: any) {
   const normalized = report.report ? report.report : report;

    this.dialog.open(ReportDialogComponent, {
      width: '500px',
      data: normalized
    });
  }

  

replyReport(row: any) {
  const dialogRef = this.dialog.open(ReplyDialogComponent, {
    width: '400px',
    data: { reportId: row.report_id }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // The dialog already sent the reply, just show feedback
      this.snackBar.open('Reply sent successfully!', 'Close', { duration: 3000 });

      // Optionally refresh your report list
      this.loadStreetReports();
    }
  });
}





}
