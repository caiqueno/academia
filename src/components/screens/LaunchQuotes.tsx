import { useState } from 'react';
import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockOrders } from '@/lib/mockData';
import { Info, Upload, Plus, Trash2, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/StatusBadge';

interface Quote {
  fornecedor: string;
  valor: string;
  arquivo: File | null;
}

interface LaunchQuotesProps {
  user: User;
  onSuccess?: () => void;
}

export function LaunchQuotes({ user, onSuccess }: LaunchQuotesProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([
    { fornecedor: '', valor: '', arquivo: null },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar pedidos aguardando lançamento de orçamentos
  const pendingQuoteOrders = mockOrders.filter(
    order =>
      (user.role === 'operador' && order.unidade === user.unidade) ||
      user.role !== 'operador'
  ).filter(order => order.status === 'em_lancamento_orcamentos');

  const selectedOrder = pendingQuoteOrders.find(o => o.id === selectedOrderId);

  const addQuote = () => {
    if (quotes.length < 3) {
      setQuotes([...quotes, { fornecedor: '', valor: '', arquivo: null }]);
    }
  };

  const removeQuote = (index: number) => {
    if (quotes.length > 1) {
      setQuotes(quotes.filter((_, i) => i !== index));
    }
  };

  const updateQuote = (index: number, field: keyof Quote, value: string | File | null) => {
    const newQuotes = [...quotes];
    newQuotes[index] = { ...newQuotes[index], [field]: value };
    setQuotes(newQuotes);
  };

  const isFormValid = () => {
    if (!selectedOrder) return false;
    // Pelo menos 1 orçamento completo
    const completeQuotes = quotes.filter(
      q => q.fornecedor.trim() && q.valor.trim() && parseFloat(q.valor) > 0
    );
    return completeQuotes.length >= 1;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error('Preencha pelo menos 1 orçamento completo');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Orçamentos enviados com sucesso!', {
      description: 'Os orçamentos foram enviados para aprovação automaticamente.',
    });

    setSelectedOrderId(null);
    setQuotes([{ fornecedor: '', valor: '', arquivo: null }]);
    setIsSubmitting(false);
    onSuccess?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Lançamento de Orçamentos</h1>
        <p className="text-muted-foreground">
          {pendingQuoteOrders.length}{' '}
          {pendingQuoteOrders.length === 1 ? 'pedido aguardando' : 'pedidos aguardando'} orçamentos
        </p>
      </div>

      {/* Alerta */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <p className="font-semibold mb-1">Regras para Orçamentos</p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Mínimo de 1 orçamento obrigatório</li>
            <li>Máximo de 3 orçamentos permitidos</li>
            <li>Após o envio, os orçamentos vão automaticamente para aprovação</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pedidos */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Aprovados</CardTitle>
              <CardDescription>Aguardando orçamentos</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {pendingQuoteOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setQuotes([{ fornecedor: '', valor: '', arquivo: null }]);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedOrderId === order.id ? 'bg-orange-50 border-l-4 border-[#ff6b00]' : ''
                    }`}
                  >
                    <div className="mb-2">
                      <span className="font-semibold text-sm">{order.numero}</span>
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

                {pendingQuoteOrders.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum pedido aguardando orçamentos</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de Orçamentos */}
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
                    <p className="text-sm text-muted-foreground mb-1">Valor de Referência</p>
                    <p className="text-lg font-bold text-[#ff6b00]">
                      R$ {selectedOrder.valorEstimado.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Orçamentos */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Orçamentos ({quotes.length}/3)</CardTitle>
                      <CardDescription>Preencha as informações dos fornecedores</CardDescription>
                    </div>
                    {quotes.length < 3 && (
                      <Button
                        onClick={addQuote}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Plus size={16} />
                        Adicionar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {quotes.map((quote, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-dashed rounded-lg space-y-4 relative"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">
                          Orçamento {index + 1}
                          {index === 0 && (
                            <span className="ml-2 text-xs text-red-600">(obrigatório)</span>
                          )}
                        </h4>
                        {quotes.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuote(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`fornecedor-${index}`}>Fornecedor *</Label>
                          <Input
                            id={`fornecedor-${index}`}
                            placeholder="Nome do fornecedor"
                            value={quote.fornecedor}
                            onChange={(e) => updateQuote(index, 'fornecedor', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`valor-${index}`}>Valor (R$) *</Label>
                          <Input
                            id={`valor-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                            value={quote.valor}
                            onChange={(e) => updateQuote(index, 'valor', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`arquivo-${index}`}>
                          Arquivo do Orçamento (opcional)
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`arquivo-${index}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              updateQuote(index, 'arquivo', file);
                            }}
                            className="flex-1"
                          />
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        {quote.arquivo && (
                          <p className="text-xs text-green-600">
                            ✓ {quote.arquivo.name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Ações */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={!isFormValid() || isSubmitting}
                      className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ffa500] hover:from-[#e66000] hover:to-[#ff9500]"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>Enviando orçamentos...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Enviar Orçamentos para Aprovação
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Após o envio, o sistema mudará automaticamente o status para "Orçamentos Enviados" 
                      e notificará o aprovador via Teams.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Upload className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-muted-foreground">
                  Selecione um pedido para lançar orçamentos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
