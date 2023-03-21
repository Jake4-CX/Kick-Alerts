import axios from "../axios";

export const Emotes = () => {

  const getStreamerEmotes = (streamer: string) => {
    return axios.get(`/emotes/${streamer}`);
  };

  const getLocalEmotes = () => {
    return axios.get(`https://localhost:5173/emotes_db.json`);
  };
  

  return { getStreamerEmotes, getLocalEmotes }
};