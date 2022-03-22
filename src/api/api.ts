const baseUrl = "http://localhost:3333";

export const API = {
  login(email: string, password: string): Promise<any> {
    return fetch(baseUrl + "/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(async (res) => {
        const { response } = await res.json();

        const { user, expire, error } = response;

        return { user, expire, error };
      })
      .catch((err) => ({ error: "Login error" }));
  },

  register(email: string, password: string): Promise<any> {
    return fetch(baseUrl + "/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(async (res) => {
        const { response } = await res.json();

        const { user, expire, error } = response;

        return { user, expire, error };
      })
      .catch((err) => ({ error: "Sign up error" }));
  },

  verifyJwt(): Promise<any> {
    return fetch(baseUrl + "/auth/jwt", {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        const { expired } = await res.json();

        return { expired };
      })
      .catch((err) => console.log(err));
  },

  logout(): Promise<any> {
    return fetch(baseUrl + "/auth/logout", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  },

  getChests(): Promise<any> {
    return fetch(baseUrl + "/chests", {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        const response = await res.json();

        const { chests, error } = response;

        return { chests, error };
      })
      .catch((err) => ({ error: "Login error" }));
  },

  openChest(id: string): Promise<any> {
    return fetch(baseUrl + "/chests/" + id, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const response = await res.json();

        const { decrypted, seconds, error } = response;

        return { decrypted, seconds, error };
      })
      .catch((err) => ({ error: "Login error" }));
  },
};
