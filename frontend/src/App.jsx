// rating-app-frontend/src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';

const App = () => {
  return (
    <AuthProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;
