import { useNavigate, useParams } from "react-router-dom"

import { useEffect, useState } from "react";

import toast from 'react-hot-toast';
import { Streamers } from "../API/Services/Streamers";

export const Alerts = (props: any) => {

  const navigate = useNavigate()

  const [streamer, setStreamer] = useState<Streamer>();
  const [username, setUsername] = useState<string>();

  const { getStreamer } = Streamers();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (username === undefined) return;
    if (username?.length === 0) return;

    try {
      const response = await getStreamer(username);

      if (response.status === 200) {
        setStreamer(response.data);
        console.log(response.data);
      }

    } catch (error: any) {

      if (error.response === undefined) {
        toast.error("Failed to query kick api.", { position: "top-right", duration: 5000 });
      }

      if (error.response.status === 429) {
        toast.error("Failed to query kick api.", { position: "top-right", duration: 5000 });
      }
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen bg-slate-200">
        <main className='rounded-t-2xl rounded-b-md bg-white mx-auto p-8 md:pt-12 shadow-2xl w-11/12 max-w-lg'>
          <section className="text-center">

            {/* User enters username and presses submit button */}

            {
              streamer !== undefined && (
                <>
                  <div className="flex my-4 bg-slate-100 rounded-lg py-2 px-4">
                    <div className="flex flex-col justify-center items-center w-full">
                      <h2 className="text-2xl font-bold">Success</h2>
                      <p className="text-gray-500">Streamer found.</p>

                      <div className="flex flex-row">
                        <div className="flex flex-col justify-center items-center">
                          <span>Streamer ID: </span>
                          <span>{streamer.id}</span>
                        </div>

                        <div className="flex flex-col justify-center items-center">
                          <span>Chatroom ID: </span>
                          <span>{streamer.chatroom.id}</span>
                        </div>
                      </div>
                      <button onClick={() => navigate("/alerts/" + streamer.slug + "/" + + streamer.id + "/" + streamer.chatroom.id)} className="w-full block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 mt-4">Go to view</button>
                    </div>
                  </div>
                </>
              )
            }

            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Enter username" className="w-full border-2 focus:outline-none focus:border-purple-600 rounded p-2 my-2 duration-300" value={username} onChange={(e) => setUsername(e.target.value)} />
              <button type="submit" className="w-full block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 mt-4">Submit</button>
            </form>

          </section>
        </main>
      </div>
    </>
  )
}