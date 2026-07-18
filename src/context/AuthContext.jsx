import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService
      .me()
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(credentials) {
        const loggedUser = await authService.login(credentials)
        setUser(loggedUser)
        return loggedUser
      },
      async register(data) {
        const newUser = await authService.register(data)
        setUser(newUser)
        return newUser
      },
      logout() {
        authService.logout()
        setUser(null)
      },
      async changePassword(currentPassword, newPassword) {
        await authService.changePassword(currentPassword, newPassword)
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
