import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ViewReportComponent } from '../view-report/view-report.component';
import Swal from 'sweetalert2';
import { ReplyComponent } from '../reply/reply.component';

@Component({
  selector: 'app-availablereport',
  standalone: false,
  templateUrl: './availablereport.component.html',
  styleUrl: './availablereport.component.scss',
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
export class AvailablereportComponent implements OnInit{
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'report_id', 'space_name', 'location', 'from_user', 'status', 'actions'];
  originalData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private openSpaceService: OpenspaceService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
      this.loadReport();
  }

  loadReport() {
    this.openSpaceService.getAllReports().subscribe((data) => {
      this.dataSource.data = data;
      this.originalData = data;
      this.dataSource.paginator = this.paginator;
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

  confirmReport(reportId: string): void {
    // Create the SweetAlert with Bootstrap buttons
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: true
    });

    // Show SweetAlert with confirmation buttons
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
      confirmButtonColor: "rgb(100, 100, 177)",
      cancelButtonColor: "#d33",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the mutation to confirm the report
        this.openSpaceService.confirmReport(reportId).subscribe(response => {
          if (response.data.confirmReport.success) {
            // Show success message with SweetAlert
            swalWithBootstrapButtons.fire({
              title: "Confirmed!",
              text: "The report has been confirmed.",
              icon: "success"
            });
            // Optionally, reload the report list or update the UI
            this.loadReport();
          } else {
            // Show failure message with SweetAlert
            swalWithBootstrapButtons.fire({
              title: "Failed!",
              text: "The report could not be confirmed.",
              icon: "error"
            });
          }
        }, error => {
          // Show error message with SweetAlert in case of backend error
          swalWithBootstrapButtons.fire({
            title: "Error!",
            text: "There was an error confirming the report.",
            icon: "error"
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Show cancellation message with SweetAlert
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "The report has not been confirmed.",
          icon: "error"
        });
      }
    });
  }


  markAsPending(reportId: string): void {
    console.log('Deleting Report:', reportId);
  }

  viewReport(report: any): void {
    this.dialog.open(ViewReportComponent, {
      data: report,
    });
}

  // New helper methods for the enhanced UI
  getPendingReportsCount(): number {
    return this.dataSource.data.length;
  }

  getRecentReportsCount(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.dataSource.data.filter(report => {
      const reportDate = new Date(report.created_at || report.createdAt);
      return reportDate >= oneWeekAgo;
    }).length;
  }

  getReportDate(report: any): string {
    const date = new Date(report.created_at || report.createdAt || Date.now());
    return date.toLocaleDateString();
  }

  getUniqueDistricts(): string[] {
    const districts = this.originalData.map(report => report.district).filter(Boolean);
    return [...new Set(districts)];
  }

  refreshData(): void {
    this.loadReport();
    this.toastr.success('Reports refreshed successfully', 'Success');
  }

  filterByStatus(status: string): void {
    if (status === 'all') {
      this.dataSource.data = this.originalData;
    } else if (status === 'pending') {
      this.dataSource.data = this.originalData;
    } else if (status === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      this.dataSource.data = this.originalData.filter(report => {
        const reportDate = new Date(report.created_at || report.createdAt);
        return reportDate >= oneWeekAgo;
      });
    }
    this.dataSource._updateChangeSubscription();
  }

  filterByDistrict(district: string): void {
    if (district === 'all') {
      this.dataSource.data = this.originalData;
    } else {
      this.dataSource.data = this.originalData.filter(report => report.district === district);
    }
    this.dataSource._updateChangeSubscription();
  }

  replyToReport(report: any): void {
    console.log('Report id is this', report.id)
    const dialogRef = this.dialog.open(ReplyComponent, {
      width: '600px',
      data: { report }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Reply sent successfully', 'Success');
      }
    });
  }

  
  markAsResolved(report: any): void {
    console.log('Mark as resolved:', report);
    this.toastr.success('Report marked as resolved', 'Success');
  }

  assignToTeam(report: any): void {
    console.log('Assign to team:', report);
    this.toastr.info('Team assignment feature coming soon', 'Info');
  }

  exportReport(report: any): void {
    console.log('Export report:', report);
    this.toastr.info('Export feature coming soon', 'Info');
  }

  deleteReport(report: any): void {
    console.log('Delete report:', report);
    this.toastr.warning('Delete feature requires confirmation', 'Warning');
  }

}
