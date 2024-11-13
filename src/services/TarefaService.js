import { api } from "../boot/axios";

export const Tarefa = {
  async getTarefa(id) {
    try {
      const tarefa = await api.get(`/tarefa/id/${id}`)
      return tarefa.data;
    } catch (err) {
      throw err;
    }
  },
  async createTarefa(data) {
    try {
        const ret =  await api.post('/tarefa', data);
        console.log(ret.data)
        return ret.data
        } catch (err) {
            throw err;
        }
    },
    async updateTarefa(data) {
        try {
            return await api.patch(`/tarefa/${data.id}`, data);
        } catch (err) {
            throw err;
        }
    },
    async deleteTarefa(id) {
        try {
            return await api.delete(`/tarefa/${id}`);
        } catch (err) {
            throw err;
        }
    }
}
