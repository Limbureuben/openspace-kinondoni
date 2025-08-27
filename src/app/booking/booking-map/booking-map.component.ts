import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { Map, MapStyle } from '@maptiler/sdk';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { Marker, Popup } from '@maptiler/sdk';
import { response } from 'express';
import { switchMap } from 'rxjs/operators';
import { BookingService } from '../../service/booking.service';

import jsPDF from 'jspdf';
const config: any = {}; // Store map API key config
import QRCode from 'qrcode';

@Component({
  selector: 'app-booking-map',
  standalone: false,
  templateUrl: './booking-map.component.html',
  styleUrls: ['./booking-map.component.scss']
})
export class BookingMapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  searchQuery = '';
  suggestions: any[] = [];
  selectedSpace: any = null;
  openSpaces: any[] = [];
  submitting = false;

  districts: string[] = [
    'Bunju', 'Hananasif', 'Kawe', 'Kigogo', 'Kijitonyama', 'Kinondoni',
    'Kunduchi', 'Mabwepande', 'Magomeni', 'Makongo', 'Makumbusho',
    'Mbezi juu', 'Mbweni', 'Mikocheni', 'Msasani', 'Mwananyamala',
    'Mzimuni', 'Ndugumbi', 'Tandale', 'Wazo'
  ];

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  reportForm: FormGroup;

  selectedFile: File | null = null;
  selectedFileName: string = '';
  pdfBlob: Blob | null = null;
  pdfUrl: any = null;
  showPreview: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private openSpaceService: OpenspaceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService,
    private bookingService: BookingService
  ) {
    this.reportForm = this.fb.group({
      username: ['', Validators.required],
      contact: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      district: ['', Validators.required],
      purpose: ['', Validators.required],
      pdfFile: [null]
    });
  }

  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
      this.fetchOpenSpaces();
      document.getElementById('closeFormBtn')?.addEventListener('click', () => this.closeForm());
    }
  }

  initializeMap(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${config.apiKey}`,
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
      (error) => console.error('Error fetching open spaces:', error)
    );
  }

  addMarkersToMap(): void {
    if (!this.map) return;

    this.map.on('load', () => {
      this.openSpaces.forEach(space => {
        const size = 0.00025;
        const coordinates = [[
          [space.longitude - size, space.latitude - size],
          [space.longitude + size, space.latitude - size],
          [space.longitude + size, space.latitude + size],
          [space.longitude - size, space.latitude + size],
          [space.longitude - size, space.latitude - size]
        ]];

        const sourceId = `space-${space.name}-${space.latitude}`;
        const polygonGeoJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
          type: "Feature",
          geometry: { type: "Polygon", coordinates },
          properties: { name: space.name, latitude: space.latitude, longitude: space.longitude, status: space.status }
        };

        if (!this.map!.getSource(sourceId)) {
          this.map!.addSource(sourceId, { type: 'geojson', data: polygonGeoJSON });
          this.map!.addLayer({
            id: sourceId,
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': space.status === 'available' ? '#00cc00' : '#cc0000',
              'fill-opacity': 0.5
            }
          });

          this.map!.addLayer({
            id: `${sourceId}-border`,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#000',
              'line-width': 1
            }
          });

          this.map!.on('click', sourceId, () => {
            new Popup({ offset: 10 })
              .setLngLat([space.longitude, space.latitude])
              .setHTML(`<div><h3>${space.name}</h3><p>Status: ${space.status}</p></div>`)
              .addTo(this.map!);

            space.status === 'available'
              ? this.openBookingForm(space)
              : this.toastr.warning('This space is currently booked.', 'Not Available');
          });

          this.map!.on('mouseenter', sourceId, () => this.map!.getCanvas().style.cursor = 'pointer');
          this.map!.on('mouseleave', sourceId, () => this.map!.getCanvas().style.cursor = '');
        }
      });
    });
  }

  openBookingForm(space: any) {
    this.selectedSpace = space;
    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    const locationName = document.getElementById('location-name') as HTMLElement;
    if (locationName) locationName.textContent = space.name;
    if (formContainer) {
      formContainer.style.display = 'flex';
      setTimeout(() => formContainer.classList.add('open'), 20);
    }
  }

  closeForm() {
    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    if (formContainer) {
      formContainer.classList.add('closing');
      setTimeout(() => {
        formContainer.classList.remove('open', 'closing');
        formContainer.style.display = 'none';
      }, 300);
    }
    this.closePreview();
  }

  triggerFileInput() {
    document.getElementById('file-upload')?.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

submitBook() {
  if (!this.reportForm.valid || !this.selectedSpace) {
    return;
  }

  this.submitting = true;

  const {
    username,
    contact,
    startdate,
    enddate,
    district,
    purpose
  } = this.reportForm.value;

  const space = this.selectedSpace;

  const doc = new jsPDF();
  let currentY = 60; // Header ends at ~60
  const leftColX = 20;
  const rightColX = 80;

  const qrData = `Booking for ${username} at ${space.name}, from ${new Date(startdate).toLocaleDateString()} to ${new Date(enddate).toLocaleDateString()}`;

  // Load QR Code + Logo before continuing
  Promise.all([
    QRCode.toDataURL(qrData),
    this.loadImageAsBase64('/assets/images/emblem.png')
  ]).then(([qrCodeDataUrl, logoBase64]) => {

    // Set custom color
    const r = 100, g = 100, b = 177;

    // Logo (smaller)
    doc.addImage(logoBase64, 'PNG', 15, 15, 20, 20);

    // QR Code (smaller)
    doc.addImage(qrCodeDataUrl, 'PNG', doc.internal.pageSize.getWidth() - 35, 15, 20, 20);

    // Title (centered between logo and QR)
    doc.setFontSize(16);
    doc.setTextColor(r, g, b);
    doc.setFont("helvetica", "bold");
    doc.text("Kinondoni Municipal Open Space Booking", doc.internal.pageSize.getWidth() / 2, 25, { align: "center" });

    // Line under header
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(15, 40, doc.internal.pageSize.getWidth() - 15, 40);

    doc.setTextColor(0, 0, 0); // Reset to black for body
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    const addField = (label: string, value: string | number) => {
      doc.text(label, leftColX, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), rightColX, currentY);
      doc.setFont("helvetica", "bold");
      currentY += 10;
    };

    addField("Username:", username);
    addField("Contact:", contact);
    addField("District:", district);
    addField("Purpose:", purpose);

    const durationDays = Math.ceil((new Date(enddate).getTime() - new Date(startdate).getTime()) / (1000 * 60 * 60 * 24));
    addField("Duration:", `${durationDays} day(s)`);
    addField("Start Date:", new Date(startdate).toLocaleDateString());
    addField("End Date:", new Date(enddate).toLocaleDateString());

    addField("Location:", space.name || space.address || '');
    if (space.latitude && space.longitude) {
      addField("Latitude:", space.latitude.toString());
      addField("Longitude:", space.longitude.toString());
    }


    // Draw agreement section title
    currentY += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 177);
    doc.text("Conditions & Agreement with Kinondoni Municipal", leftColX, currentY);

    currentY += 5;
    doc.setDrawColor(150);
    doc.line(leftColX, currentY, doc.internal.pageSize.getWidth() - leftColX, currentY);

    currentY += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Agreement text
    const agreementText = `
    1. The open space must be used only for the stated purpose and within the approved time.
    2. The applicant shall ensure cleanliness and is liable for any damage caused to public property.
    3. No unauthorized construction or permanent installations are allowed.
    4. Sound levels must comply with municipal noise regulations.
    5. The municipal authority reserves the right to revoke the booking without prior notice in case of violations.
    6. By proceeding, the applicant agrees to abide by all applicable municipal regulations and accept full responsibility for the space during the booked period.
    `;

    // Wrap the agreement text
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - 2 * leftColX;
    const wrappedText = doc.splitTextToSize(agreementText, textWidth);
    doc.text(wrappedText, leftColX, currentY);
    currentY += wrappedText.length * 6;


    // Generate blob
    const pdfBlob = doc.output("blob");

    // Trigger download
    const pdfURL = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = pdfURL;
    a.download = `booking_${new Date().getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Submit to backend
    const formData = new FormData();
    formData.append('username', username);
    formData.append('contact', contact);
    formData.append('startdate', new Date(startdate).toISOString().split('T')[0]);
    formData.append('enddate', new Date(enddate).toISOString().split('T')[0]);
    formData.append('district', district);
    formData.append('purpose', purpose);
    formData.append('location', space.name || space.address || '');
    if (space.latitude) formData.append('latitude', space.latitude.toString());
    if (space.longitude) formData.append('longitude', space.longitude.toString());
    formData.append('file', pdfBlob, `booking_${new Date().getTime()}.pdf`);
    formData.append('space_id', space.id.toString());

    this.bookingService.bookOpenSpace(formData).subscribe({
      next: () => {
        this.submitting = false;
        this.toastr.success('Booking Successfully');
        this.reportForm.reset();
      },
      error: (err) => {
        console.error('Booking error:', err);
        this.submitting = false;
        this.toastr.error('Failed to book an openspace');
      }
    });

  }).catch(err => {
    console.error('Error generating QR or logo:', err);
    this.toastr.error('Failed to generate booking PDF');
    this.submitting = false;
  });
}


loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Failed to create canvas");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('../../../assets/images/emblem.png'));
    };
    img.onerror = () => reject('Failed to load image');
    img.src = url;
  });
}






  closePreview() {
    this.showPreview = false;
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = null;
    }
    this.pdfBlob = null;
  }

  ngOnDestroy() {
    if (this.pdfUrl) URL.revokeObjectURL(this.pdfUrl);
  }

  fetchSuggestions() {
    if (!this.searchQuery) {
      this.suggestions = [];
      return;
    }

    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=${config.apiKey}&country=TZ`)
      .then(res => res.json())
      .then(data => {
        this.suggestions = data.features.map((feature: any) => ({
          name: feature.place_name,
          center: feature.center
        }));
      })
      .catch(err => console.error("Suggestion fetch error:", err));
  }

  searchLocation() {
    if (!this.searchQuery) return;
    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=${config.apiKey}&country=TZ`)
      .then(res => res.json())
      .then(data => {
        if (data.features.length > 0) {
          const { center } = data.features[0];
          this.map?.flyTo({ center, zoom: 14 });
        }
      })
      .catch(err => console.error("Search error:", err));
  }

  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.name;
    this.map?.flyTo({ center: suggestion.center, zoom: 14 });
    this.suggestions = [];
  }

  changeMapStyle(styleName: string) {
    const styleUrl = `https://api.maptiler.com/maps/${styleName}/style.json?key=${config.apiKey}`;
    this.map?.setStyle(styleUrl);
  }
}



































