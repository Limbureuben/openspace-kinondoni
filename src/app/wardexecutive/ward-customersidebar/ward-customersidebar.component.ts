import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  color?: string;
}

@Component({
  selector: 'app-ward-customersidebar',
  standalone: false,
  templateUrl: './ward-customersidebar.component.html',
  styleUrl: './ward-customersidebar.component.scss'
})
export class WardCustomersidebarComponent {
  MenuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: 'ward-bookings', color: 'rgb(100, 100, 177)' },
    { icon: 'map', label: 'Map', route: '#', color: 'rgb(100, 100, 177)' },
    { icon: 'supervisor_account', label: 'ChairPerson', route: 'manage-chair', color: 'rgb(100, 100, 177)' },
    { icon: 'report', label: 'Reports', route: 'available-report', color: 'rgb(100, 100, 177)' },
    { icon: 'notifications', label: 'Notifications', route: '#', color: 'rgb(100, 100, 177)' },
    { icon: 'logout', label: 'Logout', color: 'rgb(100, 100, 177)' }
  ])

  constructor(
    private toastr: ToastrService,
    private router: Router
  ){}

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.toastr.success('Logout success', '', {
      timeOut: 1500,
      progressBar: true,
      positionClass: 'toast-top-right'
    });
    setTimeout(() => {
      this.router.navigate(['/user-home']);
    }, 1500);
  }
}
