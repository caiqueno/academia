// Tipos e interfaces do sistema ULTRA ACADEMIA

export type UserRole = 
  | 'operador'
  | 'gerente'
  | 'diretor'
  | 'compras'
  | 'financeiro';

export type OrderStatus = 
  | 'criado'
  | 'aguardando_aprovacao'
  | 'aguardando_aprovacao_gerente'
  | 'aguardando_aprovacao_diretor'
  | 'em_lancamento_orcamentos'
  | 'orcamentos_enviados'
  | 'orcamentos_aprovados'
  | 'reprovado'
  | 'pedido_final_aprovado'
  | 'pdf_gerado'
  | 'enviado_compras'
  | 'enviado_financeiro'
  | 'processo_finalizado';

export type OrderType = 
  | 'equipamento'
  | 'suplemento'
  | 'manutencao'
  | 'servico'
  | 'material_operacional';

export type Area = 
  | 'musculacao'
  | 'cardio'
  | 'recepcao'
  | 'manutencao'
  | 'administrativa'
  | 'vestiario';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unidade?: string;
}

export interface Budget {
  unidadeId: string;
  unidadeNome: string;
  mensal: number;
  consumido: number;
  disponivel: number;
  mes: string;
}

export interface Quote {
  id: string;
  fornecedor: string;
  valor: number;
  arquivo?: string;
  dataEnvio: string;
}

export interface OrderHistoryItem {
  id: string;
  data: string;
  acao: string;
  usuario: string;
  detalhes?: string;
}

export interface Order {
  id: string;
  numero: string;
  unidade: string;
  area: Area;
  tipo: OrderType;
  produto: string;
  valorEstimado: number;
  valorFinal?: number;
  justificativa: string;
  status: OrderStatus;
  solicitante: string;
  dataCriacao: string;
  dataAtualizacao: string;
  orcamentos: Quote[];
  historico: OrderHistoryItem[];
  aprovadores?: {
    gerente?: string;
    diretor?: string;
  };
  budgetExcedido?: boolean;
}

export const statusLabels: Record<OrderStatus, string> = {
  criado: 'Criado',
  aguardando_aprovacao: 'Aguardando Aprovação',
  aguardando_aprovacao_gerente: 'Aguardando Aprovação do Gerente',
  aguardando_aprovacao_diretor: 'Aguardando Aprovação do Diretor',
  em_lancamento_orcamentos: 'Em Lançamento de Orçamentos',
  orcamentos_enviados: 'Orçamentos Enviados para Aprovação',
  orcamentos_aprovados: 'Orçamentos Aprovados',
  reprovado: 'Reprovado',
  pedido_final_aprovado: 'Pedido Final Aprovado',
  pdf_gerado: 'PDF Gerado',
  enviado_compras: 'Enviado para Compras',
  enviado_financeiro: 'Enviado para Financeiro',
  processo_finalizado: 'Processo Finalizado',
};

export const tipoLabels: Record<OrderType, string> = {
  equipamento: 'Equipamento',
  suplemento: 'Suplemento',
  manutencao: 'Manutenção',
  servico: 'Serviço',
  material_operacional: 'Material Operacional',
};

export const areaLabels: Record<Area, string> = {
  musculacao: 'Musculação',
  cardio: 'Cardio',
  recepcao: 'Recepção',
  manutencao: 'Manutenção',
  administrativa: 'Administrativa',
  vestiario: 'Vestiário',
};

export const roleLabels: Record<UserRole, string> = {
  operador: 'Operador da Unidade',
  gerente: 'Gerente da Unidade',
  diretor: 'Diretor Corporativo',
  compras: 'Time de Compras',
  financeiro: 'Financeiro',
};