// export class BookingMapComponent implements OnInit, AfterViewInit, OnDestroy {
//   map: Map | undefined;
//   searchQuery = '';
//   suggestions: any[] = [];
//   selectedSpace: any = null;
//   openSpaces: any[] = [];
//   submitting = false;
//   districts: string[] = [
//     'Bunju', 'Hananasif', 'Kawe','Kigogo', 'Kijitonyama', 'Kinondoni',
//     'Kunduchi', 'Mabwepande', 'Magomeni', 'Makongo', 'Makumbusho',
//     'Mbezi juu', 'Mbweni', 'Mikocheni', 'Msasani', 'Mwananyamala',
//     'Mzimuni', 'Ndugumbi', 'Tandale', 'Wazo'
//   ];

//   @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

//   reportForm: FormGroup;

//   selectedFile: File | null = null;
//   selectedFileName: string = '';
//   pdfBlob: Blob | null = null;
//   pdfUrl: any = null;
//   showPreview: boolean = false;


//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private openSpaceService: OpenspaceService,
//     private fb: FormBuilder,
//     private toastr: ToastrService,
//     private authservice: AuthService,
//     private bookingService: BookingService
//   ) {
//     this.reportForm = this.fb.group({
//       username: ['', Validators.required],
//       contact: ['', Validators.required],
//       startdate: ['', Validators.required],
//       enddate: ['', Validators.required],
//       district: ['', Validators.required],
//       duration: ['', Validators.required],
//       purpose: ['', Validators.required],
//       pdfFile: [null]
//     });
//   }

