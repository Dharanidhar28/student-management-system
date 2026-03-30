const DEFAULT_API_BASE = "https://student-management-system-qdeq.onrender.com";

function getApiBase() {
	if (window.location.protocol === "file:") {
		return DEFAULT_API_BASE;
	}

	if (
		(window.location.hostname === "127.0.0.1" ||
			window.location.hostname === "localhost") &&
		window.location.port &&
		window.location.port !== "8000"
	) {
		return `${window.location.protocol}//${window.location.hostname}:8000`;
	}

	return `${window.location.protocol}//${window.location.host}`;
}

window.APP_CONFIG = {
	getApiBase,
	DEFAULT_API_BASE,
};
