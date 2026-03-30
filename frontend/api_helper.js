export async function apiRequest(endpoint, options = {}) {
	const token = localStorage.getItem("token");
	const res = await fetch(window.APP_CONFIG.getApiBase() + endpoint, {
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
