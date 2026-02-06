import { useState } from 'react';
import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockOrders } from '@/lib/mockData';
import { DollarSign, CheckCircle, Clock, TrendingUp, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FinanceDepartmentProps {
  user: User;
  onSuccess?: () => void;
}

export function FinanceDepartment({ user, onSuccess }: FinanceDepartmentProps) {
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [observacao, setObservacao] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filtrar pedidos enviados para financeiro
  const financeOrders = mockOrders.filter(
    order => order.status === 'enviado_financeiro'
  );

  const getApprovedQuote = (order: typeof mockOrders[0]) => {
    if (order.orcamentos.length > 0) {
      return order.orcamentos.sort((a, b) => a.valor - b.valor)[0];
    }
    return null;
  };

  const handleConfirmPayment = async () => {
    if (!selectedOrder) return;

    setProcessingOrderId(selectedOrder.id);
    setDialogOpen(false);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Pagamento confirmado!', {
      description: `O pedido ${selectedOrder.numero} foi finalizado. Processo concluído com sucesso.`,
    });

    setProcessingOrderId(null);
    setSelectedOrder(null);
    setObservacao('');
    onSuccess?.();
  };

  const totalValue = financeOrders.reduce((sum, order) => {
    const quote = getApprovedQuote(order);
    return sum + (quote?.valor || order.valorEstimado);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Área Financeira</h1>
        <p className="text-muted-foreground">
          {financeOrders.length}{' '}
          {financeOrders.length === 1 ? 'pedido aguardando' : 'pedidos aguardando'} pagamento
        </p>
      </div>

      {/* Alerta Teams */}
      <Alert className="bg-blue-50 border-blue-200">
        <MessageSquare className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Você recebe notificações via Microsoft Teams quando compras são realizadas e ficam prontas para pagamento.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pedidos Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{financeOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando pagamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total a Pagar
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalValue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Em pagamentos pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fornecedores
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(financeOrders.map(o => getApprovedQuote(o)?.fornecedor).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Diferentes fornecedores</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Prontos para Pagamento</CardTitle>
          <CardDescription>
            Revise os pedidos e confirme os pagamentos após a transferência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Produto/Serviço</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Valor a Pagar</TableHead>
                  <TableHead>Data Compra</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financeOrders.map((order) => {
                  const approvedQuote = getApprovedQuote(order);
                  const finalValue = approvedQuote?.valor || order.valorEstimado;
                  const isProcessing = processingOrderId === order.id;

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.numero}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.unidade}</p>
                          <p className="text-xs text-muted-foreground capitalize">{order.area}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium text-sm truncate">{order.produto}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {order.tipo.replace('_', ' ')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {approvedQuote ? (
                          <div>
                            <p className="font-medium text-sm">{approvedQuote.fornecedor}</p>
                            {approvedQuote.arquivo && (
                              <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                                <FileText className="h-3 w-3" />
                                <span>Com orçamento</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-lg">R$ {finalValue.toLocaleString('pt-BR')}</p>
                        {approvedQuote && approvedQuote.valor < order.valorEstimado && (
                          <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                            Economia de R${' '}
                            {(order.valorEstimado - approvedQuote.valor).toLocaleString('pt-BR')}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.dataAtualizacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={dialogOpen && selectedOrder?.id === order.id}
                          onOpenChange={(open) => {
                            setDialogOpen(open);
                            if (open) {
                              setSelectedOrder(order);
                            } else {
                              setSelectedOrder(null);
                              setObservacao('');
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              disabled={isProcessing}
                              className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle size={16} />
                              {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar Pagamento</DialogTitle>
                              <DialogDescription>
                                Pedido {order.numero} • R$ {finalValue.toLocaleString('pt-BR')}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <p className="font-semibold">Detalhes do Pagamento</p>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fornecedor:</span>
                                    <span className="font-medium">{approvedQuote?.fornecedor || '-'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Valor:</span>
                                    <span className="font-bold">R$ {finalValue.toLocaleString('pt-BR')}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Unidade:</span>
                                    <span className="font-medium">{order.unidade}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="observacao">Observações (opcional)</Label>
                                <Textarea
                                  id="observacao"
                                  placeholder="Adicione informações sobre o pagamento..."
                                  value={observacao}
                                  onChange={(e) => setObservacao(e.target.value)}
                                  rows={3}
                                />
                              </div>

                              <Alert className="bg-yellow-50 border-yellow-200">
                                <AlertDescription className="text-yellow-900 text-sm">
                                  Ao confirmar, o pedido será marcado como finalizado e o processo será concluído.
                                </AlertDescription>
                              </Alert>

                              <div className="flex gap-3">
                                <Button
                                  onClick={handleConfirmPayment}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Confirmar Pagamento
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setDialogOpen(false);
                                    setSelectedOrder(null);
                                    setObservacao('');
                                  }}
                                  className="flex-1"
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {financeOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhum pedido aguardando pagamento</p>
                      <p className="text-xs mt-1">Todos os pagamentos estão em dia</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info sobre fluxo */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="flex items-center gap-3 pt-6">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">Fim do Processo</p>
            <p className="text-sm text-green-700">
              Após confirmar o pagamento, o pedido é marcado como "Processo Finalizado" e todas as partes 
              são notificadas via Microsoft Teams. O histórico completo fica registrado no sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
