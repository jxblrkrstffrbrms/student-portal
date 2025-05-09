import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonList, IonLabel, IonAvatar, IonCard } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonList, IonLabel, IonAvatar, IonCard, ExploreContainerComponent],
})
export class Tab4Page {
  constructor(private router: Router) {}
  
  goTo(page: string) {
  this.router.navigate(['/login']);
}

signOut() {
  this.router.navigate(['/login']);
}
}


