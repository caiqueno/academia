import { useState } from 'react';
import { User } from './lib/types';
import { LoginScreen } from './components/LoginScreen';
import { MainLayout, Screen } from './components/MainLayout';
import { Dashboard } from './components/screens/Dashboard';
import { OrderList } from './components/screens/OrderList';
import { CreateOrder } from './components/screens/CreateOrder';
import { ApproveOrder } from './components/screens/ApproveOrder';
import { BudgetAlert } from './components/screens/BudgetAlert';
import { LaunchQuotes } from './components/screens/LaunchQuotes';
import { ApproveQuotes } from './components/screens/ApproveQuotes';
import { PurchasesDepartment } from './components/screens/PurchasesDepartment';
import { FinanceDepartment } from './components/screens/FinanceDepartment';
import { Toaster } from './components/ui/sonner';
import { mockOrders } from './lib/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');

  // Simular contagem de aprovações pendentes
  const getPendingApprovalsCount = (user: User): number => {
    if (!user) return 0;

    if (user.role === 'gerente') {
      return mockOrders.filter(
        order =>
          order.unidade === user.unidade &&
          (order.status === 'aguardando_aprovacao_gerente' || order.status === 'orcamentos_enviados')
      ).length;
    } else if (user.role === 'diretor') {
      return mockOrders.filter(
        order =>
          order.status === 'aguardando_aprovacao_diretor' || order.budgetExcedido
      ).length;
    }

    return 0;
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('dashboard');
  };

  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    if (!currentUser) return null;

    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard user={currentUser} />;
      case 'listagem':
        return <OrderList user={currentUser} />;
      case 'criar-pedido':
        return <CreateOrder user={currentUser} onSuccess={() => setCurrentScreen('listagem')} />;
      case 'aprovar-pedido':
        return <ApproveOrder user={currentUser} onSuccess={() => setCurrentScreen('listagem')} />;
      case 'alerta-budget':
        return <BudgetAlert user={currentUser} onSuccess={() => setCurrentScreen('listagem')} />;
      case 'lancar-orcamentos':
        return <LaunchQuotes user={currentUser} onSuccess={() => setCurrentScreen('listagem')} />;
      case 'aprovar-orcamentos':
        return <ApproveQuotes user={currentUser} onSuccess={() => setCurrentScreen('listagem')} />;
      case 'compras':
        return <PurchasesDepartment user={currentUser} onSuccess={() => setCurrentScreen('listagem')} />;
      case 'financeiro':
        return <FinanceDepartment user={currentUser} onSuccess={() => setCurrentScreen('listagem')} />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  // Tela de Login
  if (!currentUser) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Sistema Principal
  return (
    <>
      <MainLayout
        user={currentUser}
        currentScreen={currentScreen}
        onScreenChange={handleScreenChange}
        onLogout={handleLogout}
        pendingApprovals={getPendingApprovalsCount(currentUser)}
      >
        {renderScreen()}
      </MainLayout>
      <Toaster position="top-right" />
    </>
  );
}
