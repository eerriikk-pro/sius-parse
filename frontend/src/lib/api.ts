const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function login(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${BACKEND_URL}/api/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  return response.json(); // { access_token, token_type }
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${BACKEND_URL}/api/v1/users/me/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  return response.json();
}

export async function createUser({ username, email, password, full_name, athlete_id }: { username: string; email: string; password: string; full_name: string; athlete_id?: number }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const body: Record<string, unknown> = { username, email, password, full_name };
  if (athlete_id !== undefined) body.athlete_id = athlete_id;
  const response = await fetch(`${BACKEND_URL}/api/v1/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create user');
  }
  return response.json();
}

export async function listAthletes() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${BACKEND_URL}/api/v1/athlete/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch athletes');
  }
  return response.json();
}

export async function deleteAthlete(athlete_id: number) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${BACKEND_URL}/api/v1/athlete/${athlete_id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to delete athlete');
  }
  return response.json();
}

export async function createAthlete({ id, first_name, last_name, active = true }: { id: number; first_name: string; last_name: string; active?: boolean }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${BACKEND_URL}/api/v1/athlete/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ id, first_name, last_name, active }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create athlete');
  }
  return response.json();
}

export async function uploadCsvFiles(files: FileList) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    if (file.name.endsWith('.csv')) {
      formData.append('files', file);
    }
  });
  const response = await fetch(`${BACKEND_URL}/api/v1/import/csv/multi`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to upload CSV files');
  }
  return response.json();
}

export interface Shot {
  shot_time: string;
  primary_score: number;
  secondary_score: number;
  x_mm: number;
  y_mm: number;
}

export interface RelayStats {
  total_shots: number;
  total_score: number;
  best_score: number;
  average_score: number;
  list_of_shots: Shot[];
}

export interface DayStats {
  day: string;
  total_shots: number;
  total_sighters: number;
  best_score: number;
  list_of_relays: RelayStats[];
  list_of_sighters: Shot[];
}

export async function fetchRecentScores(days = 10): Promise<DayStats[]> {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${BACKEND_URL}/api/v1/shots/recent-scores?days=${days}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch recent scores');
  }
  return response.json();
}

export interface Stats {
  best_score: number;
  average_score: number;
  best_score_delta: number;
  average_score_delta: number;
}

export async function fetchStats(period = "10days"): Promise<Stats> {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${BACKEND_URL}/api/v1/shots/stats?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
}

export async function fetchShotsByDay(date_: string) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${BACKEND_URL}/api/v1/shots/by-day?date_=${date_}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch shots for day');
  }
  return response.json();
}

export async function fetchShotsBySet(date_: string, set_id: number) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(`${BACKEND_URL}/api/v1/shots/by-set?date_=${date_}&set_id=${set_id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch shots for set');
  }
  return response.json();
} 