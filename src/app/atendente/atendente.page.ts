import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AtendimentoService } from '../services/atendimento.service';
import { Senha, TipoSenha, Guiche } from '../models/senha.model';

@Component({
  selector: 'app-atendente',
  templateUrl: './atendente.page.html',
  styleUrls: ['./atendente.page.scss']
})
export class AtendentePage implements OnInit, OnDestroy {
  guiches: Guiche[] = [];
  filas: { SP: Senha[]; SE: Senha[]; SG: Senha[] } = { SP: [], SE: [], SG: [] };
  ultimaChamada: Senha | null = null;
  chamando = false;

  private subs = new Subscription();
  private intervalo?: ReturnType<typeof setInterval>;

  constructor(
    private atendimentoService: AtendimentoService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.subs.add(
      this.atendimentoService.guiches$.subscribe(g => (this.guiches = g))
    );

    // Atualizar filas periodicamente
    this.intervalo = setInterval(() => {
      this.filas = this.atendimentoService.getFilas();
    }, 1000);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.intervalo) clearInterval(this.intervalo);
  }

  get totalFila(): number {
    return this.filas.SP.length + this.filas.SE.length + this.filas.SG.length;
  }

  get temGuicheDisponivel(): boolean {
    return this.guiches.some(g => g.disponivel);
  }

  async chamarProximo() {
    if (!this.atendimentoService.expedienteAtivo) {
      const toast = await this.toastCtrl.create({
        message: 'Fora do horário de atendimento.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    if (!this.temGuicheDisponivel) {
      const toast = await this.toastCtrl.create({
        message: 'Nenhum guichê disponível no momento.',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }

    this.chamando = true;
    const senha = this.atendimentoService.chamarProximo();
    this.chamando = false;

    if (senha) {
      this.ultimaChamada = senha;
      this.filas = this.atendimentoService.getFilas();

      const toast = await this.toastCtrl.create({
        message: `✅ Chamando: ${senha.numeracao} → Guichê ${senha.guiche}`,
        duration: 3000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Nenhuma senha na fila.',
        duration: 2000,
        color: 'medium',
        position: 'top'
      });
      await toast.present();
    }
  }

  async finalizarManual(guicheNumero: number) {
    const alert = await this.alertCtrl.create({
      header: 'Finalizar Atendimento',
      message: `Confirmar finalização do atendimento no Guichê ${guicheNumero}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Finalizar',
          handler: () => {
            this.atendimentoService.finalizarAtendimento(guicheNumero);
          }
        }
      ]
    });
    await alert.present();
  }

  async resetarDia() {
    const alert = await this.alertCtrl.create({
      header: 'Resetar Sistema',
      message: 'Isso apagará todos os dados do dia. Confirmar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Resetar',
          role: 'destructive',
          handler: () => {
            this.atendimentoService.resetarDia();
            this.ultimaChamada = null;
            this.filas = { SP: [], SE: [], SG: [] };
          }
        }
      ]
    });
    await alert.present();
  }

  getTipoCor(tipo: TipoSenha): string {
    return { SP: 'danger', SG: 'primary', SE: 'success' }[tipo];
  }
}
