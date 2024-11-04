import { api } from "../boot/axios";

export const Kanban = {
  async getDadosKanban(id) {
    try {
      const tarefas = await api.get(`/tarefa/id/${id}`)
      return tarefas.data;
    } catch (err) {
      throw err;
    }
  }
}
