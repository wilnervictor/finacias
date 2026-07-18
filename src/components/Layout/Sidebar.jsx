import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { WalletIcon, HomeIcon, UsersIcon, LogOutIcon, KeyIcon, XIcon } from '../icons'
import ChangePasswordModal from '../ChangePasswordModal'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
  }`

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-5">
        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <WalletIcon className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-neutral-900 dark:text-white">Finacias</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <NavLink to="/" end className={linkClass} onClick={onNavigate}>
          <HomeIcon className="h-4.5 w-4.5" />
          Dashboard
        </NavLink>
        {user.isSpecial && (
          <NavLink to="/clientes" className={linkClass} onClick={onNavigate}>
            <UsersIcon className="h-4.5 w-4.5" />
            Clientes
          </NavLink>
        )}
      </nav>

      <div className="px-3 pb-4 pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <KeyIcon className="h-4.5 w-4.5" />
          Alterar senha
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <LogOutIcon className="h-4.5 w-4.5" />
          Sair
        </button>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  )
}

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  return (
    <>
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-neutral-900/40" onClick={onCloseMobile} />
          <div className="relative w-64 h-full bg-white dark:bg-neutral-900 shadow-xl">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-3 h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <XIcon className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={onCloseMobile} />
          </div>
        </div>
      )}
    </>
  )
}
