import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { OpenspaceService } from '../../service/openspace.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { response } from 'express';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Feature, Polygon } from 'geojson';



@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  searchQuery: string = '';
  suggestions: any[] = [];
  locationName: string = '';
  selectedSpace: any = null;
  openSpaces: any[] = [];
  emailWarning: boolean = false;
  showConfirmationModal = false;


  message: string = '';

  reportForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  submitting = false;
  success = false;
  errorMessage = '';
  reportId: string = '';

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private openSpaceService: OpenspaceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService,
) {
  this.reportForm = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(20)]],
    email: ['', [Validators.email]],
  });
}


  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';

    this.reportForm.valueChanges.subscribe(() => {
      const email = this.reportForm.get('email')?.value;
      this.emailWarning = !email; // Show warning if email is empty
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
      this.fetchOpenSpaces();

      // Add event listener to close form button
      document.getElementById('closeFormBtn')?.addEventListener('click', () => {
        this.closeForm();
      });
    }
  }

  initializeMap(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
      center: [39.230099, -6.774133],
      zoom: 14
    });
  }

  fetchOpenSpaces(): void {
    this.openSpaceService.getAllOpenSpacesUser().subscribe(
      (data) => {
        this.openSpaces = data;
        this.addMarkersToMap();
      },
      (error) => {
        console.error('Error fetching open spaces:', error);
      }
    );
  }

addMarkersToMap(): void {
  this.map?.on('load', () => {
    // Load the icon image first
    (this.map as any).loadImage('assets/images/location.png')
      .then((image: any) => {
        if (!this.map?.hasImage('space-icon')) {
          this.map?.addImage('space-icon', image);
        }
        // Now loop through open spaces and render each
        this.openSpaces.forEach(space => {
          const size = 0.00025; // Approx 50m square
          const coordinates = [
            [
              [space.longitude - size, space.latitude - size],
              [space.longitude + size, space.latitude - size],
              [space.longitude + size, space.latitude + size],
              [space.longitude - size, space.latitude + size],
              [space.longitude - size, space.latitude - size]
            ]
          ];

          const polygonGeoJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: coordinates
            },
            properties: {
              name: space.name,
              latitude: space.latitude,
              longitude: space.longitude,
              street: space.street,
            }
          };

          const sourceId = `space-${space.name}-${space.latitude}`;
          const iconSourceId = `${sourceId}-icon`;

          // Add polygon source/layers
          if (!this.map?.getSource(sourceId)) {
            this.map?.addSource(sourceId, {
              type: 'geojson',
              data: polygonGeoJSON
            });

            this.map?.addLayer({
              id: sourceId,
              type: 'fill',
              source: sourceId,
              paint: {
                'fill-color': '#008000',
                'fill-opacity': 0.5
              }
            });

            this.map?.addLayer({
              id: `${sourceId}-border`,
              type: 'line',
              source: sourceId,
              paint: {
                'line-color': '#000000',
                'line-width': 1
              }
            });
          }

          // Add icon marker (as symbol layer)
          const pointGeoJSON: GeoJSON.Feature<GeoJSON.Point> = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [space.longitude, space.latitude]
            },
            properties: {
              title: space.name
            }
          };

          if (!this.map?.getSource(iconSourceId)) {
            this.map?.addSource(iconSourceId, {
              type: 'geojson',
              data: pointGeoJSON
            });

            this.map?.addLayer({
              id: `${iconSourceId}-layer`,
              type: 'symbol',
              source: iconSourceId,
              layout: {
                'icon-image': 'space-icon',
                'icon-size': 0.5, // adjust this if original image is not 50px
                'icon-anchor': 'center',
                'icon-allow-overlap': true
              }
            });
          }

          // // Events
          // this.map?.on('click', sourceId, () => {
          //   console.log('Square clicked for:', space.name);
          //   this.openReportForm(space);
          // });

          this.map?.on('click', sourceId, (e) => {
            const popupContent = document.createElement('div');
            popupContent.innerHTML = `
            <div style="
              font-family: sans-serif;
              padding: 4px 6px;
              font-size: 14px;
              color: #333;
              max-width: 240px;
            ">
              <div><strong>Name:</strong> ${space.name}</div>
              <div><strong>Kata:</strong> ${space.district}</div>
              <div><strong>Mtaa:</strong> ${space.street}</div>

              <div style="margin-top: 8px;">
                <button id="report-btn-${space.id}" style="
                  background-color: #1976d2;
                  color: #fff;
                  border: none;
                  padding: 5px 12px;
                  font-size: 13px;
                  border-radius: 3px;
                  cursor: pointer;
                " onmouseover="this.style.backgroundColor='#155fa0'" onmouseout="this.style.backgroundColor='#1976d2'">
                  Report
                </button>
              </div>
            </div>
          `;
            const popup = new Popup({ closeOnClick: true })
              .setLngLat([space.longitude, space.latitude])
              .setDOMContent(popupContent)
              .addTo(this.map!);

            setTimeout(() => {
              const reportBtn = document.getElementById(`report-btn-${space.id}`);
              if (reportBtn) {
                reportBtn.addEventListener('click', () => {
                  popup.remove(); // Close the popup
                  this.openReportForm(space); // Your form method
                });
              }
            }, 100);
          });



          this.map?.on('mouseenter', sourceId, () => {
            this.map!.getCanvas().style.cursor = 'pointer';
          });

          this.map?.on('mouseleave', sourceId, () => {
            this.map!.getCanvas().style.cursor = '';
          });
        });
      })
      .catch((error: any) => {
        throw error;
      });
  });
}




  ngOnDestroy() {
    this.map?.remove();
  }

  openReportForm(space: any) {
    this.selectedSpace = space;
    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    const locationName = document.getElementById('location-name') as HTMLElement;

    if (locationName) {
      locationName.textContent = space.name; // Bind location name
    } else {
      console.error('Location or region element not found');
    }

    if (formContainer) {
      console.log('Opening form for:', space.name);
      formContainer.style.display = 'flex';

      setTimeout(() => {
        formContainer.classList.add('open');
      }, 20);
    } else {
      console.error('Form container not found');
    }
  }

  closeForm() {
    const formContainer = document.getElementById('detailsForm') as HTMLElement;

    if (formContainer) {
      formContainer.classList.add('closing');

      // Wait for animation to complete before hiding
      setTimeout(() => {
        formContainer.classList.remove('open', 'closing');
        formContainer.style.display = 'none';
      }, 300); // Matches CSS transition duration
    }
  }

