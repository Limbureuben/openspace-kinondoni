import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, Marker, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OpenSpaceRegisterData, OpenspaceService } from '../../service/openspace.service';
import { error } from 'console';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-map-admin',
  standalone: false,
  templateUrl: './map-admin.component.html',
  styleUrl: './map-admin.component.scss'
})
export class MapAdminComponent implements OnInit {
  map: Map | undefined;
  showForm: boolean = false;
  lat: string = '';
  lng: string = '';
  region: string = '';
  district: string = '';
  marker: Marker | null = null;

  clickedLat: number | null = null;
  clickedLng: number | null = null;
  districts: { id: number; name: string }[] = [];
  // streets: string[] = [];
  streets: { id: number, name: string }[] = [];



  addOpenspace: FormGroup;

  // districts: string[] = ['Kinondoni', 'Ilala', 'Ubungo', 'Temeke', 'Kigamboni'];

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private openService: OpenspaceService,
    private authservice: AuthService
  ) {
    this.addOpenspace = this.fb.group({
      name: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      district: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
    }
     this.loadDistricts();
  }

  loadDistricts() {
    this.authservice.getAdminWards().subscribe({
      next: (wards) => {
        this.districts = wards;
      },
      error: err => console.error('Failed to load wards:', err)
    });
  }

  onDistrictChange(event: any) {
    const selectedDistrict = event.value || event.target?.value;

    if (!selectedDistrict) {
      this.streets = [];
      this.addOpenspace.controls['street'].setValue(null);
      return;
    }

    this.authservice.getStreetsByWard(selectedDistrict).subscribe({
      next: (streets) => {
        this.streets = streets;
        this.addOpenspace.controls['street'].setValue(null);
      },
      error: err => {
        console.error('Failed to load streets:', err);
        this.streets = [];
      }
    });
  }

  ngAfterViewInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
      center: [39.230099, -6.774133],
      zoom: 17
    });

    this.map.on('click', (event) => {
      const { lng, lat } = event.lngLat;
      this.clickedLat = lat;
      this.clickedLng = lng;

      // Approx. 15 meters in degrees
      const offset = 0.000135;

      const squareCoords = [
        [
          [lng - offset, lat + offset], // NW
          [lng + offset, lat + offset], // NE
          [lng + offset, lat - offset], // SE
          [lng - offset, lat - offset], // SW
          [lng - offset, lat + offset]
        ]
      ];

      const polygonData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: squareCoords
            }
          }
        ]
      };

      ['square-layer', 'square-border'].forEach(layerId => {
        if (this.map!.getLayer(layerId)) {
          this.map!.removeLayer(layerId);
        }
      });

      if (this.map!.getSource('square')) {
        this.map!.removeSource('square');
      }

      // Add new GeoJSON source
      this.map!.addSource('square', {
        type: 'geojson',
        data: polygonData as GeoJSON.FeatureCollection<GeoJSON.Geometry>
      });

      // Add fill layer
      this.map!.addLayer({
        id: 'square-layer',
        type: 'fill',
        source: 'square',
        layout: {},
        paint: {
          'fill-color': '#62CE5CFF',
          'fill-opacity': 0.3
        }
      });

      // Add border layer
      this.map!.addLayer({
        id: 'square-border',
        type: 'line',
        source: 'square',
        layout: {},
        paint: {
          'line-color': '#000000',
          'line-width': 2
        }
      });
    });
  }
}


  onSubmit() {
    if (this.addOpenspace.invalid) {
      this.addOpenspace.markAllAsTouched();
      return;
    }

    const openspaceData: OpenSpaceRegisterData = {
      name: this.addOpenspace.value.name,
      latitude: parseFloat(this.addOpenspace.value.latitude),
      longitude: parseFloat(this.addOpenspace.value.longitude),
      district: this.addOpenspace.value.district,
      street: this.addOpenspace.value.street
    };

    this.openService.addSpace(openspaceData).subscribe({
      next: (result) => {
        const response = result.data.addSpace.output;
        if (response.success) {
          this.toastr.success(response.message, 'Success', { positionClass: 'toast-top-right' });
          this.closeForm();
        }
      },
      error: () => {
        this.toastr.error('Something went wrong.', 'Error', { positionClass: 'toast-top-right' });
      }
    });
  }

  enableAddingMode() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  goBack() {
    this.router.navigate(['/admindashboard']);
  }

  changeMapStyle(styleName: string) {
    const styleUrl = `https://api.maptiler.com/maps/${styleName}/style.json?key=9rtSKNwbDOYAoeEEeW9B`;
    this.map?.setStyle(styleUrl);
  }
}












// export class MapAdminComponent implements OnInit {
//   map: Map | undefined;
//   showForm: boolean = false;
//   lat: string = '';
//   lng: string = '';
//   region: string = '';
//   district: string = '';
//   marker: Marker | null = null;

//   clickedLat: number | null = null;
//   clickedLng: number | null = null;

//   addOpenspace: FormGroup;

//   districts: string[] = ['Kinondoni', 'Ilala', 'Ubungo', 'Temeke', 'Kigamboni'];

//   @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private router: Router,
//     private fb: FormBuilder,
//     private toastr: ToastrService,
//     private openService: OpenspaceService
//   ) {
//     this.addOpenspace = this.fb.group({
//       name: ['', Validators.required],
//       latitude: ['', Validators.required],
//       longitude: ['', Validators.required],
//       district: ['', Validators.required]
//     })
//   }

//   ngOnInit(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       console.log("Running in the browser. Initializing API key.");
//       config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
//     }
//   }

//   ngAfterViewInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       this.map = new Map({
//         container: this.mapContainer.nativeElement,
//         style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
//         center: [39.230099, -6.774133],
//         zoom: 14
//       });

//       // Listen for click events on the map
//       this.map.on('click', (event) => {
//         const { lng, lat } = event.lngLat;
//         this.clickedLat = lat;
//         this.clickedLng = lng;

//         // Remove previous marker if it exists
//         if (this.marker) {
//           this.marker.remove();
//         }

//         this.marker = new Marker({ color: 'black', scale: 0.6 })
//           .setLngLat([lng, lat])
//           .addTo(this.map!);
//       });
//     }
//   }

//   onSubmit() {
//     if(this.addOpenspace.invalid) {
//       this.addOpenspace.markAllAsTouched();
//       return;
//     }

//     const openspaceData: OpenSpaceRegisterData = {
//       name: this.addOpenspace.value.name,
//       latitude: parseFloat(this.addOpenspace.value.latitude),
//       longitude: parseFloat(this.addOpenspace.value.longitude),
//       district: this.addOpenspace.value.district
//     };

//     console.log("Data being sent to mutation:", openspaceData);

//     this.openService.addSpace(openspaceData).subscribe({
//       next: (result) => {
//         console.log('GraphQL Response:', result);
//         const response = result.data.addSpace.output;

//         if(response.success) {
//           this.toastr.success(response.message, 'Success', { positionClass: 'toast-top-right' });

//           this.closeForm();
//         }
//       },
//       error: (error) => {
//         this.toastr.error('Something went wrong.', 'Error', { positionClass: 'toast-top-right' });
//       }

//     })
//   }

//   enableAddingMode() {
//     this.showForm = true;
//   }

//   closeForm() {
//     this.showForm = false;
//   }

//   goBack() {
//     this.router.navigate(['/admindashboard'])
//   }

//   changeMapStyle(styleName: string) {
//     const styleUrl = `https://api.maptiler.com/maps/${styleName}/style.json?key=9rtSKNwbDOYAoeEEeW9B`;
//     this.map?.setStyle(styleUrl);
//   }
// }
