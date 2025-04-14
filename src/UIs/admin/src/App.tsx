import './App.css';
import {
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthContextProvider } from './contexts/AuthContext';
import Layout from './layouts';
import Home from './pages/Home';
import GoogleRedirected from './components/GoogleRedirected';

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />,
      <Route element={<PrivateRoute requiredRole="Admin" />}></Route>
    </Route>

    <Route path="/oauth2">
      <Route path="google/redirected" element={<GoogleRedirected />} />
    </Route>
  </>,
);

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
