import { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/lib/types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciais inválidas');
    }
  };

  const quickLogin = (user: User) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#0a0a0a] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmY2YjAwIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-2xl">
            <Logo size="lg" />
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-[#2a2a2a]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sistema de Compras</CardTitle>
            <CardDescription className="text-center">
              Faça login para acessar o mini ERP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@ultraacademia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ffa500] hover:from-[#e66000] hover:to-[#ff9500]"
              >
                Entrar
              </Button>
            </form>

            {/* Quick Access para demonstração */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Acesso rápido para demonstração:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mockUsers.slice(0, 4).map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin(user)}
                    className="text-xs"
                  >
                    {user.role === 'operador' ? '👤' : 
                     user.role === 'gerente' ? '👔' :
                     user.role === 'diretor' ? '🎯' : '📦'} {user.role}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            ULTRA ACADEMIA © 2026 - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
