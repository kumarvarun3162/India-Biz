import { createContext, useReducer, useEffect } from 'react'
import { getMe } from '../api/auth'

// ── State shape ──────────────────────────────────────────────────────────────
const initialState = {
  user: null,          // full user object from /api/auth/me
  token: null,         // raw JWT string
  isAuthenticated: false,
  isLoading: true,     // true while we check localStorage on mount
}

// ── Reducer ──────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {

    case 'LOGIN':
      localStorage.setItem('ibl_token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }

    case 'LOGOUT':
      localStorage.removeItem('ibl_token')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    default:
      return state
  }
}

// ── Context ──────────────────────────────────────────────────────────────────
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = (token, user) => {
    dispatch({ type: 'LOGIN', payload: { token, user } })
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}