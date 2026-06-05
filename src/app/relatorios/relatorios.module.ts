import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RelatoriosPage } from './relatorios.page';
import { RelatoriosPageRoutingModule } from './relatorios-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, RelatoriosPageRoutingModule],
  declarations: [RelatoriosPage]
})
export class RelatoriosPageModule {}