//   ngOnInit(): void {
//     config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
//   }

//   ngAfterViewInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       this.initializeMap();
//       this.fetchOpenSpaces();

//       document.getElementById('closeFormBtn')?.addEventListener('click', () => {
//         this.closeForm();
//       });
//     }
//   }

//   initializeMap(): void {
//     this.map = new Map({
//       container: this.mapContainer.nativeElement,
//       style: `https://api.maptiler.com/maps/streets/style.json?key=${config.apiKey}`,
//       center: [39.230099, -6.774133],
//       zoom: 14
//     });
//   }

//   fetchOpenSpaces(): void {
//     this.openSpaceService.getAllOpenSpacesUser().subscribe(
//       (data) => {
//         this.openSpaces = data;
//         this.addMarkersToMap();
//       },
//       (error) => {
//         console.error('Error fetching open spaces:', error);
//       }
//     );
//   }



//   addMarkersToMap(): void {
//   if (!this.map) return;

//   this.map.on('load', () => {
//     this.openSpaces.forEach(space => {
//       const size = 0.00025;

//       const coordinates = [
//         [
//           [space.longitude - size, space.latitude - size],
//           [space.longitude + size, space.latitude - size],
//           [space.longitude + size, space.latitude + size],
//           [space.longitude - size, space.latitude + size],
//           [space.longitude - size, space.latitude - size]
//         ]
//       ];

//       const polygonGeoJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
//         type: 'Feature',
//         geometry: {
//           type: 'Polygon',
//           coordinates: coordinates
//         },
//         properties: {
//           name: space.name,
//           latitude: space.latitude,
//           longitude: space.longitude,
//           status: space.status
//         }
//       };

//       const sourceId = `space-${space.name}-${space.latitude}`;

//       if (!this.map!.getSource(sourceId)) {
//         this.map!.addSource(sourceId, {
//           type: 'geojson',
//           data: polygonGeoJSON
//         });

//         this.map!.addLayer({
//           id: sourceId,
//           type: 'fill',
//           source: sourceId,
//           paint: {
//             'fill-color': space.status === 'available' ? '#00cc00' : '#cc0000',
//             'fill-opacity': 0.5
//           }
//         });

//         this.map!.addLayer({
//           id: `${sourceId}-border`,
//           type: 'line',
//           source: sourceId,
//           paint: {
//             'line-color': '#000',
//             'line-width': 1
//           }
//         });

//         // Popup on click
//         this.map!.on('click', sourceId, () => {
//           new Popup({ offset: 10 })
//             .setLngLat([space.longitude, space.latitude])
//             .setHTML(`
//               <div>
//                 <h3>${space.name}</h3>
//                 <p>Location: (${space.latitude}, ${space.longitude})</p>
//                 <p>Status: ${space.status === 'available' ? ' Available' : ' Booked'}</p>
//               </div>
//             `)
//             .addTo(this.map!);

//           if (space.status === 'available') {
//             this.openBookingForm(space);
//           } else {
//             this.toastr.warning('This space is currently booked.', 'Not Available');
//           }
//         });

//         // Cursor change
//         this.map!.on('mouseenter', sourceId, () => {
//           this.map!.getCanvas().style.cursor = 'pointer';
//         });

//         this.map!.on('mouseleave', sourceId, () => {
//           this.map!.getCanvas().style.cursor = '';
//         });
//       }
//     });
//   });
// }

