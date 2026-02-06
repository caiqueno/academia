import { useState } from 'react';
import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { mockOrders, mockBudgets } from '@/lib/mockData';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BudgetAlertProps {
  user: User;
  onSuccess?: () => void;
}

export function BudgetAlert({ user, onSuccess }: BudgetAlertProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [justificativa, setJustificativa] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtrar pedidos que excedem budget
  const budgetExceededOrders = mockOrders.filter(
    order => order.budgetExcedido && order.status === 'aguardando_aprovacao_diretor'
  );

  const selectedOrder = budgetExceededOrders.find(o => o.id === selectedOrderId);

  // Obter budget da unidade do pedido selecionado
  const getUnitBudget = (unidadeNome: string) => {
    return mockBudgets.find(b => b.unidadeNome === unidadeNome);
  };

  const handleApproveException = async () => {
    if (!selectedOrder || !justificativa) {
      toast.error('Informe a justificativa para aprovação excepcional');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Pedido aprovado excepcionalmente!', {
      description: 'O sistema atualizou o status e notificou os envolvidos via Teams.',
    });

    setSelectedOrderId(null);
    setJustificativa('');
    setIsProcessing(false);
    onSuccess?.();
  };

  const handleReject = async () => {
    if (!selectedOrder || !justificativa) {
      toast.error('Informe a justificativa para reprovação');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.error('Pedido reprovado', {
      description: 'O solicitante foi notificado via Microsoft Teams.',
    });

    setSelectedOrderId(null);
    setJustificativa('');
    setIsProcessing(false);
    onSuccess?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Alertas de Budget Excedido</h1>
        <p className="text-muted-foreground">
          {budgetExceededOrders.length}{' '}
          {budgetExceededOrders.length === 1 ? 'pedido necessita' : 'pedidos necessitam'} aprovação especial
        </p>
      </div>

      {/* Alerta principal */}
      <Alert className="bg-yellow-50 border-yellow-300">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-900">
          <p className="font-semibold mb-1">Aprovação Excepcional Necessária</p>
          <p className="text-sm">
            Os pedidos abaixo ultrapassam o budget mensal disponível de suas unidades e requerem sua autorização especial como Diretor.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pedidos */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos com Budget Excedido</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {budgetExceededOrders.map((order) => {
                  const budget = getUnitBudget(order.unidade);
                  const exceededAmount = budget
                    ? order.valorEstimado - budget.disponivel
                    : 0;

                  return (
                    <button
                      key={order.id}
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setJustificativa('');
                      }}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedOrderId === order.id ? 'bg-yellow-50 border-l-4 border-yellow-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-sm">{order.numero}</span>
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{order.produto}</p>
                      <p className="text-xs text-muted-foreground mb-2">{order.unidade}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          R$ {order.valorEstimado.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-xs text-yellow-700 font-medium">
                          +R$ {exceededAmount.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {budgetExceededOrders.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30 text-green-500" />
                    <p>Nenhum pedido excedendo budget</p>
                    <p className="text-xs mt-1">Todas as unidades dentro do limite</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Análise de Budget */}
              <Card className="border-yellow-200">
                <CardHeader className="bg-yellow-50">
                  <CardTitle className="flex items-center gap-2 text-yellow-900">
                    <AlertTriangle className="h-5 w-5" />
                    Análise de Budget - {selectedOrder.unidade}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {(() => {
                    const budget = getUnitBudget(selectedOrder.unidade);
                    if (!budget) return null;

                    const newTotal = budget.consumido + selectedOrder.valorEstimado;
                    const percentConsumed = (newTotal / budget.mensal) * 100;
                    const exceededAmount = selectedOrder.valorEstimado - budget.disponivel;

                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Budget Mensal</p>
                            <p className="text-xl font-bold">
                              R$ {budget.mensal.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Já Consumido</p>
                            <p className="text-xl font-bold">
                              R$ {budget.consumido.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-sm text-green-700 mb-1">Disponível Atual</p>
                            <p className="text-xl font-bold text-green-800">
                              R$ {budget.disponivel.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-sm text-red-700 mb-1">Valor do Pedido</p>
                            <p className="text-xl font-bold text-red-800">
                              R$ {selectedOrder.valorEstimado.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-semibold text-yellow-900">Impacto no Budget</p>
                            <TrendingUp className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-yellow-800">Consumo após aprovação</span>
                                <span className="font-bold text-yellow-900">{percentConsumed.toFixed(1)}%</span>
                              </div>
                              <Progress value={Math.min(percentConsumed, 100)} className="h-3" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-yellow-800">Excede o budget em:</span>
                              <span className="font-bold text-red-700">
                                R$ {exceededAmount.toLocaleString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Detalhes do Pedido */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedOrder.numero}</CardTitle>
                  <CardDescription>
                    Solicitado por {selectedOrder.solicitante}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

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
                </CardContent>
              </Card>

              {/* Ações */}
              <Card>
                <CardHeader>
                  <CardTitle>Decisão do Diretor</CardTitle>
                  <CardDescription>
                    Como Diretor Corporativo, você pode aprovar excepcionalmente este pedido ou reprová-lo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="justificativa">
                      Justificativa da Decisão (obrigatório)
                    </Label>
                    <Textarea
                      id="justificativa"
                      placeholder="Informe o motivo da sua decisão..."
                      value={justificativa}
                      onChange={(e) => setJustificativa(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleApproveException}
                      disabled={isProcessing || !justificativa}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isProcessing ? 'Aprovando...' : 'Aprovar Excepcionalmente'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isProcessing || !justificativa}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {isProcessing ? 'Reprovando...' : 'Reprovar Pedido'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">
                  Selecione um pedido para visualizar a análise de budget
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
