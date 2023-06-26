import React from 'react';
import { useCookies } from 'react-cookie';

export const CookieContext = React.createContext();

export function CookieProvider({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(['authorization']);

  return (
    <CookieContext.Provider value={{ cookies, setCookie, removeCookie }}>
      {children}
    </CookieContext.Provider>
  );
}

