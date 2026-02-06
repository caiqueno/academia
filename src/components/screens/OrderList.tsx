import { useState } from 'react';
import { User, Order, OrderStatus, OrderType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockOrders } from '@/lib/mockData';
import { Search, Filter, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OrderListProps {
  user: User;
  onOrderClick?: (orderId: string) => void;
}

export function OrderList({ user, onOrderClick }: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnidade, setFilterUnidade] = useState<string>('todas');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');

  // Filtrar pedidos relevantes para o usuário
  const getRelevantOrders = () => {
    if (user.role === 'operador' || user.role === 'gerente') {
      return mockOrders.filter(order => order.unidade === user.unidade);
    }
    return mockOrders;
  };

  // Aplicar filtros
  const filteredOrders = getRelevantOrders().filter(order => {
    const matchesSearch = 
      order.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.solicitante.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUnidade = filterUnidade === 'todas' || order.unidade === filterUnidade;
    const matchesStatus = filterStatus === 'todos' || order.status === filterStatus;
    const matchesTipo = filterTipo === 'todos' || order.tipo === filterTipo;

    return matchesSearch && matchesUnidade && matchesStatus && matchesTipo;
  });

  // Extrair unidades únicas
  const unidades = ['todas', ...Array.from(new Set(mockOrders.map(o => o.unidade)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Pedidos de Compra</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os pedidos de compra
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro Unidade */}
            {(user.role === 'diretor' || user.role === 'compras' || user.role === 'financeiro') && (
              <Select value={filterUnidade} onValueChange={setFilterUnidade}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as unidades" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map(unidade => (
                    <SelectItem key={unidade} value={unidade}>
                      {unidade === 'todas' ? 'Todas as unidades' : unidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Filtro Status */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="criado">Criado</SelectItem>
                <SelectItem value="aguardando_aprovacao_gerente">Aguardando Gerente</SelectItem>
                <SelectItem value="aguardando_aprovacao_diretor">Aguardando Diretor</SelectItem>
                <SelectItem value="em_lancamento_orcamentos">Em Lançamento</SelectItem>
                <SelectItem value="orcamentos_enviados">Orçamentos Enviados</SelectItem>
                <SelectItem value="pedido_final_aprovado">Aprovado</SelectItem>
                <SelectItem value="reprovado">Reprovado</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro Tipo */}
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="equipamento">Equipamento</SelectItem>
                <SelectItem value="suplemento">Suplemento</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
                <SelectItem value="servico">Serviço</SelectItem>
                <SelectItem value="material_operacional">Material Operacional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Limpar filtros */}
          {(searchTerm || filterUnidade !== 'todas' || filterStatus !== 'todos' || filterTipo !== 'todos') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterUnidade('todas');
                setFilterStatus('todos');
                setFilterTipo('todos');
              }}
              className="mt-4"
            >
              Limpar filtros
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Pedidos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  {(user.role === 'diretor' || user.role === 'compras' || user.role === 'financeiro') && (
                    <TableHead>Unidade</TableHead>
                  )}
                  <TableHead>Produto/Serviço</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{order.numero}</TableCell>
                    {(user.role === 'diretor' || user.role === 'compras' || user.role === 'financeiro') && (
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.unidade}</p>
                          <p className="text-xs text-muted-foreground capitalize">{order.area}</p>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-sm truncate">{order.produto}</p>
                        <p className="text-xs text-muted-foreground">por {order.solicitante}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">
                        {order.tipo.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      R$ {order.valorEstimado.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.dataCriacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOrderClick?.(order.id)}
                      >
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={user.role === 'diretor' || user.role === 'compras' || user.role === 'financeiro' ? 8 : 7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum pedido encontrado com os filtros aplicados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info sobre automação */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="flex items-center gap-3 pt-6">
          <Calendar className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">Status Automático</p>
            <p className="text-sm text-blue-700">
              Todos os status são atualizados automaticamente pelo sistema conforme as ações são realizadas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
