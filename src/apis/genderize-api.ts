import { GenderizeAPIRes } from "../dto";
import httpService from "../http";

const genderizeAPI = {
  async classifyName(name: string): Promise<GenderizeAPIRes> {
    return await httpService.get(`https://api.genderize.io?name=${name}`);
  }
};

export default genderizeAPI;