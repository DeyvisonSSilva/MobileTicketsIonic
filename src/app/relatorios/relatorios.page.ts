import { Component, OnInit } from '@angular/core';
import { AtendimentoService } from '../services/atendimento.service';
import { RelatorioItem } from '../models/senha.model';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.page.html',
  styleUrls: ['./relatorios.page.scss']
})
export class RelatoriosPage implements OnInit {
  relatorio: RelatorioItem | null = null;
  mostrarDetalhes = false;
  dataRelatorio = new Date();

  constructor(private atendimentoService: AtendimentoService) {}

  ngOnInit() {
    this.gerarRelatorio();
  }

  gerarRelatorio() {
    this.relatorio = this.atendimentoService.gerarRelatorio();
    this.dataRelatorio = new Date();
  }

  toggleDetalhes() {
    this.mostrarDetalhes = !this.mostrarDetalhes;
  }

  get taxaAtendimento(): number {
    if (!this.relatorio || this.relatorio.totalEmitidas === 0) return 0;
    return Math.round((this.relatorio.totalAtendidas / this.relatorio.totalEmitidas) * 100);
  }
}
