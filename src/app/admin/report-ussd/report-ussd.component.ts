import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-report-ussd',
  standalone: false,
  templateUrl: './report-ussd.component.html',
  styleUrl: './report-ussd.component.scss',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('tableEnterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('tableLeaveAnimation', [
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateX(-50px)' }))
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
export class ReportUssdComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['referenceNumber', 'openSpace', 'description', 'status', 'actions'];
  originalData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private openspace: OpenspaceService,
    private toastr: ToastrService,
    private router: Router,
    private bookingservice: BookingService
  ) {}

  ngOnInit(): void {
    this.loadreportussd();
  }

  loadreportussd() {
    this.openspace.getAllReportUssd().subscribe((data) => {
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

  confirmReport(report: any) {
    const reportId = report.id;

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to confirm this report.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(100, 100, 177)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.openspace.ConfirmReportUssd(reportId).subscribe({
          next: () => {
            Swal.fire({
              title: "Confirmed!",
              text: "The report has been confirmed and SMS sent.",
              icon: "success"
            });
            report.status = 'processed';

            this.dataSource.data = [...this.dataSource.data];
          },
          error: (err) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to confirm the report.",
              icon: "error"
            });
            console.error(err);
          }
        });
      }
    });
  }

  replyToReport(report: any) {
    Swal.fire({
      title: 'Reply to Reporter',
      input: 'text',
      customClass: {
      input: 'no-border'
      },
      inputLabel: 'Enter your reply message',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Send Reply',
      showLoaderOnConfirm: true,
      preConfirm: (message) => {
        if (!message) {
          Swal.showValidationMessage('Message is required');
          return;
        }

        // Send reply to backend
        return this.bookingservice.replyToReport(report.id, message).toPromise()
          .then(() => {
            return true;
          })
          .catch(() => {
            Swal.showValidationMessage('Failed to send reply. Please try again.');
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Reply sent successfully!'
        });
      }
    });
  }

  deleteReport(report: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'rgb(100, 100, 177)',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.bookingservice.deleteReport(report.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(r => r.id !== report.id);
          this.toastr.success('Report deleted successfully!');
          Swal.fire('Deleted!', 'The report has been deleted.', 'success');
        },
        error: () => {
          this.toastr.error('Failed to delete report.');
        }
      });
    }
  });
}

  // New helper methods for the enhanced UI
  getPendingReportsCount(): number {
    return this.dataSource.data.filter(report => report.status !== 'processed').length;
  }

  getProcessedReportsCount(): number {
    return this.dataSource.data.filter(report => report.status === 'processed').length;
  }

  getUniqueOpenSpaces(): string[] {
    const spaces = this.originalData.map(report => report.openSpace).filter(Boolean);
    return [...new Set(spaces)];
  }

  getShortDescription(description: string): string {
    if (!description) return 'No description';
    return description.length > 50 ? description.substring(0, 50) + '...' : description;
  }

  getStatusClass(status: string): string {
    return status === 'processed' ? 'processed' : 'pending';
  }

  getStatusIcon(status: string): string {
    return status === 'processed' ? 'check_circle' : 'schedule';
  }

  getStatusText(status: string): string {
    return status === 'processed' ? 'Processed' : 'Pending';
  }

  refreshData(): void {
    this.loadreportussd();
    this.toastr.success('USSD reports refreshed successfully', 'Success');
  }

  filterByStatus(status: string): void {
    if (status === 'all') {
      this.dataSource.data = this.originalData;
    } else if (status === 'pending') {
      this.dataSource.data = this.originalData.filter(report => report.status !== 'processed');
    } else if (status === 'processed') {
      this.dataSource.data = this.originalData.filter(report => report.status === 'processed');
    }
    this.dataSource._updateChangeSubscription();
  }

  filterByOpenSpace(space: string): void {
    if (space === 'all') {
      this.dataSource.data = this.originalData;
    } else {
      this.dataSource.data = this.originalData.filter(report => report.openSpace === space);
    }
    this.dataSource._updateChangeSubscription();
  }

  showFullDescription(report: any): void {
    Swal.fire({
      title: 'Full Description',
      text: report.description,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: 'rgb(100, 100, 177)'
    });
  }

  viewReportDetails(report: any): void {
    Swal.fire({
      title: `USSD Report #${report.referenceNumber}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Open Space:</strong> ${report.openSpace}</p>
          <p><strong>Description:</strong> ${report.description}</p>
          <p><strong>Status:</strong> ${report.status}</p>
          <p><strong>Reference Number:</strong> ${report.referenceNumber}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: 'rgb(100, 100, 177)',
      width: '500px'
    });
  }

}
