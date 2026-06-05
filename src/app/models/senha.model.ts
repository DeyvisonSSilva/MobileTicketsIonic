export type TipoSenha = 'SP' | 'SG' | 'SE';
export type StatusSenha = 'AGUARDANDO' | 'CHAMADA' | 'ATENDIDA' | 'DESCARTADA';

export interface Senha {
  numeracao: string;       // Formato YYMMDD-PPSQ
  tipo: TipoSenha;
  sequencia: number;
  dataHoraEmissao: Date;
  dataHoraAtendimento?: Date;
  guiche?: number;
  status: StatusSenha;
  tmMinutos?: number;
}

export interface Guiche {
  numero: number;
  disponivel: boolean;
  senhaAtual?: Senha;
  horaLiberacao?: Date;
}

export interface RelatorioItem {
  totalEmitidas: number;
  totalAtendidas: number;
  totalDescartadas: number;
  porTipo: {
    SP: { emitidas: number; atendidas: number };
    SG: { emitidas: number; atendidas: number };
    SE: { emitidas: number; atendidas: number };
  };
  senhas: Senha[];
  tmMedio: {
    SP: number;
    SG: number;
    SE: number;
  };
}
