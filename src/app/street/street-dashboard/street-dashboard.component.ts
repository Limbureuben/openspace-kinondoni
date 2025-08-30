import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { Router } from '@angular/router';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-street-dashboard',
  standalone: false,
  templateUrl: './street-dashboard.component.html',
  styleUrl: './street-dashboard.component.scss',
  animations: [
    trigger('cardStagger', [
      transition(':enter', [
        query('.dashboard-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class StreetDashboardComponent implements OnInit{
    recentReports: any[] = [];
    displayedColumnsWithActions: string[] = ['space_name', 'status', 'street', 'actions'];

  totalOpenspaces: number = 0;
  totalHistorys: number = 0;
  totalReport: number = 0;
    isLoading: boolean = false;
    availableOpenspaces: number = 0
    unavailableOpenspaces: number = 0;
    totalForwardedReports: number = 0;
    totalReportsAll: number = 0;
    totalReportedReports: number = 0;
    totalPendingReports: number = 0;

    wardName: String = '';

  constructor(
    private opespace: OpenspaceService,
    private router: Router,
    private bookingService: BookingService,
  ) {}


  ngOnInit(): void {
    this.opespace.getOpenspaceCount().subscribe({
      next: (result) => {
        this.totalOpenspaces = result.data.totalOpenspaces;
      },
      error: (err) => {
        console.error('Error fetching total open spaces', 'err')
      }
    });

    this.opespace.getAllHistoryReport().subscribe({
      next: (result) => {
        this.totalHistorys = result.data.totalHistorys;
      },
      error: (error)=> {
        console.error('Error fetching the report history')
      }
    });

    this.opespace.getAllReportPending().subscribe({
      next: (result) => {
        this.totalReport = result.data.totalReport;
      },
      error: (error) => {
        console.error('Error fetching report pending')
      }
    });
    this.loadRecentReports();
}

loadRecentReports(): void {
    this.bookingService.getReportsByStreet().subscribe({
      next: (data) => {
        // assuming data is an array of reports
        this.recentReports = data
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // sort by date desc
          .slice(0, 3); // take only 3 latest
      },
      error: (err) => {
        console.error('Error fetching reports', err);
        this.recentReports = [];
      }
    });
  }




OpenAvailableSpaces() {
  this.router.navigate(['/admin/openspace']);
}

OpenSolvedIssues() {
  this.router.navigate(['/admin/history']);
}

OpenPendingIssues() {
  this.router.navigate(['/admin/reports']);
}

viewReportDetails(report: any) {
  console.log('Viewing report details:', report);
  // Navigate to report details or open modal
  // this.router.navigate(['/admin/reports', report.id]);
}

}
