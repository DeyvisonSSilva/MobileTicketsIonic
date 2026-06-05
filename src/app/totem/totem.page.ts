import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AtendimentoService } from '../services/atendimento.service';
import { Senha, TipoSenha } from '../models/senha.model';

@Component({
  selector: 'app-totem',
  templateUrl: './totem.page.html',
  styleUrls: ['./totem.page.scss']
})
export class TotemPage implements OnInit {
  ultimaSenhaEmitida: Senha | null = null;
  mostrarSenha = false;

  constructor(
    private atendimentoService: AtendimentoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  get expedienteAtivo(): boolean {
    return this.atendimentoService.expedienteAtivo;
  }

  async emitirSenha(tipo: TipoSenha) {
    if (!this.expedienteAtivo) {
      const toast = await this.toastCtrl.create({
        message: 'Fora do horário de atendimento (07h às 17h)',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    const senha = this.atendimentoService.emitirSenha(tipo);
    if (!senha) return;

    this.ultimaSenhaEmitida = senha;
    this.mostrarSenha = true;

    if (senha.status === 'DESCARTADA') {
      const toast = await this.toastCtrl.create({
        message: 'Senha emitida mas cliente não aguardou.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
    }
  }

  fecharSenha() {
    this.mostrarSenha = false;
    this.ultimaSenhaEmitida = null;
  }

  getTipoCor(tipo: TipoSenha): string {
    const cores: Record<TipoSenha, string> = {
      SP: 'danger',
      SG: 'primary',
      SE: 'success'
    };
    return cores[tipo];
  }

  getTipoDescricao(tipo: TipoSenha): string {
    const desc: Record<TipoSenha, string> = {
      SP: 'Prioritária',
      SG: 'Geral',
      SE: 'Retirada de Exames'
    };
    return desc[tipo];
  }
}
