import { useState } from 'react';
import { User, Area, OrderType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Info, Send } from 'lucide-react';
import { toast } from 'sonner';

interface CreateOrderProps {
  user: User;
  onSuccess?: () => void;
}

export function CreateOrder({ user, onSuccess }: CreateOrderProps) {
  const [area, setArea] = useState<Area | ''>('');
  const [tipo, setTipo] = useState<OrderType | ''>('');
  const [produto, setProduto] = useState('');
  const [valorEstimado, setValorEstimado] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Pedido criado com sucesso!', {
      description: 'O pedido foi enviado para aprovação automaticamente.',
    });

    // Limpar formulário
    setArea('');
    setTipo('');
    setProduto('');
    setValorEstimado('');
    setJustificativa('');
    setIsSubmitting(false);

    onSuccess?.();
  };

  const isFormValid = area && tipo && produto && valorEstimado && justificativa;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Criar Pedido de Compra</h1>
        <p className="text-muted-foreground">
          Preencha os dados do pedido para enviar para aprovação
        </p>
      </div>

      {/* Alerta sobre automação */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          O status do pedido é controlado automaticamente pelo sistema. 
          Após o envio, você receberá notificações via Microsoft Teams sobre o andamento.
        </AlertDescription>
      </Alert>

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Pedido</CardTitle>
            <CardDescription>
              Unidade: <span className="font-semibold text-foreground">{user.unidade}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Área */}
            <div className="space-y-2">
              <Label htmlFor="area">Área Solicitante *</Label>
              <Select value={area} onValueChange={(value) => setArea(value as Area)}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="musculacao">Musculação</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="recepcao">Recepção</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="administrativa">Administrativa</SelectItem>
                  <SelectItem value="vestiario">Vestiário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Compra *</Label>
              <Select value={tipo} onValueChange={(value) => setTipo(value as OrderType)}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipamento">Equipamento</SelectItem>
                  <SelectItem value="suplemento">Suplemento</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="servico">Serviço</SelectItem>
                  <SelectItem value="material_operacional">Material Operacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Produto/Serviço */}
            <div className="space-y-2">
              <Label htmlFor="produto">Produto ou Serviço *</Label>
              <Input
                id="produto"
                placeholder="Ex: Esteira Profissional TechnoGym"
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
                required
              />
            </div>

            {/* Valor Estimado */}
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Estimado (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={valorEstimado}
                onChange={(e) => setValorEstimado(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Informe uma estimativa do valor. Os orçamentos serão solicitados posteriormente.
              </p>
            </div>

            {/* Justificativa */}
            <div className="space-y-2">
              <Label htmlFor="justificativa">Justificativa *</Label>
              <Textarea
                id="justificativa"
                placeholder="Descreva a necessidade desta compra..."
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Explique o motivo da solicitação e sua importância para a unidade.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex gap-3 mt-6">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="bg-gradient-to-r from-[#ff6b00] to-[#ffa500] hover:from-[#e66000] hover:to-[#ff9500]"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Enviando...</span>
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar para Aprovação
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setArea('');
              setTipo('');
              setProduto('');
              setValorEstimado('');
              setJustificativa('');
            }}
          >
            Limpar Formulário
          </Button>
        </div>
      </form>

      {/* Fluxo de Aprovação */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Fluxo Automático de Aprovação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full p-1 mt-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ffa500] flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
              </div>
              <div>
                <p className="font-semibold">Criação do Pedido</p>
                <p className="text-sm text-muted-foreground">
                  Você preenche os dados do pedido
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full p-1 mt-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ffa500] flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
              </div>
              <div>
                <p className="font-semibold">Aprovação do Gerente</p>
                <p className="text-sm text-muted-foreground">
                  O sistema envia automaticamente para o gerente da unidade
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full p-1 mt-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ffa500] flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
              </div>
              <div>
                <p className="font-semibold">Aprovação do Diretor (se necessário)</p>
                <p className="text-sm text-muted-foreground">
                  Valores acima de R$ 5.000 ou budget excedido
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-full p-1 mt-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ffa500] flex items-center justify-center text-white text-xs font-bold">
                  4
                </div>
              </div>
              <div>
                <p className="font-semibold">Lançamento de Orçamentos</p>
                <p className="text-sm text-muted-foreground">
                  Você receberá uma notificação para lançar até 3 orçamentos
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
