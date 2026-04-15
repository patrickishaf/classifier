import { NationalizeAPIRes } from "../dto";
import httpService from "../http";

const nationalizeAPI = {
  async classifyName(name: string): Promise<NationalizeAPIRes> {
    return await httpService.get(`https://api.nationalize.io?name=${name}`);
  }
};

export default nationalizeAPI;