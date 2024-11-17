import { api } from "../boot/axios";

export const Auth = {
  async login(config) {
    const response = await api.post(`/login`, null, config);
    return response.data;
  },
};

