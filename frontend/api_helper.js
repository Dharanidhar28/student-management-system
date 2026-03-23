const API_BASE = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");

export async function apiRequest(endpoint, options = {}) {

const res = await fetch(API_BASE + endpoint, {

...options,

headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${token}`,
...options.headers
}

});

return res.json();

}