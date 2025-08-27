import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-availablespace',
  standalone: false,
  templateUrl: './availablespace.component.html',
  styleUrl: './availablespace.component.scss',
  animations: [
    // Slide table from right when opening
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
export class AvailablespaceComponent implements OnInit{

  displayedColumns: string[] = ['name', 'district', 'coordinates', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  originalData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private openSpaceService: OpenspaceService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.loadOpenSpaces();
  }

  loadOpenSpaces() {
    this.openSpaceService.getAllOpenSpacesAdmin().subscribe((data) => {
      this.dataSource.data = data;
      this.originalData = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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


  deleteOpenSpaceWithConfirmation(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(100, 100, 177)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteOpenSpace(id);
      }
    });
  }

  deleteOpenSpace(id: string) {
    this.openSpaceService.deleteOpenSpace(id).subscribe(() => {
      // Filter the data source after deletion
      this.dataSource.data = this.dataSource.data.filter(space => space.id !== id);

      Swal.fire({
        title: "Deleted!",
        text: "Openspace delete successfully",
        icon: "success"
      });
    });
  }

  editOpenSpace() {

  }

  toggleStatus(space: any) {
    const newStatus = !space.isActive;
    this.openSpaceService.toggleOpenSpaceStatus(space.id, newStatus)
      .subscribe(updatedSpace => {
        const index = this.dataSource.data.findIndex(s => s.id === space.id);
        if (index !== -1) {
          this.dataSource.data[index].isActive = updatedSpace.isActive;
        }
        this.dataSource._updateChangeSubscription();
        this.paginator.firstPage();
      });
  }

  getActiveSpacesCount(): number {
    return this.dataSource.data.filter(space => space.isActive).length;
  }

  refreshData(): void {
    this.loadOpenSpaces();
    this.toastr.success('Data refreshed successfully', 'Success');
  }

  filterByStatus(status: string): void {
    if (status === 'all') {
      this.dataSource.data = this.originalData;
    } else if (status === 'active') {
      this.dataSource.data = this.originalData.filter(space => space.isActive);
    } else if (status === 'inactive') {
      this.dataSource.data = this.originalData.filter(space => !space.isActive);
    }
    this.dataSource._updateChangeSubscription();
  }

}
