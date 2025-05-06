import './App.css';
import {
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Layout from './layouts';
import Home from './pages/Dashboard';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import CategoriesPage from './pages/Categories';
import { AuthProvider } from './contexts/AuthContext';
import UsersPage from './pages/Users';
import ImportGoodsPage from './pages/Import';
import AddProductPage from './pages/AddProduct';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetailPage from './pages/ProductDetail';
import ProductPage from './pages/Products';

const routes = createRoutesFromElements(
  <>
    <Route element={<PrivateRoute requiredRoles={['Admin']} />}>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />,
        <Route path="landing" element={<LandingPage />} />,
        <Route path="products" element={<ProductPage />} />,
        <Route path="products/:slug" element={<ProductDetailPage />} />,
        <Route path="categories" element={<CategoriesPage />} />,
        <Route path="users" element={<UsersPage />} />,
        <Route path="import" element={<ImportGoodsPage />} />,
        <Route path="import/new-product" element={<AddProductPage />} />,
        <Route path="*" element={<NotFoundPage />}></Route>
      </Route>
    </Route>
    <Route path="/login" element={<Login></Login>}></Route>
  </>,
);

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 3000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      throwOnError(error) {
        if (error instanceof Error) {
          toast.error('Query error:' + error.message);
        }
        return false;
      },
    },

    mutations: {
      onError: (error) => {
        if (error) {
          toast.error(error.message);
        }
      },
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
