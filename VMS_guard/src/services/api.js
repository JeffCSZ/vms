//const API_BASE_URL = "http://localhost:5265/api";
const API_BASE_URL = "https://websvr.chancoders.com:5265/api";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("authToken");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.handleAuthError();
          throw new Error("AUTHENTICATION_REQUIRED");
        }

        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  handleAuthError() {
    // Clear invalid token
    this.removeToken();

    // Trigger logout event for the app to handle
    window.dispatchEvent(
      new CustomEvent("authError", {
        detail: { message: "Session expired" },
      })
    );
  }

  // Auth endpoints
  async register(userData) {
    return this.request("/Account/register", {
      method: "POST",
      body: JSON.stringify({
        ...userData,
        isResident: false, // Always set to false for guard app
      }),
    });
  }

  async login(credentials) {
    return this.request("/Account/login", {
      method: "POST",
      body: JSON.stringify({
        ...credentials,
        expectedAccountType: "guard", // Guard app expects guard accounts
      }),
    });
  }

  async logout() {
    const result = await this.request("/Account/logout", {
      method: "POST",
    });
    this.removeToken();
    return result;
  }

  // Visitor Request endpoints
  async getVisitorRequestByUUID(uuid) {
    return this.request(`/VisitorRequest/uuid/${uuid}`);
  }

  async getAllVisitorRequests() {
    return this.request("/VisitorRequest/all");
  }
}

export default new ApiService();
