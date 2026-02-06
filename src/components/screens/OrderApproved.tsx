import { User, Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, FileDown, Printer, Share2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface OrderApprovedProps {
  order: Order;
  user: User;
}

export function OrderApproved({ order, user }: OrderApprovedProps) {
  const approvedQuote = order.orcamentos.length > 0 
    ? order.orcamentos.sort((a, b) => a.valor - b.valor)[0]
    : null;

  const handleDownloadPDF = () => {
    toast.success('PDF baixado com sucesso!', {
      description: `Pedido ${order.numero}.pdf foi baixado.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast.success('Link copiado!', {
      description: 'O link do pedido foi copiado para a área de transferência.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl mb-2">Pedido Final Aprovado</h1>
        <p className="text-muted-foreground">
          O pedido foi aprovado e está pronto para compra
        </p>
      </div>

      {/* Alerta */}
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-900">
          <p className="font-semibold mb-1">Pedido enviado automaticamente para o time de compras</p>
          <p className="text-sm">
            O time de compras da ULTRA ACADEMIA foi notificado via Microsoft Teams e já pode processar a compra.
          </p>
        </AlertDescription>
      </Alert>

      {/* Ações Rápidas */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleDownloadPDF}
              className="flex-1 min-w-[200px] bg-gradient-to-r from-[#ff6b00] to-[#ffa500] hover:from-[#e66000] hover:to-[#ff9500]"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Visualizar / Baixar PDF
            </Button>
            <Button variant="outline" onClick={handlePrint} className="flex-1 min-w-[150px]">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleShare} className="flex-1 min-w-[150px]">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Pedido */}
      <Card>
        <CardHeader className="bg-gray-50">
          <div className="flex items-center justify-between">
            <CardTitle>Resumo do Pedido</CardTitle>
            <StatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Informações Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Número do Pedido</p>
              <p className="text-2xl font-bold text-[#ff6b00]">{order.numero}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="text-lg font-semibold text-green-600">Pedido Final Aprovado</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Unidade</p>
              <p className="font-semibold">{order.unidade}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Área</p>
              <p className="font-semibold capitalize">{order.area}</p>
            </div>
          </div>

          <Separator />

          {/* Produto */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Produto/Serviço</p>
            <p className="text-lg font-semibold">{order.produto}</p>
            <p className="text-sm text-muted-foreground mt-1 capitalize">
              Tipo: {order.tipo.replace('_', ' ')}
            </p>
          </div>

          <Separator />

          {/* Fornecedor Aprovado */}
          {approvedQuote && (
            <>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 mb-3 font-semibold">
                  🏆 Fornecedor Selecionado
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-700 mb-1">Nome</p>
                    <p className="font-bold text-green-900">{approvedQuote.fornecedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 mb-1">Valor Final</p>
                    <p className="text-2xl font-bold text-green-900">
                      R$ {approvedQuote.valor.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                {approvedQuote.valor < order.valorEstimado && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-sm text-green-700">
                      💰 Economia de R$ {(order.valorEstimado - approvedQuote.valor).toLocaleString('pt-BR')} em relação ao valor estimado
                    </p>
                  </div>
                )}
              </div>

              <Separator />
            </>
          )}

          {/* Justificativa */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Justificativa</p>
            <p className="text-sm bg-gray-50 p-4 rounded-lg border">
              {order.justificativa}
            </p>
          </div>

          <Separator />

          {/* Aprovadores */}
          {order.aprovadores && (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-3">Aprovações</p>
                <div className="space-y-2">
                  {order.aprovadores.gerente && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        <span className="font-medium">Gerente:</span> {order.aprovadores.gerente}
                      </span>
                    </div>
                  )}
                  {order.aprovadores.diretor && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        <span className="font-medium">Diretor:</span> {order.aprovadores.diretor}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Data de Criação</p>
              <p className="font-medium">
                {new Date(order.dataCriacao).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Última Atualização</p>
              <p className="font-medium">
                {new Date(order.dataAtualizacao).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
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
          <div className="space-y-4">
            {order.historico.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#ff6b00] rounded-full"></div>
                  {index < order.historico.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-semibold text-sm">{item.acao}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.usuario} • {new Date(item.data).toLocaleString('pt-BR')}
                  </p>
                  {item.detalhes && (
                    <p className="text-sm mt-2 text-gray-600 bg-gray-50 p-2 rounded">
                      {item.detalhes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Próximos Passos */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="font-semibold text-blue-900 mb-3">Próximos Passos</p>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>O time de compras receberá este pedido automaticamente</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>A compra será realizada com o fornecedor aprovado</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>O financeiro processará o pagamento</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Você receberá notificações via Teams sobre cada etapa</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
