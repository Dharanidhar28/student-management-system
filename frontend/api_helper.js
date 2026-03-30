export async function apiRequest(endpoint, options = {}) {
	const token = localStorage.getItem("token");
	const apiBase =
		window.APP_CONFIG?.DEFAULT_API_BASE || window.APP_CONFIG.getApiBase();
	const res = await fetch(apiBase + endpoint, {
		...options,

		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			...options.headers,
		},
	});
	if (!res.ok) {
		throw new Error(`API request failed with status ${res.status}`);
	}

	return res.json();
}
