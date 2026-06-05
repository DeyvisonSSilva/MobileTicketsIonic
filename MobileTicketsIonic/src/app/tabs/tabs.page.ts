<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
>>>>>>> fb4352a1e568dc8b01e92513b802d37719b2b312

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
<<<<<<< HEAD
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {}
=======
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ triangle, ellipse, square });
  }
}
>>>>>>> fb4352a1e568dc8b01e92513b802d37719b2b312
