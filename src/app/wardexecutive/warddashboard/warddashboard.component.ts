import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { Router } from '@angular/router';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-warddashboard',
  standalone: false,
  templateUrl: './warddashboard.component.html',
  styleUrl: './warddashboard.component.scss',
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
export class WarddashboardComponent implements OnInit{
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
  this.opespace.getDashboardCounts().subscribe({
    next: (result) => {
      // OpenSpaces counts
      this.totalOpenspaces = result.openspaces.total;
      this.availableOpenspaces = result.openspaces.available;
      this.unavailableOpenspaces = result.openspaces.unavailable;

      // Reports counts
      this.totalReportedReports = result.reports.reported;           // all reports received
      this.totalForwardedReports = result.reports.forwarded_to_admin; // reports forwarded to admin
      this.totalPendingReports = result.reports.pending;            // reports not yet forwarded

      // Ward info
      this.wardName = result.ward;
    },
    error: (err) => {
      console.error('Error fetching dashboard counts', err);
    }
  });

  this.loadRecentReports();
}




  loadRecentReports(): void {
    this.bookingService.getReportsByDistrict().subscribe({
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
    this.router.navigate(['/executive/available-report']);
  }
}
