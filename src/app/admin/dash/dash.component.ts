import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash',
  standalone: false,
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss',
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
export class DashComponent implements OnInit{
  recentReports: any[] = [];
  displayedColumns: string[] = ['title', 'status', 'date'];
  displayedColumnsWithActions: string[] = ['title', 'status', 'date', 'actions'];

  totalOpenspaces: number = 0;
  totalHistorys: number = 0;
  totalReport: number = 0;

  constructor(
    private opespace: OpenspaceService,
    private router: Router
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
    this.fetchRecentReports();
}

  fetchRecentReports() {
  this.opespace.getRecentReports().subscribe({
    next: (reports: any[]) => {
      const sortedReports = [...reports].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.recentReports = sortedReports.slice(0, 3);
    },
    error: (error) => {
      console.error('Error fetching recent reports', error);
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
