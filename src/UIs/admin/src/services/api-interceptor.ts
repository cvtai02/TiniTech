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
        // console.warn('Unauthorized! Redirecting to login...');
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
