import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookingService } from '../../service/booking.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-available-report',
  standalone: false,
  templateUrl: './available-report.component.html',
  styleUrl: './available-report.component.scss',
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
export class AvailableReportComponent   implements OnInit{
    dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['report_id','space_name','street','message', 'status', 'actions'];
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
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {
  this.loadForwardedReport();
  }

loadForwardedReport() {
    this.isLoading = true;
    this.bookingService.getReportsByDistrict().subscribe({
      next: (data) => {
        console.log('Loaded forwarded reports data:', data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.toastr.error('Failed to load reports', 'Error', {
          positionClass: 'toast-top-right',
          timeOut: 3000
        });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // viewReport(report: any): void {
  //   this.dialog.open(AvailableBookingComponent, {
  //     data: report,
  //   });
  // }

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



  forwardReport(forwardedReport: any): void {
  console.log('Forward report called with data:', forwardedReport);

  // Check if report is already forwarded to admin
  if (forwardedReport.forwarded_to_admin) {
    this.toastr.info('This report has already been forwarded to admin.', 'Info', {
      positionClass: 'toast-top-right',
      timeOut: 3000
    });
    return;
  }

  // Ensure forwardId exists
  const forwardId = forwardedReport.id;
  if (!forwardId) {
    this.toastr.error('Forward ID is missing. Cannot forward.', 'Error', {
      positionClass: 'toast-top-right',
      timeOut: 3000
    });
    console.error('Missing forward ID:', forwardedReport);
    return;
  }

  // Prepare the report message
  const reportMessage = forwardedReport.message || forwardedReport.report?.message || '';
  const messagePreview = reportMessage
    ? `<br><br><strong>Report Message:</strong><br>"${reportMessage}"`
    : '<br><em>No message in this report.</em>';

  const reportId = forwardedReport.report?.report_id || forwardedReport.report_id;

  Swal.fire({
    title: 'Forward Report to Admin',
    html: `
      <p>Are you sure you want to forward this report (ID: ${reportId}) to the admin?</p>
      ${messagePreview}
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Forward it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.performForwardReport(forwardId, reportMessage);
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
      this.loadForwardedReport();

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





replyReport(report: any): void {
  console.log('Reply to report:', report);
  this.selectedReport = report;
  this.showPopup = true;
}


}
