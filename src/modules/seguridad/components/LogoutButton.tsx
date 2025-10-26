import { LogOut } from 'lucide-react';
import React from 'react'

const LogoutButton = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
        window.location.href = '/login';
    }
  return (
      <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-gray-100">
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
      </button>
  )
}

export default LogoutButton
