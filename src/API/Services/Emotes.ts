import axios from "../axios";

export const Emotes = () => {

  const getStreamerEmotes = (streamer: string) => {
    return axios.get(`https://kick.com/emotes/${streamer}`);
  };

  const getLocalEmotes = () => {
    return axios.get(`/emotes_db.json`);
  };
  

  return { getStreamerEmotes, getLocalEmotes }
};