//   openBookingForm(space: any) {
//     this.selectedSpace = space;

//     const formContainer = document.getElementById('detailsForm') as HTMLElement;
//     const locationName = document.getElementById('location-name') as HTMLElement;

//     if (locationName) locationName.textContent = space.name;

//     if (formContainer) {
//       formContainer.style.display = 'flex';
//       setTimeout(() => formContainer.classList.add('open'), 20);
//     }
//   }

//   closeForm() {
//     const formContainer = document.getElementById('detailsForm') as HTMLElement;
//     if (formContainer) {
//       formContainer.classList.add('closing');
//       setTimeout(() => {
//         formContainer.classList.remove('open', 'closing');
//         formContainer.style.display = 'none';
//       }, 300);
//     }
//     // Also reset preview state when closing form
//     this.closePreview();
//   }

//   triggerFileInput() {
//     document.getElementById('file-upload')?.click();
//   }

//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];
//     if (file) {
//       this.selectedFile = file;
//       this.selectedFileName = file.name;
//     }
//   }

//   submitBook() {
//     if (this.reportForm.invalid || !this.selectedSpace) {
//       this.toastr.warning('Please fill all fields and select a space.');
//       return;
//     }

//     if (!this.pdfBlob) {
//       this.toastr.warning('Please preview the PDF before submitting.');
//       return;
//     }

//     this.submitting = true;

//     const formData = new FormData();
//     formData.append('space_id', this.selectedSpace.id.toString());
//     formData.append('username', this.reportForm.value.username);
//     formData.append('contact', this.reportForm.value.contact);

//     const dateObj = new Date(this.reportForm.value.date);
//     const formattedDate = dateObj.toISOString().split('T')[0]; // Format: yyyy-mm-dd
//     formData.append('startdate', formattedDate);
//     formData.append('enddate', formattedDate);
//     formData.append('duration', this.reportForm.value.duration);
//     formData.append('purpose', this.reportForm.value.purpose);
//     formData.append('district', this.reportForm.value.district);

//     const fileToAttach = this.pdfBlob || this.selectedFile;
//     if (fileToAttach) {
//       const fileName = this.pdfBlob ? 'booking-details.pdf' : this.selectedFileName || 'uploaded-file.pdf';
//       formData.append('file', fileToAttach, fileName);
//     }

//     this.bookingService.bookOpenSpace(formData).subscribe({
//       next: () => {
//         this.toastr.success('Booking successful!', 'Success');
//         this.reportForm.reset();
//         this.selectedFile = null;
//         this.selectedFileName = '';
//         this.pdfBlob = null;
//         this.pdfUrl = null;
//         this.showPreview = false;
//         this.closeForm();
//         this.submitting = false;
//         this.fetchOpenSpaces();
//       },
//       error: (err) => {
//         console.error(err);
//         this.toastr.error('Booking failed', 'Error');
//         this.submitting = false;
//       }
//     });
//   }


//   fetchSuggestions() {
//     if (!this.searchQuery) {
//       this.suggestions = [];
//       return;
//     }

//     fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=${config.apiKey}&country=TZ`)
//       .then(res => res.json())
//       .then(data => {
//         this.suggestions = data.features.map((feature: any) => ({
//           name: feature.place_name,
//           center: feature.center
//         }));
//       })
//       .catch(err => console.error("Suggestion fetch error:", err));
//   }

//   searchLocation() {
//     if (!this.searchQuery) return;

//     fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=${config.apiKey}&country=TZ`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.features.length > 0) {
//           const { center } = data.features[0];
//           this.map?.flyTo({ center, zoom: 14 });
//         }
//       })
//       .catch(err => console.error("Search error:", err));
//   }

//   downloadPDF() {
//     if (this.reportForm.invalid) {
//       this.toastr.warning('Please fill all form fields before downloading the PDF.');
//       return;
//     }

//     const doc = new jsPDF();
//     const leftColX = 20;
//     const rightColX = 80;
//     let currentY = 30;

