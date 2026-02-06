import { useState } from 'react';
import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockOrders } from '@/lib/mockData';
import { Package, FileDown, CheckCircle, ShoppingBag, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PurchasesDepartmentProps {
  user: User;
  onSuccess?: () => void;
}

export function PurchasesDepartment({ user, onSuccess }: PurchasesDepartmentProps) {
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);

  // Filtrar pedidos enviados para compras
  const purchaseOrders = mockOrders.filter(
    order =>
      order.status === 'enviado_compras' ||
      order.status === 'pedido_final_aprovado' ||
      order.status === 'pdf_gerado'
  );

  const handleDownloadPDF = (orderId: string, orderNumber: string) => {
    toast.success(`PDF baixado: ${orderNumber}`, {
      description: 'O arquivo foi baixado com sucesso.',
    });
  };

  const handleMarkAsPurchased = async (orderId: string, orderNumber: string) => {
    setProcessingOrderId(orderId);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Compra registrada!', {
      description: `O pedido ${orderNumber} foi enviado automaticamente para o Financeiro.`,
    });

    setProcessingOrderId(null);
    onSuccess?.();
  };

  const getApprovedQuote = (order: typeof mockOrders[0]) => {
    if (order.orcamentos.length > 0) {
      return order.orcamentos.sort((a, b) => a.valor - b.valor)[0];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Área de Compras</h1>
        <p className="text-muted-foreground">
          {purchaseOrders.length}{' '}
          {purchaseOrders.length === 1 ? 'pedido aprovado' : 'pedidos aprovados'} para processamento
        </p>
      </div>

      {/* Alerta Teams */}
      <Alert className="bg-blue-50 border-blue-200">
        <MessageSquare className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Você recebe notificações via Microsoft Teams quando novos pedidos aprovados chegam para compras.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pedidos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando compra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R${' '}
              {purchaseOrders
                .reduce((sum, order) => {
                  const quote = getApprovedQuote(order);
                  return sum + (quote?.valor || order.valorEstimado);
                }, 0)
                .toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Em pedidos aprovados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unidades Atendidas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(purchaseOrders.map(o => o.unidade)).size}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Diferentes unidades</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Aprovados para Compra</CardTitle>
          <CardDescription>
            Faça o download do PDF e marque como realizado após efetuar a compra
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
                  <TableHead>Valor Final</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((order) => {
                  const approvedQuote = getApprovedQuote(order);
                  const finalValue = approvedQuote?.valor || order.valorEstimado;

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
                            {order.orcamentos.length > 1 && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Melhor de {order.orcamentos.length}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            A definir
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-lg">R$ {finalValue.toLocaleString('pt-BR')}</p>
                        {approvedQuote && approvedQuote.valor < order.valorEstimado && (
                          <p className="text-xs text-green-600">
                            ↓ R${' '}
                            {(order.valorEstimado - approvedQuote.valor).toLocaleString('pt-BR')}{' '}
                            economizado
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadPDF(order.id, order.numero)}
                            className="gap-2"
                          >
                            <FileDown size={16} />
                            Download PDF
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsPurchased(order.id, order.numero)}
                            disabled={processingOrderId === order.id}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle size={16} />
                            {processingOrderId === order.id ? 'Processando...' : 'Marcar como Realizado'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {purchaseOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhum pedido aguardando compra</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info sobre fluxo */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="flex items-center gap-3 pt-6">
          <Package className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">Fluxo Automatizado</p>
            <p className="text-sm text-blue-700">
              Após marcar como realizado, o pedido é enviado automaticamente para o Financeiro para pagamento.
              O sistema notifica via Teams.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
