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
import ImportGoodsPage from './pages/Import';
import AddProductPage from './pages/AddProduct';
import AddProductVariantPage from './pages/AddVariant';
import NotFoundPage from './pages/NotFoundPage';

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />,
      <Route path="products" element={<ProductsPage />} />,
      <Route path="categories" element={<CategoriesPage />} />,
      <Route path="users" element={<UsersPage />} />,
      <Route path="import" element={<ImportGoodsPage />} />,
      <Route path="import/new-product" element={<AddProductPage />} />,
      <Route path="import/new-variant" element={<AddProductVariantPage />} />,
      <Route path="*" element={<NotFoundPage />}></Route>
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
