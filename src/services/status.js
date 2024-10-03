import { api } from "../boot/axios";

export default class Status {
  static async getStatus(data) {
    return new Promise((res, rej) => {
      api
        .get("/status/id/1", data)
        .then((response) => res(response.data))
        .catch((err) => rej(err.response));
    });
  }
}
