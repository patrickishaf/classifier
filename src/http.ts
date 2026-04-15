import axios from 'axios';

const httpService = {
  async get(url: string) {
    const res = await axios.get(url);
    return res.data;
  }
}

export default httpService;