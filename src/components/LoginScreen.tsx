"use client";

import { User, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UserIcon, ClipboardIcon, TargetIcon, BoxIcon } from "lucide-react";

type LoginScreenProps = {
  onLogin: (user: User) => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const handleQuickLogin = (role: UserRole) => {
    const mockUser: User = {
      id: `demo-${role}-${Date.now()}`, // ID único
      name: role,
      email: `${role}@ultraacademia.com`,
      role,
      unidade: "A",
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        {/* Caixa branca centralizada */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500 p-3 rounded-lg">
              <svg width="32" height="32" fill="white">
                <path d="M6 2 L26 16 L6 30 Z" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h2 className="text-center text-xl font-semibold mb-2">Sistema de Compras</h2>
          <p className="text-center text-sm text-gray-500 mb-4">Faça login para acessar o mini ERP</p>

          {/* Inputs */}
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            placeholder="seu.email@ultraacademia.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            placeholder="********"
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Botão Entrar */}
          <button
            onClick={() => handleQuickLogin("operador")}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold py-3 rounded-md mb-4 hover:opacity-90 transition"
          >
            Entrar
          </button>

          {/* Acesso rápido */}
          <div className="text-center text-gray-500 text-xs mb-2">Acesso rápido para demonstração:</div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin("operador")}
              className="flex items-center justify-center gap-2 py-2 border rounded-md hover:bg-gray-50"
            >
              <UserIcon className="w-4 h-4 text-purple-700" /> operador
            </button>
            <button
              onClick={() => handleQuickLogin("gerente")}
              className="flex items-center justify-center gap-2 py-2 border rounded-md hover:bg-gray-50"
            >
              <ClipboardIcon className="w-4 h-4 text-blue-700" /> gerente
            </button>
            <button
              onClick={() => handleQuickLogin("diretor")}
              className="flex items-center justify-center gap-2 py-2 border rounded-md hover:bg-gray-50"
            >
              <TargetIcon className="w-4 h-4 text-pink-500" /> diretor
            </button>
            <button
              onClick={() => handleQuickLogin("compras")}
              className="flex items-center justify-center gap-2 py-2 border rounded-md hover:bg-gray-50"
            >
              <BoxIcon className="w-4 h-4 text-yellow-700" /> compras
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-gray-400 text-xs mt-4">
          ULTRA ACADEMIA © 2026 - Todos os direitos reservados
        </div>
      </div>
    </div>
  );
}
