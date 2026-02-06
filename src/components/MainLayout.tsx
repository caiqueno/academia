import { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { User, UserRole } from '@/lib/types';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Package,
  DollarSign,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { Badge } from './ui/badge';

export type Screen = 
  | 'dashboard'
  | 'listagem'
  | 'criar-pedido'
  | 'aprovar-pedido'
  | 'alerta-budget'
  | 'lancar-orcamentos'
  | 'aprovar-orcamentos'
  | 'pedido-aprovado'
  | 'compras'
  | 'financeiro';

interface MainLayoutProps {
  user: User;
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  onLogout: () => void;
  children: React.ReactNode;
  pendingApprovals?: number;
}

export function MainLayout({ 
  user, 
  currentScreen, 
  onScreenChange, 
  onLogout, 
  children,
  pendingApprovals = 0
}: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getMenuItemsByRole = (role: UserRole) => {
    const baseItems = [
      { id: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'listagem' as Screen, label: 'Pedidos', icon: ShoppingCart },
    ];

    switch (role) {
      case 'operador':
        return [
          ...baseItems,
          { id: 'criar-pedido' as Screen, label: 'Criar Pedido', icon: Plus },
          { id: 'lancar-orcamentos' as Screen, label: 'Lançar Orçamentos', icon: Package },
        ];
      case 'gerente':
        return [
          ...baseItems,
          { id: 'aprovar-pedido' as Screen, label: 'Aprovações', icon: CheckCircle, badge: pendingApprovals },
          { id: 'aprovar-orcamentos' as Screen, label: 'Aprovar Orçamentos', icon: Package },
        ];
      case 'diretor':
        return [
          ...baseItems,
          { id: 'aprovar-pedido' as Screen, label: 'Aprovações', icon: CheckCircle, badge: pendingApprovals },
          { id: 'alerta-budget' as Screen, label: 'Alertas Budget', icon: AlertCircle },
          { id: 'aprovar-orcamentos' as Screen, label: 'Aprovar Orçamentos', icon: Package },
        ];
      case 'compras':
        return [
          ...baseItems,
          { id: 'compras' as Screen, label: 'Área de Compras', icon: Package },
        ];
      case 'financeiro':
        return [
          ...baseItems,
          { id: 'financeiro' as Screen, label: 'Pagamentos', icon: DollarSign },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItemsByRole(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="hidden lg:block">
                <Logo size="sm" />
              </div>
              <div className="lg:hidden">
                <Logo size="sm" showText={false} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
              >
                <Bell size={20} />
                {pendingApprovals > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff6b00] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingApprovals}
                  </span>
                )}
              </Button>
              <div className="hidden md:flex flex-col items-end">
                <span className="font-semibold text-sm">{user.name}</span>
                <span className="text-xs text-gray-400">{user.role}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onScreenChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff6b00] to-[#ffa500] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge className={isActive ? 'bg-white text-[#ff6b00]' : 'bg-[#ff6b00] text-white'}>
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {user.unidade && (
            <div className="p-4 mt-4 border-t border-gray-200">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Unidade Atual</p>
                <p className="font-semibold text-sm text-gray-900">{user.unidade}</p>
              </div>
            </div>
          )}
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <aside 
              className="w-64 bg-white h-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200">
                <Logo size="sm" />
              </div>
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onScreenChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#ff6b00] to-[#ffa500] text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge className={isActive ? 'bg-white text-[#ff6b00]' : 'bg-[#ff6b00] text-white'}>
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
