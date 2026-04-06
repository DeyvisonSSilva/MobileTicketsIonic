# MobileTicketsIonic 🏥

Aplicação mobile voltada para o gerenciamento de filas e distribuição de senhas em ambientes laboratoriais, desenvolvida utilizando Ionic Framework em conjunto com Angular. O sistema reproduz todo o ciclo de atendimento, desde a geração da senha até sua chamada no guichê, seguindo critérios bem definidos de prioridade.

## 📋 Requisitos do Projeto (Conforme especificação)

A solução foi projetada com base nas seguintes regras funcionais e técnicas:

Padrão de Identificação: Senhas no formato YYMMDD-PPSQ (exemplo: 260402-SP01).
Tipos de Atendimento: Prioritário (SP), Geral (SG) e Exames (SE).
Ordem de Atendimento: Alternância entre senhas prioritárias e demais categorias ($[SP] \rightarrow [SE|SG] \rightarrow [SP]$).
Período de Funcionamento: Emissão de senhas disponível apenas entre 07:00 e 17:00.
Simulação de Ausência: Considera uma taxa de 5% de desistência, descartando senhas não atendidas.

A seguir, as principais interfaces da aplicação:

1. Totem de Autoatendimento (Tab 1)

Tela onde o usuário seleciona o serviço desejado e gera sua senha de atendimento.

2. Painel de Chamadas (Tab 2)

Exibe, em tempo real, a senha atual em atendimento e o histórico das últimas cinco chamadas, além de métricas de desempenho (KPIs).

3. Console do Atendente (Tab 3)

Interface utilizada pelos atendentes para chamar os próximos clientes, respeitando automaticamente as regras de prioridade definidas.

## 🛠️ Tecnologias Utilizadas
Framework: Ionic (versão 7 ou superior)
Arquitetura/Lógica: Angular (versão 17+, com Standalone Components)
Linguagem: TypeScript
Plataforma Mobile: Capacitor (compatível com Android e iOS)

## 🚀 Como Executar
Instale as dependências do projeto:
   ```bash
   npm install