triggerFileInput() {
  document.getElementById('file-upload')?.click();
}

  fetchSuggestions() {
    if (!this.searchQuery) {
      this.suggestions = [];
      return;
    }

    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=9rtSKNwbDOYAoeEEeW9B&country=TZ`)
      .then(res => res.json())
      .then(data => {
        this.suggestions = data.features.map((feature: any) => ({
          name: feature.place_name,
          center: feature.center
        }));
      })
      .catch(err => console.error("Error fetching suggestions:", err));
  }

  searchLocation() {
    if (!this.searchQuery) return;

    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=9rtSKNwbDOYAoeEEeW9B&country=TZ`)
      .then(res => res.json())
      .then(data => {
        if (data.features.length > 0) {
          const { center } = data.features[0];
          this.map?.flyTo({ center, zoom: 14 });
        }
      })
      .catch(err => console.error("Error fetching location:", err));
  }

  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.name;
    this.map?.flyTo({ center: suggestion.center, zoom: 14 });
    this.suggestions = [];
  }


  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     this.selectedFileName = file.name;
  //   } else {
  //     this.selectedFile = null;
  //     this.selectedFileName = '';
  //   }
  // }

// submitReport(): void {
//   const userId = localStorage.getItem('user_id');

//   if (this.reportForm.invalid) {
//     Object.keys(this.reportForm.controls).forEach(key => {
//       const control = this.reportForm.get(key);
//       control?.markAsTouched();
//     });
//     return;
//   }

//   this.closeForm();
//   this.showConfirmationModal = true;
// }

// confirmSubmission(): void {
//   console.log('Confirm clicked');
//   const startTime = Date.now();

//   const userId = localStorage.getItem('userId');
//   this.submitting = true;
//   this.success = false;
//   this.errorMessage = '';

//   console.log('Before file upload');

//   this.openSpaceService.uploadFile(this.selectedFile)
//     .pipe(
//       switchMap(response => {
//         console.log('File upload finished in', Date.now() - startTime, 'ms');
//         const reportData = {
//           description: this.reportForm.get('description')?.value,
//           email: this.reportForm.get('email')?.value || null,
//           filePath: response.file_path || null,
//           spaceName: this.selectedSpace.name,
//           district: this.selectedSpace.district,
//           street: this.selectedSpace.street,
//           latitude: this.selectedSpace.latitude,
//           longitude: this.selectedSpace.longitude,
//           userId: userId || null
//         };

//         console.log('Submitting report with data:', reportData);
//         return this.openSpaceService.createReport(
//           reportData.description,
//           reportData.email,
//           reportData.filePath,
//           reportData.spaceName,
//           reportData.district,
//           reportData.street,
//           reportData.latitude,
//           reportData.longitude,
//           reportData.userId
//         );
//       })
//     )
//     .subscribe({
//       next: (response) => {
//         console.log('Report created successfully in', Date.now() - startTime, 'ms');
//         this.submitting = false;
//         this.success = true;
//         this.reportId = response.createReport.report.reportId;