//     const username = this.reportForm.get('username')?.value;
//     const contact = this.reportForm.get('contact')?.value;
//     const startdate = this.reportForm.get('date')?.value;
//     const district = this.reportForm.get('district')?.value;
//     const enddate = this.reportForm.get('duration')?.value;
//     const purpose = this.reportForm.get('purpose')?.value;

//     const formattedDate = new Date(startdate).toLocaleDateString();
//     const sendingDate = new Date().toLocaleDateString();

//     // Title
//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.text("KINONDONI OPENSPACE MANAGEMENT MUNICIPAL", 105, 15, { align: "center" });

//     // Divider
//     doc.setDrawColor(0);
//     doc.line(20, 20, 190, 20);

//     // Booking Flow (Two-sided)
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.text("FROM:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text(`${username }`, rightColX, currentY);
//     currentY += 8;

//     doc.setFont("helvetica", "bold");
//     doc.text("THROUGH:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text("Ward Executive Officer", rightColX, currentY);
//     currentY += 8;

//     doc.setFont("helvetica", "bold");
//     doc.text("TO:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text("Kinondoni Municipal Staff", rightColX, currentY);
//     currentY += 15;

//     // Booking Details
//     doc.setFont("helvetica", "bold");
//     doc.text("USERNAME:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text(username, rightColX, currentY);
//     currentY += 8;

//     doc.setFont("helvetica", "bold");
//     doc.text("CONTACT:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text(contact, rightColX, currentY);
//     currentY += 8;

//     doc.setFont("helvetica", "bold");
//     doc.text("WARD:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text(district, rightColX, currentY);
//     currentY += 8;

//     doc.setFont("helvetica", "bold");
//     doc.text("BOOKING DATE:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text(formattedDate, rightColX, currentY);
//     currentY += 8;

//     doc.setFont("helvetica", "bold");
//     doc.text("DURATION:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text(enddate, rightColX, currentY);
//     currentY += 8;

//     doc.setFont("helvetica", "bold");
//     doc.text("PURPOSE:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text(purpose, rightColX, currentY);
//     currentY += 15;

//     // Sending Date
//     doc.setFont("helvetica", "bold");
//     doc.text("SENDING DATE:", leftColX, currentY);
//     doc.setFont("helvetica", "normal");
//     doc.text(sendingDate, rightColX, currentY);
//     currentY += 15;

//     // Signature
//     doc.setFont("helvetica", "bold");
//     doc.text("USER SIGNATURE:", leftColX, currentY);
//     doc.setFont("helvetica", "italic");
//     doc.text(username, rightColX, currentY);
//     currentY += 15;

//     // Footer
//     doc.setDrawColor(150);
//     doc.line(20, 280, 190, 280);
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.setFont("helvetica", "normal");
//     doc.text("Managed by Kinondoni Municipal Council – Digital Booking System", 105, 285, { align: "center" });

//     // Create PDF Blob for uploading
//     this.pdfBlob = doc.output('blob');

//     // Trigger download
//     doc.save('booking-details.pdf');

//     this.toastr.success('PDF downloaded successfully.');
//   }



//   closePreview() {
//     this.showPreview = false;
//     if (this.pdfUrl) {
//       URL.revokeObjectURL(this.pdfUrl);
//       this.pdfUrl = null;
//     }
//     this.pdfBlob = null;
//   }

//   ngOnDestroy() {
//     if (this.pdfUrl) {
//       URL.revokeObjectURL(this.pdfUrl);
//     }
//   }

//     selectSuggestion(suggestion: any) {
//     this.searchQuery = suggestion.name;
//     this.map?.flyTo({ center: suggestion.center, zoom: 14 });
//     this.suggestions = [];
//   }

//     changeMapStyle(styleName: string) {
//     const styleUrl = `https://api.maptiler.com/maps/${styleName}/style.json?key=${config.apiKey}`;
//     this.map?.setStyle(styleUrl);
//   }

// }
