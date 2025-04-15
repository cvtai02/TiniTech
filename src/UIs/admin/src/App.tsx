import './App.css';
import {
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthContextProvider } from './contexts/AuthContext';
import Layout from './layouts';
import Home from './pages/Dashboard';
import Login from './pages/Login';
import ProductsPage from './pages/Products';
import CategoriesPage from './pages/Categories';
import UsersPage from './pages/Users';

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />,
      <Route path="products" element={<ProductsPage />} />,
      <Route path="categories" element={<CategoriesPage />} />,
      <Route path="users" element={<UsersPage />} />,
      <Route element={<PrivateRoute requiredRole="Admin" />}></Route>
    </Route>

    <Route path="/login" element={<Login></Login>}></Route>
  </>,
);

const router = createBrowserRouter(routes);

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
