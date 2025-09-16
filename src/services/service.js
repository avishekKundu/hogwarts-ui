const API_BASE = "/api";

export async function fetchLeaderboard(window) {
    const res = await fetch(`${API_BASE}/leaderboard?window=${window}`);
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    const json = await res.json();
    return json;
}


export function streamLeaderboard(window) {
    return new EventSource(`http://localhost:8080${API_BASE}/leaderboard/stream?window=${window}`);
}

