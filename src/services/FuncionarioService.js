import { api } from "../boot/axios";

export const Funcionario = {
  async getFuncionario(id) {
    try {
      const funcionario = await api.get(`/funcionario/id/${id}`)
      return funcionario.data;
    } catch (err) {
      throw err;
    }
  },
  async createFuncionario(data) {
    try {
        const ret =  await api.post('/funcionario', data);
        console.log(ret.data)
        return ret.data
        } catch (err) {
            throw err;
        }
    },
    async updateFuncionario(data) {
        try {
            return await api.patch(`/funcionario/${data.id}`, data);
        } catch (err) {
            throw err;
        }
    },
    async deleteFuncionario(id) {
        try {
            return await api.delete(`/funcionario/${id}`);
        } catch (err) {
            throw err;
        }
    }
}
