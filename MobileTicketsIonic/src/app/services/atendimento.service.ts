import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Senha, TipoSenha, Guiche, RelatorioItem, StatusSenha } from '../models/senha.model';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  private readonly HORA_INICIO = 7;
  private readonly HORA_FIM = 17;
  private readonly NUM_GUICHES = 3;
  private readonly TAXA_DESCARTE = 0.05; // 5% de descarte

  private filaSP: Senha[] = [];
  private filaSE: Senha[] = [];
  private filaSG: Senha[] = [];

  private sequencias: Record<TipoSenha, number> = { SP: 0, SG: 0, SE: 0 };
  private guiches: Guiche[] = [];
  private historico: Senha[] = [];
  private ultimasChamadas: Senha[] = [];
  private ultimoTipoChamado: TipoSenha | null = null;

  private senhasSubject = new BehaviorSubject<Senha[]>([]);
  private ultimasChamadasSubject = new BehaviorSubject<Senha[]>([]);
  private guichesSubject = new BehaviorSubject<Guiche[]>([]);

  senhas$ = this.senhasSubject.asObservable();
  ultimasChamadas$ = this.ultimasChamadasSubject.asObservable();
  guiches$ = this.guichesSubject.asObservable();

  constructor() {
    this.inicializarGuiches();
  }

  private inicializarGuiches(): void {
    this.guiches = Array.from({ length: this.NUM_GUICHES }, (_, i) => ({
      numero: i + 1,
      disponivel: true
    }));
    this.guichesSubject.next([...this.guiches]);
  }

  get expedienteAtivo(): boolean {
    const hora = new Date().getHours();
    return hora >= this.HORA_INICIO && hora < this.HORA_FIM;
  }

  private gerarNumeracao(tipo: TipoSenha): string {
    const agora = new Date();
    const yy = String(agora.getFullYear()).slice(-2);
    const mm = String(agora.getMonth() + 1).padStart(2, '0');
    const dd = String(agora.getDate()).padStart(2, '0');
    this.sequencias[tipo]++;
    const sq = String(this.sequencias[tipo]).padStart(2, '0');
    return `${yy}${mm}${dd}-${tipo}${sq}`;
  }

  private calcularTM(tipo: TipoSenha): number {
    switch (tipo) {
      case 'SP': {
        // TM base 15min, varia ±5
        const variacao = (Math.random() * 10) - 5;
        return Math.max(1, 15 + variacao);
      }
      case 'SG': {
        // TM base 5min, varia ±3
        const variacao = (Math.random() * 6) - 3;
        return Math.max(1, 5 + variacao);
      }
      case 'SE': {
        // 95% = 1min, 5% = 5min
        return Math.random() < 0.95 ? 1 : 5;
      }
    }
  }

  emitirSenha(tipo: TipoSenha): Senha | null {
    if (!this.expedienteAtivo) {
      return null;
    }

    const senha: Senha = {
      numeracao: this.gerarNumeracao(tipo),
      tipo,
      sequencia: this.sequencias[tipo],
      dataHoraEmissao: new Date(),
      status: 'AGUARDANDO',
      tmMinutos: this.calcularTM(tipo)
    };

    // 5% de descarte imediato (cliente não aguarda)
    if (Math.random() < this.TAXA_DESCARTE) {
      senha.status = 'DESCARTADA';
      this.historico.push(senha);
      this.atualizarSenhas();
      return senha;
    }

    switch (tipo) {
      case 'SP': this.filaSP.push(senha); break;
      case 'SE': this.filaSE.push(senha); break;
      case 'SG': this.filaSG.push(senha); break;
    }

    this.historico.push(senha);
    this.atualizarSenhas();
    return senha;
  }

  chamarProximo(): Senha | null {
    if (!this.expedienteAtivo) {
      this.encerrarExpediente();
      return null;
    }

    const guicheDisponivel = this.guiches.find(g => g.disponivel);
    if (!guicheDisponivel) return null;

    const proxima = this.selecionarProximaSenha();
    if (!proxima) return null;

    proxima.status = 'CHAMADA';
    proxima.dataHoraAtendimento = new Date();
    proxima.guiche = guicheDisponivel.numero;

    guicheDisponivel.disponivel = false;
    guicheDisponivel.senhaAtual = proxima;

    // Simular tempo de atendimento
    const tmMs = (proxima.tmMinutos || 5) * 60 * 1000;
    setTimeout(() => {
      this.finalizarAtendimento(guicheDisponivel.numero);
    }, Math.min(tmMs, 30000)); // Cap em 30s para demo

    // Atualizar painel (5 últimas)
    this.ultimasChamadas = [proxima, ...this.ultimasChamadas].slice(0, 5);
    this.ultimasChamadasSubject.next([...this.ultimasChamadas]);

    this.atualizarSenhas();
    this.guichesSubject.next([...this.guiches]);

    return proxima;
  }

  private selecionarProximaSenha(): Senha | null {
    // Lógica de prioridade: [SP] -> [SE|SG] -> [SP] -> [SE|SG]
    if (this.ultimoTipoChamado === 'SP') {
      // Após SP, chamar SE se houver, senão SG
      if (this.filaSE.length > 0) {
        this.ultimoTipoChamado = 'SE';
        return this.filaSE.shift()!;
      }
      if (this.filaSG.length > 0) {
        this.ultimoTipoChamado = 'SG';
        return this.filaSG.shift()!;
      }
      // Fallback: SP novamente se só tem SP
      if (this.filaSP.length > 0) {
        this.ultimoTipoChamado = 'SP';
        return this.filaSP.shift()!;
      }
    } else {
      // Após SE/SG ou início: chamar SP
      if (this.filaSP.length > 0) {
        this.ultimoTipoChamado = 'SP';
        return this.filaSP.shift()!;
      }
      if (this.filaSE.length > 0) {
        this.ultimoTipoChamado = 'SE';
        return this.filaSE.shift()!;
      }
      if (this.filaSG.length > 0) {
        this.ultimoTipoChamado = 'SG';
        return this.filaSG.shift()!;
      }
    }
    return null;
  }

  finalizarAtendimento(numeroGuiche: number): void {
    const guiche = this.guiches.find(g => g.numero === numeroGuiche);
    if (!guiche) return;

    if (guiche.senhaAtual) {
      guiche.senhaAtual.status = 'ATENDIDA';
    }

    guiche.disponivel = true;
    guiche.senhaAtual = undefined;
    this.guichesSubject.next([...this.guiches]);
    this.atualizarSenhas();
  }

  private encerrarExpediente(): void {
    // Descartar senhas restantes
    [...this.filaSP, ...this.filaSE, ...this.filaSG].forEach(s => {
      s.status = 'DESCARTADA';
    });
    this.filaSP = [];
    this.filaSE = [];
    this.filaSG = [];
    this.atualizarSenhas();
  }

  private atualizarSenhas(): void {
    this.senhasSubject.next([...this.historico]);
  }

  getFilas(): { SP: Senha[]; SE: Senha[]; SG: Senha[] } {
    return {
      SP: [...this.filaSP],
      SE: [...this.filaSE],
      SG: [...this.filaSG]
    };
  }

  resetarDia(): void {
    this.filaSP = [];
    this.filaSE = [];
    this.filaSG = [];
    this.sequencias = { SP: 0, SG: 0, SE: 0 };
    this.historico = [];
    this.ultimasChamadas = [];
    this.ultimoTipoChamado = null;
    this.inicializarGuiches();
    this.senhasSubject.next([]);
    this.ultimasChamadasSubject.next([]);
  }

  gerarRelatorio(): RelatorioItem {
    const senhas = this.historico;
    const relatorio: RelatorioItem = {
      totalEmitidas: senhas.length,
      totalAtendidas: senhas.filter(s => s.status === 'ATENDIDA').length,
      totalDescartadas: senhas.filter(s => s.status === 'DESCARTADA').length,
      porTipo: {
        SP: {
          emitidas: senhas.filter(s => s.tipo === 'SP').length,
          atendidas: senhas.filter(s => s.tipo === 'SP' && s.status === 'ATENDIDA').length
        },
        SG: {
          emitidas: senhas.filter(s => s.tipo === 'SG').length,
          atendidas: senhas.filter(s => s.tipo === 'SG' && s.status === 'ATENDIDA').length
        },
        SE: {
          emitidas: senhas.filter(s => s.tipo === 'SE').length,
          atendidas: senhas.filter(s => s.tipo === 'SE' && s.status === 'ATENDIDA').length
        }
      },
      senhas,
      tmMedio: {
        SP: this.calcularTMMedio('SP'),
        SG: this.calcularTMMedio('SG'),
        SE: this.calcularTMMedio('SE')
      }
    };
    return relatorio;
  }

  private calcularTMMedio(tipo: TipoSenha): number {
    const atendidas = this.historico.filter(
      s => s.tipo === tipo && s.status === 'ATENDIDA' && s.tmMinutos
    );
    if (atendidas.length === 0) return 0;
    return atendidas.reduce((acc, s) => acc + (s.tmMinutos || 0), 0) / atendidas.length;
  }
}
