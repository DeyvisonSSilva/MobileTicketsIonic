import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AtendimentoService } from '../services/atendimento.service';
import { Senha, TipoSenha, Guiche } from '../models/senha.model';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss']
})
export class PainelPage implements OnInit, OnDestroy {
  ultimasChamadas: Senha[] = [];
  guiches: Guiche[] = [];
  horaAtual = new Date();

  private subs = new Subscription();
  private intervalo?: ReturnType<typeof setInterval>;

  constructor(private atendimentoService: AtendimentoService) {}

  ngOnInit() {
    this.subs.add(
      this.atendimentoService.ultimasChamadas$.subscribe(
        senhas => (this.ultimasChamadas = senhas)
      )
    );

    this.subs.add(
      this.atendimentoService.guiches$.subscribe(
        guiches => (this.guiches = guiches)
      )
    );

    this.intervalo = setInterval(() => {
      this.horaAtual = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.intervalo) clearInterval(this.intervalo);
  }

  getTipoCor(tipo: TipoSenha): string {
    const cores: Record<TipoSenha, string> = {
      SP: 'danger',
      SG: 'primary',
      SE: 'success'
    };
    return cores[tipo];
  }

  getTipoLabel(tipo: TipoSenha): string {
    const labels: Record<TipoSenha, string> = {
      SP: 'Prioritário',
      SG: 'Geral',
      SE: 'Exames'
    };
    return labels[tipo];
  }
}
