import axios from "axios";

export const createApiInstance = (baseURL) => {
  return axios.create({
    baseURL: baseURL + "/api",
    withCredentials: true,
  });
};
export const setupInterceptors = (apiInstances, getAccessToken, updateAccessToken) => {
  apiInstances.forEach(api => {
    api.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            if (originalRequest.url.includes("/user/refresh_token")) {
              updateAccessToken(null);
              window.location.href = "/login";
              return Promise.reject(error);
            }
            
            const response = await apiInstances[0].post("/user/refresh_token");
            const newToken = response.data.access_token;
            updateAccessToken(newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            updateAccessToken(null);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  });
};

const api = createApiInstance(import.meta.env.VITE_G4_API_URL);
const api_group_1= createApiInstance(import.meta.env.VITE_G1_API_URL);
const api_group_2 = createApiInstance(import.meta.env.VITE_G2_API_URL);
const api_group_3 = createApiInstance(import.meta.env.VITE_G3_API_URL);
const api_group_5 = createApiInstance(import.meta.env.VITE_G5_API_URL);
const api_group_6 = createApiInstance(import.meta.env.VITE_G6_API_URL);

export { api, api_group_1, api_group_2, api_group_3, api_group_5, api_group_6 };