import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map-common',
  standalone: false,
  templateUrl: './map-common.component.html',
  styleUrl: './map-common.component.scss'
})
export class MapCommonComponent implements OnInit {
  map!: google.maps.Map;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Check if running in browser
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initMap(); // Directly initialize the map
    }
  }

  private loadGoogleMapsScript(): void {
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    (window as any).initMap = () => this.initMap(); // Set initMap function
  }

  private initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 40, lng: -74.5 },
      zoom: 9
    };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      mapOptions
    );
  }
}
