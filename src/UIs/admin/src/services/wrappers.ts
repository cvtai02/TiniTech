// apiClient.ts
export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  // --- Request Interceptor ---
  const modifiedInit: RequestInit = {
    ...init,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(input, modifiedInit);

    // --- Response Interceptor ---
    if (response.status >= 400) {
      if (response.status === 401) {
        // Token expired, redirect to login or refresh token logic here
        console.warn('Unauthorized! Redirecting to login...');
        window.location.href = '/login';
      }
      var body = await response.json();
      console.error('Error response:', body);
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
