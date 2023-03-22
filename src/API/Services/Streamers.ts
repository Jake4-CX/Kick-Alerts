import axios from "../axios";

export const Streamers = () => {

  const getStreamer = (streamer: string) => {
    return axios.get(`https://kick.com/api/v1/channels/${streamer}`);
  };

  return {getStreamer}
};