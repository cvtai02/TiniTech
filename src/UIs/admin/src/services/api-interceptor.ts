// apiClient.ts
export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  // --- Request Interceptor ---
  const modifiedInit: RequestInit = {
    ...init,
    credentials: 'include',
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken') || '{}')}`,
    },
  };

  try {
    const response = await fetch(input, modifiedInit);

    // --- Response Interceptor ---
    if (response.status >= 400) {
      if (response.status === 401) {
        throw new Error('Unauthorized!');
      } else if (response.status === 403) {
        throw new Error(
          'Forbidden! You do not have permission to access this resource.',
        );
      }

      // Thêm xử lý an toàn khi parse JSON
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        console.error('Error parsing JSON:', e);
        throw new Error('An error occurred while processing your request.');
      }
      throw new Error(`${errorBody.title}`);
    }
    return response;
  } catch (error: any) {
    console.error('Fetch error:', error);
    if (error.name === 'TypeError') {
      throw new Error(`Lỗi kết nối`);
    } else {
      throw new Error(error);
    }
  }
}

export async function postForm(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  // --- Request Interceptor ---
  const modifiedInit: RequestInit = {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken') || '')}`,
    },
  };

  try {
    const response = await fetch(input, modifiedInit);

    // --- Response Interceptor ---
    if (response.status >= 400) {
      if (response.status === 401) {
        console.warn('Unauthorized! Redirecting to login...');
        window.location.href = '/login';
      }

      // Thêm xử lý an toàn khi parse JSON
      let errorBody;
      errorBody = await response.json();
      throw new Error(`${errorBody.title}`);
    }
    return response;
  } catch (error: any) {
    console.error('Fetch error:', error);
    if (error.name === 'TypeError') {
      throw new Error(`Lỗi kết nối`);
    } else {
      throw new Error(error.message);
    }
  }
}
