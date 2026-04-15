import { AgifyAPIRes } from "../dto";
import httpService from "../http";

const agifyAPI = {
  async classifyName(name: string): Promise<AgifyAPIRes> {
    return await httpService.get(`https://api.agify.io?name=${name}`);
  }
};

export default agifyAPI;