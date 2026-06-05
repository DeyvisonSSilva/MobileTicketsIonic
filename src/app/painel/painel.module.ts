import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PainelPage } from './painel.page';
import { PainelPageRoutingModule } from './painel-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, PainelPageRoutingModule],
  declarations: [PainelPage]
})
export class PainelPageModule {}
