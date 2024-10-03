import { defineStore } from 'pinia';
import Status from 'src/services/status';

export const useStatusStore = defineStore('status', {
  state: () => ({
    status: []
  }),
  actions: {
    async getStatus(){
        this.status = await Status.getStatus();
    }                                                                                                                                                                                                                                           
    },
  },
);