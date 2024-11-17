import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    usuario: null,
  }),
  actions: {
    login(token, usuario) {
      console.log(usuario)
      this.token = token;
      this.usuario = usuario;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', usuario);
    },
    logout() {
      this.token = null;
      this.usuario = null;
      localStorage.removeItem('token');
    },
    loadFromLocalStorage() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
      }
    },
  },
});
