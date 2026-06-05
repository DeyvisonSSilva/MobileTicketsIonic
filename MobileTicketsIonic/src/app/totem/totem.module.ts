import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TotemPage } from './totem.page';
import { TotemPageRoutingModule } from './totem-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, TotemPageRoutingModule],
  declarations: [TotemPage]
})
export class TotemPageModule {}
