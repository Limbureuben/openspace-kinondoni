import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-history',
  standalone: false,
  templateUrl: './report-history.component.html',
  styleUrl: './report-history.component.scss',
  animations: [
    // Slide table from right when opening
    trigger('tableEnterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Animate row additions & deletions
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
export class ReportHistoryComponent implements OnInit{
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['reportId', 'description', 'createdAt', 'status', 'actions'];
  originalData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private openSpaceService: OpenspaceService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {
      this.loadReport()
  }

  loadReport() {
    this.openSpaceService.getAllHistory().subscribe((data) => {
      this.dataSource.data = data;
      this.originalData = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  confirmReport(reportId: string) {
    this.openSpaceService.confirmReport(reportId).subscribe(() => {
      this.loadReport();
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

  // New helper methods for the enhanced UI
  getCompletedReportsCount(): number {
    return this.dataSource.data.length; // All history records are completed
  }

  getRecentHistoryCount(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.dataSource.data.filter(report => {
      const reportDate = new Date(report.createdAt);
      return reportDate >= oneMonthAgo;
    }).length;
  }

  getShortDescription(description: string): string {
    if (!description) return 'No description available';
    return description.length > 60 ? description.substring(0, 60) + '...' : description;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTimeAgo(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  refreshData(): void {
    this.loadReport();
    this.toastr.success('Report history refreshed successfully', 'Success');
  }

  filterByDateRange(range: string): void {
    const now = new Date();
    let filteredData = this.originalData;

    switch (range) {
      case 'today':
        filteredData = this.originalData.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredData = this.originalData.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate >= oneWeekAgo;
        });
        break;
      case 'month':
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filteredData = this.originalData.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate >= oneMonthAgo;
        });
        break;
      case 'quarter':
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        filteredData = this.originalData.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate >= threeMonthsAgo;
        });
        break;
      default:
        filteredData = this.originalData;
    }

    this.dataSource.data = filteredData;
    this.dataSource._updateChangeSubscription();
  }

  sortBy(sortType: string): void {
    let sortedData = [...this.dataSource.data];

    switch (sortType) {
      case 'newest':
        sortedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sortedData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'reportId':
        sortedData.sort((a, b) => a.reportId.localeCompare(b.reportId));
        break;
    }

    this.dataSource.data = sortedData;
    this.dataSource._updateChangeSubscription();
  }

  showFullDescription(report: any): void {
    Swal.fire({
      title: `Report #${report.reportId}`,
      text: report.description,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: 'rgb(100, 100, 177)'
    });
  }

  viewReportDetails(report: any): void {
    Swal.fire({
      title: `Report Details - #${report.reportId}`,
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Report ID:</strong> ${report.reportId}</p>
          <p><strong>Description:</strong> ${report.description}</p>
          <p><strong>Completion Date:</strong> ${this.formatDate(report.createdAt)}</p>
          <p><strong>Status:</strong> <span style="color: green;">Completed</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: 'rgb(100, 100, 177)',
      width: '500px'
    });
  }

  downloadReport(report: any): void {
    this.toastr.info('Download feature will be implemented soon', 'Info');
  }

  viewTimeline(report: any): void {
    this.toastr.info('Timeline view feature coming soon', 'Info');
  }

  duplicateReport(report: any): void {
    this.toastr.info('Duplicate report feature coming soon', 'Info');
  }

  exportToPDF(report: any): void {
    this.toastr.info('PDF export feature coming soon', 'Info');
  }

  archiveReport(report: any): void {
    this.toastr.warning('Archive feature requires confirmation', 'Warning');
  }

}
