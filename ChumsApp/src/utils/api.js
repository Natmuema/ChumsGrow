export async function fetchWithAuth(url, options = {}) {
  let access = localStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token');

  // Check if user is authenticated
  if (!access) {
    throw new Error('Authentication required. Please log in.');
  }

  // First attempt with current access token
  const authHeaders = {
    ...options.headers,
    'Authorization': `Bearer ${access}`
  };

  let response = await fetch(url, {
    ...options,
    headers: authHeaders
  });

  // If token is valid, return response
  if (response.ok || response.status !== 401) {
    return response;
  }

  // Token expired, try to refresh
  if (!refresh) {
    throw new Error('Authentication required. Please log in.');
  }

  const refreshResponse = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refresh })
  });

  if (!refreshResponse.ok) {
    // Refresh failed — force logout
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    throw new Error('Session expired. Please log in again.');
  }

  const { access_token } = await refreshResponse.json();
  localStorage.setItem('access_token', access_token);

  // Retry original request with new token
  const retryHeaders = {
    ...options.headers,
    'Authorization': `Bearer ${access_token}`
  };

  return fetch(url, {
    ...options,
    headers: retryHeaders
  });
}