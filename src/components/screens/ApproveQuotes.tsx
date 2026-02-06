import { useState } from 'react';
import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockOrders } from '@/lib/mockData';
import { CheckCircle, XCircle, TrendingDown, Award, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ApproveQuotesProps {
  user: User;
  onSuccess?: () => void;
}

export function ApproveQuotes({ user, onSuccess }: ApproveQuotesProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [justificativaReprova, setJustificativaReprova] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtrar pedidos com orçamentos enviados
  const ordersWithQuotes = mockOrders.filter(order => {
    if (user.role === 'gerente') {
      return order.unidade === user.unidade && order.status === 'orcamentos_enviados';
    }
    return order.status === 'orcamentos_enviados';
  });

  const selectedOrder = ordersWithQuotes.find(o => o.id === selectedOrderId);

  const handleApprove = async () => {
    if (!selectedOrder || !selectedQuoteId) {
      toast.error('Selecione um orçamento para aprovar');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Orçamento aprovado com sucesso!', {
      description: 'O sistema gerou o pedido final e notificou o time de compras via Teams.',
    });

    setSelectedOrderId(null);
    setSelectedQuoteId(null);
    setJustificativaReprova('');
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

    toast.error('Orçamentos reprovados', {
      description: 'O solicitante foi notificado para enviar novos orçamentos.',
    });

    setSelectedOrderId(null);
    setSelectedQuoteId(null);
    setJustificativaReprova('');
    setIsProcessing(false);
    onSuccess?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Aprovação de Orçamentos</h1>
        <p className="text-muted-foreground">
          {ordersWithQuotes.length}{' '}
          {ordersWithQuotes.length === 1 ? 'pedido com orçamentos' : 'pedidos com orçamentos'} aguardando aprovação
        </p>
      </div>

      {/* Alerta */}
      <Alert className="bg-blue-50 border-blue-200">
        <Award className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Analise os orçamentos recebidos e selecione o melhor custo-benefício para a unidade.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pedidos */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos com Orçamentos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {ordersWithQuotes.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setSelectedQuoteId(null);
                      setJustificativaReprova('');
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedOrderId === order.id ? 'bg-orange-50 border-l-4 border-[#ff6b00]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-sm">{order.numero}</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {order.orcamentos.length} orç.
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{order.produto}</p>
                    <p className="text-xs text-muted-foreground mb-2">{order.unidade}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        R$ {order.valorEstimado.toLocaleString('pt-BR')}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </button>
                ))}

                {ordersWithQuotes.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum orçamento pendente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análise de Orçamentos */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Info do Pedido */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedOrder.numero}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedOrder.unidade} • {selectedOrder.area}
                      </CardDescription>
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Produto/Serviço</p>
                    <p className="font-semibold">{selectedOrder.produto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Valor Estimado Inicial</p>
                    <p className="text-lg font-bold">
                      R$ {selectedOrder.valorEstimado.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Comparativo de Orçamentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                    Comparativo de Orçamentos
                  </CardTitle>
                  <CardDescription>
                    {selectedOrder.orcamentos.length}{' '}
                    {selectedOrder.orcamentos.length === 1 ? 'orçamento recebido' : 'orçamentos recebidos'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedOrder.orcamentos
                    .sort((a, b) => a.valor - b.valor)
                    .map((orcamento, index) => {
                      const economia = selectedOrder.valorEstimado - orcamento.valor;
                      const percentEconomia = (economia / selectedOrder.valorEstimado) * 100;
                      const isBestPrice = index === 0;

                      return (
                        <div
                          key={orcamento.id}
                          onClick={() => setSelectedQuoteId(orcamento.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedQuoteId === orcamento.id
                              ? 'border-[#ff6b00] bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${isBestPrice ? 'ring-2 ring-green-200' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{orcamento.fornecedor}</h4>
                                {isBestPrice && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <Award className="h-3 w-3 mr-1" />
                                    Melhor Preço
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Enviado em {new Date(orcamento.dataEnvio).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#ff6b00]">
                                R$ {orcamento.valor.toLocaleString('pt-BR')}
                              </p>
                              {economia > 0 ? (
                                <p className="text-xs text-green-600 font-medium">
                                  ↓ Economia de R$ {economia.toLocaleString('pt-BR')} ({percentEconomia.toFixed(1)}%)
                                </p>
                              ) : economia < 0 ? (
                                <p className="text-xs text-red-600 font-medium">
                                  ↑ Acima em R$ {Math.abs(economia).toLocaleString('pt-BR')}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-600">Igual ao estimado</p>
                              )}
                            </div>
                          </div>

                          {orcamento.arquivo && (
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                              <FileText className="h-4 w-4" />
                              <span>{orcamento.arquivo}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </CardContent>
              </Card>

              {/* Resumo */}
              {selectedOrder.orcamentos.length > 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-green-700 mb-1">Menor Valor</p>
                        <p className="text-xl font-bold text-green-900">
                          R$ {Math.min(...selectedOrder.orcamentos.map(o => o.valor)).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 mb-1">Maior Valor</p>
                        <p className="text-xl font-bold text-green-900">
                          R$ {Math.max(...selectedOrder.orcamentos.map(o => o.valor)).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 mb-1">Diferença</p>
                        <p className="text-xl font-bold text-green-900">
                          R$ {(Math.max(...selectedOrder.orcamentos.map(o => o.valor)) -
                            Math.min(...selectedOrder.orcamentos.map(o => o.valor))).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ações */}
              <Card>
                <CardHeader>
                  <CardTitle>Decisão de Aprovação</CardTitle>
                  <CardDescription>
                    Selecione um orçamento acima e aprove ou reprove todos os orçamentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleApprove}
                      disabled={isProcessing || !selectedQuoteId}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isProcessing ? 'Aprovando...' : 'Aprovar Orçamento Selecionado'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isProcessing || !justificativaReprova}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {isProcessing ? 'Reprovando...' : 'Reprovar Todos'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justificativa-reprova">
                      Justificativa para Reprovação (obrigatório para reprovar)
                    </Label>
                    <Textarea
                      id="justificativa-reprova"
                      placeholder="Informe o motivo para solicitar novos orçamentos..."
                      value={justificativaReprova}
                      onChange={(e) => setJustificativaReprova(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-900 text-sm">
                      Ao aprovar, o sistema gerará automaticamente o pedido final e enviará para o time de compras.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">
                  Selecione um pedido para analisar os orçamentos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
