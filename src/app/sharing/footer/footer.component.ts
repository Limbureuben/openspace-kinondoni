import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  animations: [
    trigger('slideUp', [
      state('void', style({ transform: 'translateY(100%)' })),
      transition(':enter', [
        animate('0.5s ease-out', style({ transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class FooterComponent {

  @ViewChild('chatbotContainer') chatbotContainer!: ElementRef;

  openChat() {
    if (this.chatbotContainer) {
      this.chatbotContainer.nativeElement.style.display = 'block';

      // Ensure Elfsight script reloads if needed
      if ((window as any).eapps) {
        (window as any).eapps.init();
      }
    }
  }

}
