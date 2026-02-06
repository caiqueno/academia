import { useState } from 'react';
import { User, Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/lib/mockData';
import { CheckCircle, XCircle, MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ApproveOrderProps {
  user: User;
  onSuccess?: () => void;
}

export function ApproveOrder({ user, onSuccess }: ApproveOrderProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [justificativaReprova, setJustificativaReprova] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtrar pedidos pendentes de aprovação
  const getPendingOrders = () => {
    let filtered = mockOrders;

    if (user.role === 'gerente') {
      filtered = mockOrders.filter(
        order =>
          order.unidade === user.unidade &&
          (order.status === 'aguardando_aprovacao_gerente' || order.status === 'orcamentos_enviados')
      );
    } else if (user.role === 'diretor') {
      filtered = mockOrders.filter(
        order =>
          order.status === 'aguardando_aprovacao_diretor' ||
          (order.status === 'orcamentos_enviados' && order.valorEstimado > 5000)
      );
    }

    return filtered;
  };

  const pendingOrders = getPendingOrders();

  const handleApprove = async () => {
    if (!selectedOrder) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Pedido aprovado com sucesso!', {
      description: 'O sistema atualizou o status automaticamente e notificou os envolvidos via Teams.',
    });

    setSelectedOrder(null);
    setIsProcessing(false);
    onSuccess?.();
  };

  const handleReject = async () => {
    if (!selectedOrder || !justificativaReprova) {
      toast.error('Informe a justificativa para reprovação');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.error('Pedido reprovado', {
      description: 'O solicitante foi notificado via Microsoft Teams.',
    });

    setSelectedOrder(null);
    setJustificativaReprova('');
    setIsProcessing(false);
    onSuccess?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Aprovação de Pedidos</h1>
        <p className="text-muted-foreground">
          {pendingOrders.length} {pendingOrders.length === 1 ? 'pedido aguardando' : 'pedidos aguardando'} sua aprovação
        </p>
      </div>

      {/* Alerta Teams */}
      <Alert className="bg-blue-50 border-blue-200">
        <MessageSquare className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Você recebe notificações via Microsoft Teams quando há pedidos aguardando sua aprovação.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pedidos Pendentes */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Pendentes</CardTitle>
              <CardDescription>Clique para visualizar os detalhes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {pendingOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setJustificativaReprova('');
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedOrder?.id === order.id ? 'bg-orange-50 border-l-4 border-[#ff6b00]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-sm">{order.numero}</span>
                      {order.budgetExcedido && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{order.produto}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        R$ {order.valorEstimado.toLocaleString('pt-BR')}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </button>
                ))}

                {pendingOrders.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum pedido pendente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Pedido Selecionado */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Informações Principais */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedOrder.numero}</CardTitle>
                      <CardDescription className="mt-1">
                        Solicitado por {selectedOrder.solicitante} em{' '}
                        {new Date(selectedOrder.dataCriacao).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Unidade</p>
                      <p className="font-semibold">{selectedOrder.unidade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Área</p>
                      <p className="font-semibold capitalize">{selectedOrder.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                      <p className="font-semibold capitalize">
                        {selectedOrder.tipo.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Valor Estimado</p>
                      <p className="font-bold text-lg">
                        R$ {selectedOrder.valorEstimado.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Produto/Serviço</p>
                    <p className="font-semibold">{selectedOrder.produto}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Justificativa</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg border">
                      {selectedOrder.justificativa}
                    </p>
                  </div>

                  {selectedOrder.budgetExcedido && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-900">
                        <p className="font-semibold mb-1">Alerta de Budget Excedido</p>
                        <p className="text-sm">
                          Este pedido ultrapassará o budget mensal da unidade. Aprovação especial do Diretor necessária.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Histórico */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Histórico do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.historico.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-[#ff6b00] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.acao}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.usuario} • {new Date(item.data).toLocaleString('pt-BR')}
                          </p>
                          {item.detalhes && (
                            <p className="text-sm mt-1 text-gray-600">{item.detalhes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Orçamentos (se houver) */}
              {selectedOrder.orcamentos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Orçamentos Recebidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.orcamentos.map((orcamento, index) => (
                        <div
                          key={orcamento.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{orcamento.fornecedor}</p>
                            <p className="text-sm text-muted-foreground">
                              Enviado em {new Date(orcamento.dataEnvio).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              R$ {orcamento.valor.toLocaleString('pt-BR')}
                            </p>
                            {index === 0 && (
                              <Badge className="bg-green-100 text-green-800">Melhor preço</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ações */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações de Aprovação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isProcessing ? 'Aprovando...' : 'Aprovar Pedido'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isProcessing || !justificativaReprova}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {isProcessing ? 'Reprovando...' : 'Reprovar Pedido'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justificativa-reprova">
                      Justificativa para Reprovação (obrigatório)
                    </Label>
                    <Textarea
                      id="justificativa-reprova"
                      placeholder="Informe o motivo da reprovação..."
                      value={justificativaReprova}
                      onChange={(e) => setJustificativaReprova(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">
                  Selecione um pedido para visualizar os detalhes
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
