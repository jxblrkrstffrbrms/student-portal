import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSearchbar, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { mailOutline} from 'ionicons/icons';
import { addIcons } from 'ionicons';

interface ContactCard {
  title: string;
  subtitle: string;
  email: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  standalone: true,
  imports: [IonContent, IonSearchbar, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, CommonModule, FormsModule, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonIcon, IonCardTitle]
})
export class ContactsPage implements OnInit {
  searchText: string = '';
  contacts: ContactCard[] = [
    {
      title: 'Office of the Campus Director',
      subtitle: 'OCD',
      email: 'ocd@cbzrc.pshs.edu.ph'
    },
    {
      title: 'Curriculum and Instruction Division',
      subtitle: 'CID',
      email: 'cid@cbzrc.pshs.edu.ph'
    },
    {
      title: 'Finance and Administration Division',
      subtitle: 'FAD',
      email: 'fad@cbzrc.pshs.edu.ph'
    },
    {
      title: 'Student Services Division',
      subtitle: 'SSD',
      email: 'ssd@cbzrc.pshs.edu.ph'
    }
  ];

  get filteredContacts(): ContactCard[] {
    if (!this.searchText) return this.contacts;
    const searchLower = this.searchText.toLowerCase();
    return this.contacts.filter(contact => 
      contact.title.toLowerCase().includes(searchLower) ||
      contact.subtitle.toLowerCase().includes(searchLower)
    );
  }

  constructor() { 
    addIcons({ mailOutline});
  }

  ngOnInit() {
  }
}