//         Swal.fire({
//           title: `Report of ID ${this.reportId} has been submitted successfully!`,
//           icon: "success",
//           draggable: true,
//           customClass: {
//             title: 'custom-title',
//             popup: 'custom-popup'
//           }
//         });
//         this.showConfirmationModal = false;

//         setTimeout(() => {
//           this.closeForm();
//           this.resetForm();
//         }, 1000);
//       },
//       error: (error) => {
//         console.error('Error submitting report:', error);
//         this.submitting = false;
//         this.errorMessage = 'Failed to submit report. Please try again.';
//         this.toastr.error('Error submitting report', 'Error', {
//           positionClass: 'toast-top-right',
//         });
//       }
//     });
// }

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    this.selectedFileName = file.name;
  } else {
    this.selectedFile = null;
    this.selectedFileName = '';
  }
}


submitReport(): void {
  if (this.reportForm.invalid) {
    Object.keys(this.reportForm.controls).forEach(key => {
      const control = this.reportForm.get(key);
      control?.markAsTouched();
    });
    return;
  }

  this.closeForm(); // Optional to close form first
  this.showConfirmationModal = true;
}



confirmSubmission(): void {
  console.log('Confirm clicked');
  const startTime = Date.now();

  const userId = localStorage.getItem('userId');
  this.submitting = true;
  this.success = false;
  this.errorMessage = '';

  const formData = new FormData();
  formData.append('description', this.reportForm.get('description')?.value);
  formData.append('email', this.reportForm.get('email')?.value || '');
  formData.append('space_name', this.selectedSpace.name || '');
  formData.append('district', this.selectedSpace.district || '');
  formData.append('street', this.selectedSpace.street || '');
  formData.append('latitude', this.selectedSpace.latitude?.toString() || '');
  formData.append('longitude', this.selectedSpace.longitude?.toString() || '');
  if (userId) {
    formData.append('user_id', userId);
  }

  // Optional file
  if (this.selectedFile) {
    formData.append('file', this.selectedFile, this.selectedFile.name);
  }

  console.log('Submitting report via REST with FormData:', formData);

  this.openSpaceService.submitReportREST(formData).subscribe({
    next: (response) => {
      console.log('Report created successfully in', Date.now() - startTime, 'ms');
      this.submitting = false;
      this.success = true;
      this.reportId = response.reportId;

      Swal.fire({
        title: `Report ID ${this.reportId} submitted successfully!`,
        icon: "success",
        customClass: {
          title: 'custom-title',
          popup: 'custom-popup'
        }
      });

      this.showConfirmationModal = false;
      setTimeout(() => {
        this.closeForm();
        this.resetForm();
      }, 1000);
    },
    error: (error) => {
      console.error('Error submitting report:', error);
      this.submitting = false;
      this.errorMessage = 'Failed to submit report. Please try again.';
      this.toastr.error('Error submitting report', 'Error', {
        positionClass: 'toast-top-right',
      });
    }
  });
}



cancelSubmission(): void {
  this.showConfirmationModal = false;
}

  private resetForm(): void {
    this.reportForm.reset();
    this.selectedFile = null;
    this.selectedFileName = '';
    this.selectedSpace = null;
  }

  changeMapStyle(styleName: string) {
    const styleUrl = `https://api.maptiler.com/maps/${styleName}/style.json?key=9rtSKNwbDOYAoeEEeW9B`;
    this.map?.setStyle(styleUrl);
  }
}



//swal
// Swal.fire({
//   title: "Drag me!",
//   icon: "success",
//   draggable: true
// });


// Swal.fire({
//   title: "Do you want to save the changes?",
//   showDenyButton: true,
//   showCancelButton: true,
//   confirmButtonText: "Save",
//   denyButtonText: `Don't save`
// }).then((result) => {
//   /* Read more about isConfirmed, isDenied below */
//   if (result.isConfirmed) {
//     Swal.fire("Saved!", "", "success");
//   } else if (result.isDenied) {
//     Swal.fire("Changes are not saved", "", "info");
//   }
// });





      // const popupContent = document.createElement('div');
      //   popupContent.classList.add('popup-content');
      //   popupContent.innerHTML = `
      //     <h3>${space.name}</h3>
      //     <p>Location: (${space.latitude}, ${space.longitude})</p>
      //     <button class="report-problem-btn">Report Problem</button>
      //   `;

      //     const popup = new Popup({ offset: 25 })
      //       .setDOMContent(popupContent);

      //     // Marker.setPopup(popup);

      //     // Open form when button inside popup is clicked
      //     popupContent.querySelector('.report-problem-btn')?.addEventListener('click', (e) => {
      //       e.stopPropagation();
      //       console.log('Report button clicked for:', space.name);
      //       this.openReportForm(space);
      //     });
