import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'facebook',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/images/facebook.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'instagram',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/images/instagram.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'twitter',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/images/twitter.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'behance',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/images/behance.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'pinterest',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/images/pinterest.svg'
      )
    );
  }
}
