import { createContext, useReducer, useEffect } from 'react'
import { getMe } from '../api/auth'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

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

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check localStorage on first load
  useEffect(() => {
    const token = localStorage.getItem('ibl_token')
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return
    }
    getMe()
      .then((res) => {
        dispatch({ type: 'LOGIN', payload: { token, user: res.data } })
      })
      .catch(() => {
        localStorage.removeItem('ibl_token')
        dispatch({ type: 'SET_LOADING', payload: false })
      })
  }, [])

  const login = (token, user) =>
    dispatch({ type: 'LOGIN', payload: { token, user } })

  const logout = () =>
    dispatch({ type: 'LOGOUT' })

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}