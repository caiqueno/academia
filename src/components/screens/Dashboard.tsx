import { User, Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  ShoppingCart, 
  CheckCircle, 
  DollarSign, 
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { mockOrders, mockBudgets } from '@/lib/mockData';

interface DashboardProps {
  user: User;
  onOrderClick?: (orderId: string) => void;
}

export function Dashboard({ user, onOrderClick }: DashboardProps) {
  // Filtrar pedidos relevantes para o usuário
  const getRelevantOrders = () => {
    if (user.role === 'operador' || user.role === 'gerente') {
      return mockOrders.filter(order => order.unidade === user.unidade);
    }
    return mockOrders;
  };

  const relevantOrders = getRelevantOrders();
  
  // Pedidos pendentes de aprovação
  const pendingApprovals = relevantOrders.filter(order => 
    order.status === 'aguardando_aprovacao_gerente' || 
    order.status === 'aguardando_aprovacao_diretor' ||
    order.status === 'orcamentos_enviados'
  );

  // Pedidos em andamento
  const inProgress = relevantOrders.filter(order => 
    !['reprovado', 'processo_finalizado'].includes(order.status)
  );

  // Budget da unidade (se aplicável)
  const unitBudget = user.unidade 
    ? mockBudgets.find(b => b.unidadeNome === user.unidade)
    : null;

  // Valor total em pedidos do mês
  const monthTotal = relevantOrders
    .filter(order => {
      const orderDate = new Date(order.dataCriacao);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && 
             orderDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, order) => sum + order.valorEstimado, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">
          {getGreeting()}, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo das suas atividades no sistema de compras
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pedidos em Andamento
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgress.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Do total de {relevantOrders.length} pedidos
            </p>
          </CardContent>
        </Card>

        {(user.role === 'gerente' || user.role === 'diretor') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aprovações Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingApprovals.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Aguardando sua ação
              </p>
            </CardContent>
          </Card>
        )}

        {unitBudget && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Budget Mensal
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {unitBudget.mensal.toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {unitBudget.mes}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Budget Disponível
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {unitBudget.disponivel.toLocaleString('pt-BR')}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#ff6b00] to-[#ffa500] h-full"
                      style={{ width: `${(unitBudget.consumido / unitBudget.mensal) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {((unitBudget.consumido / unitBudget.mensal) * 100).toFixed(0)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!unitBudget && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total do Mês
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {monthTotal.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Em pedidos criados
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alertas */}
      {unitBudget && unitBudget.disponivel < unitBudget.mensal * 0.2 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-900">
                Atenção: Budget da unidade abaixo de 20%
              </p>
              <p className="text-sm text-yellow-700">
                Restam apenas R$ {unitBudget.disponivel.toLocaleString('pt-BR')} do budget mensal.
                Novos pedidos podem requerer aprovação especial.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pedidos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {relevantOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onOrderClick?.(order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{order.numero}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-600 truncate">{order.produto}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.unidade} • {order.area}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold">
                    R$ {order.valorEstimado.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.dataCriacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}

            {relevantOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum pedido encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Indicação de automação */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="flex items-center gap-3 pt-6">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">
              Sistema Automatizado
            </p>
            <p className="text-sm text-blue-700">
              Todos os status são atualizados automaticamente pelo sistema. 
              Você receberá notificações via Microsoft Teams quando houver ações pendentes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
