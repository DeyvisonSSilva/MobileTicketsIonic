import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AtendentePage } from './atendente.page';
import { AtendentePageRoutingModule } from './atendente-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, AtendentePageRoutingModule],
  declarations: [AtendentePage]
})
export class AtendentePageModule {}
