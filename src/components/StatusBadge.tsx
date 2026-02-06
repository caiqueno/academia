import { OrderStatus, statusLabels } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'criado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'aguardando_aprovacao':
      case 'aguardando_aprovacao_gerente':
      case 'aguardando_aprovacao_diretor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'em_lancamento_orcamentos':
      case 'orcamentos_enviados':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'orcamentos_aprovados':
      case 'pedido_final_aprovado':
      case 'pdf_gerado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'enviado_compras':
      case 'enviado_financeiro':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processo_finalizado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'reprovado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusColor(status)} font-medium border`}
    >
      {statusLabels[status]}
    </Badge>
  );
}
