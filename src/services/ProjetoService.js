import { api } from "../boot/axios";

export const Projeto = {
  async getProjeto(id) {
    try {
      const projeto = await api.get(`/projeto/id/${id}`)
      return projeto.data;
    } catch (err) {
      throw err;
    }
  },
  async createProjeto(data) {
    try {
        return await api.post('/projeto', data);
        } catch (err) {
            throw err;
        }
    },
    async updateProjeto(data) {
        try {
            return await api.patch(`/projeto/${data.prj_id}`, data);
        } catch (err) {
            throw err;
        }
    },
    async deleteProjeto(id) {
        try {
            return await api.delete(`/projeto/${id}`);
        } catch (err) {
            throw err;
        }
    }
}