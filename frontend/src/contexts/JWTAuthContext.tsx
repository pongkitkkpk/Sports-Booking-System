import { FC, ReactNode, createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { User } from '../models/user';
import PropTypes from 'prop-types';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  method: 'JWT';
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type Action = InitializeAction | LoginAction | LogoutAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

// The backend mints a standard JWT (auth/auth.service.ts). This mockup only
// needs to know who is logged in and whether the session has expired — it
// never re-verifies the signature client-side, the same way DMS_c's login
// trusts the token it was handed rather than re-checking it.
const decodeJwtPayload = (token: string): any => {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(escape(atob(base64))));
};

const isTokenValid = (token: string): boolean => {
  try {
    const { exp } = decodeJwtPayload(token);
    return !exp || Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

const ROLE_LABEL: Record<string, string> = {
  student: 'นักศึกษา',
  staff: 'เจ้าหน้าที่',
  admin: 'ผู้ดูแลระบบ'
};

const userFromToken = (token: string): User => {
  const { sub, username, role } = decodeJwtPayload(token);
  return {
    id: String(sub),
    username,
    name: username,
    role,
    avatar: '',
    email: '',
    jobtitle: ROLE_LABEL[role] || role,
    location: '',
    posts: '',
    coverImg: '',
    followers: '',
    description: ''
  } as User;
};

const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
};

const handlers: Record<
  string,
  (state: AuthState, action: Action) => AuthState
> = {
  INITIALIZE: (state: AuthState, action: InitializeAction): AuthState => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state: AuthState, action: LoginAction): AuthState => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state: AuthState): AuthState => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state: AuthState, action: Action): AuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = (): void => {
      const accessToken = window.localStorage.getItem('accessToken');

      if (accessToken && isTokenValid(accessToken)) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user: userFromToken(accessToken)
          }
        });
      } else {
        setSession(null);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post<{ access_token: string }>(
        `${API_BASE}/api/auth/login`,
        { username, password }
      );
      const { access_token } = response.data;

      setSession(access_token);
      dispatch({
        type: 'LOGIN',
        payload: {
          user: userFromToken(access_token)
        }
      });
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
      );
    }
  };

  const logout = async (): Promise<void> => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
