import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelPage } from './painel.page';

const routes: Routes = [{ path: '', component: PainelPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PainelPageRoutingModule {}
