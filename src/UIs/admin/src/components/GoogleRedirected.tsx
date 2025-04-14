import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useEffect } from 'react';

function GoogleRedirected() {
  const navigate = useNavigate();
  const { auth } = useAuthContext();

  const code = new URLSearchParams(window.location.search).get('code');

  useEffect(() => {
    if (code) {
      fetch(
        `${import.meta.env.VITE_API_URL}/api/oauth2/google?code=${code}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          auth.login(data.accessToken.expiredAt, data.accessToken.user);
          navigate('/');
        })
        .catch(() => {
          navigate(`/unauthorize`);
        });
    }
  }, [code, navigate]);

  //get code from params

  return <div> Loading </div>;
}

export default GoogleRedirected;
