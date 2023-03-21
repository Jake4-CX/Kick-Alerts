import { useNavigate, useParams } from "react-router-dom"

import Pusher from 'pusher-js';
import * as PusherTypes from 'pusher-js';
import { useEffect, useState } from "react";

import toast from 'react-hot-toast';
import { Emotes } from "../API/Services/Emotes";
import { Streamers } from "../API/Services/Streamers";

import bitSound from '../assets/sounds/notification_bits.ogg';

var presenceChannel: PusherTypes.PresenceChannel;

export const UserAlert = (props: any) => {

  const { username, user_id, chatroom_id } = useParams()

  const alertSound = new Audio(bitSound);

  // var [userMessages, setUserMessages] = useState<[User, Message][]>([]);
  // const USER_MESSAGE_CACHE_SIZE = 10;

  const [emotes, setEmotes] = useState<Emote[]>([]);

  const { getStreamerEmotes, getLocalEmotes } = Emotes();

  if (username === undefined || user_id === undefined || chatroom_id === undefined) {
    return (
      <>
        <div className="flex justify-center items-center h-screen w-screen bg-slate-200">
          <main className='rounded-t-2xl rounded-b-md bg-white mx-auto p-8 md:pt-12 shadow-2xl w-11/12 max-w-lg'>
            <section className="text-center">
              <h1 className="text-3xl font-bold">Error</h1>
              <p className="text-gray-500">Missing parameters.</p>
            </section>
          </main>
        </div>
      </>
    )
  }

  useEffect(() => {

    const getEmotes = async () => {
      try {
        const response = await getLocalEmotes();

        var emojis: Emote[] = [];

        if (response.status === 200) {
          emojis = response.data.streamerEmotes.emotes;
          emojis = emojis.concat(response.data.globalEmotes.emotes);
          setEmotes(emojis);
        }

      } catch (error) {
        console.log("Failed to query local emotes: ", error);
      }
    }
    getEmotes(); // using locally stored emotes - not from kick api

  }, [username]);

  useEffect(() => {
    const connectToSocket = async () => {

      var pusher = new Pusher('eb1d5f283081a78b932c', {
        cluster: 'us2',
        forceTLS: true
      });

      pusher.connection.bind('connected', function () {
        console.log('connected')

      });
      pusher.connection.bind('disconnected', function () {
        console.log('disconnected')
      });

      // Subscribe to channels
      var channelSubscription = pusher.subscribe("channel." + user_id);
      var chatroomSubscription = pusher.subscribe("chatrooms." + chatroom_id);

      channelSubscription.bind('pusher:subscription_succeeded', onSubscriptionSucceeded);

      // Bind to events
      chatroomSubscription.bind('App\\Events\\ChatMessageSentEvent', onChatMessageSentEvent);
      channelSubscription.bind('App\Events\FollowersUpdated', onFollowerCountUpdated);
      channelSubscription.bind('App\\Events\\ChannelSubscriptionEvent', onChannelSubscription);
      channelSubscription.bind('App\\Events\\LuckyUsersWhoGotGiftSubscriptionsEvent', onLuckyUsersWhoGotGiftSubscriptions);

    };

    if (user_id !== undefined && chatroom_id !== undefined && emotes.length > 0) {
      connectToSocket();
    }

  }, [emotes]);


  function onChatMessageSentEvent(data: any) {
    const message: Message = data.message;
    const user: User = data.user;
    console.log(user.username + ": " + message.message);

    // setUserMessages((userMessages) => {
    //   return [...userMessages.slice(Math.abs(USER_MESSAGE_CACHE_SIZE) * -1), [user, message]];
    // });

    const toastContent = ( // Build dynamic toast content outside of toast.custom to prevent constant re-rendering
      <>
        <div className="line-clamp-2 flex font-[500] -my-2 py-1 px-2" style={{textShadow: '1px 1px 10px black, 1px 1px 12px #2C2C2C'}}>
          {subscribifier(user)}
          {/* <span className="font-bold">{user.username}</span> */}
          {messageEmojifier(message.message)}
        </div>
      </>
    )

    toast.custom((t) =>
      <>
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full flex px-4 py-2`}>
          {toastContent}
        </div>
      </>, {
      position: 'bottom-left',
      duration: 15000,
      id: "chatmessage." + message.id
    });

  }

  function subscribifier(user: User) {

    var badges = "";

    if (user.verified) {
      badges += `<img src="/assets/images/verified.png" alt="Verified" class="w-4 h-4 mr-1 inline" />`;
    }

    if (user.isSuperAdmin) {
      badges += `<img src="/assets/images/moderator.png" alt="Super Admin" class="w-4 h-4 mr-1 inline" />`;
    }

    if (user.role !== null && user.role.toLowerCase() === "moderator") {
      badges += `<img src="/assets/images/moderator.png" alt="Moderator" class="w-4 h-4 mr-1 inline" />`;
    }


    if (user.is_founder) {
      badges += `<img src="/assets/images/founder.png" alt="Moderator" class="w-4 h-4 mr-1 inline" />`;
    }

    if (user.is_subscribed) {
      
      switch (true) { // First month = 1 (Even if it's their first day of subscribing)
        case (user.months_subscribed >= 12):
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="w-4 h-4 mr-1 inline" />`; // 12 month
          break;
        case (user.months_subscribed >= 6):
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="w-4 h-4 mr-1 inline" />`; // 6 month
          break;
        case (user.months_subscribed >= 3):
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="w-4 h-4 mr-1 inline" />`; // 3 month
          break;
        case (user.months_subscribed >= 2):
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="w-4 h-4 mr-1 inline" />`; // 2 month
          break;
        default:
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="w-4 h-4 mr-1 inline" />`;
      }
    }

    if (user.follower_badges.includes("OG")) {
      badges += `<img src="/assets/images/OG.png" alt="OG" class="w-4 h-4 mr-1 inline" />`;
    }

    const textColours = ["text-green-500", "text-blue-500", "text-red-500", "text-yellow-500", "text-purple-500", "text-pink-500", "text-gray-500"];
    const randomColour = textColours[Math.floor(Math.random() * textColours.length)];

    const userName = `<span class='${randomColour}'>${user.username}</span>`

    return <span className="font-bold my-0 m-auto text-white" dangerouslySetInnerHTML={{ __html: badges + userName + ": " }} />;

  }

  function messageEmojifier(message: string) {
    const emojiDetector = /\[(emote|emoji):(\d+|[^\]]+)\]/g;
    let match;

    while ((match = emojiDetector.exec(message)) !== null) {
      const [fullMatch, type, value] = match;

      if (type === "emote") {
        const [emoteID, emoteName] = value.split(':');
        console.log(`Found emote with ID ${emoteID} and name "${emoteName}" - Full match: ${fullMatch}`);

        const emote: Emote | undefined = emotes.find(e => e.id === parseInt(emoteID));

        if (emote !== undefined) {
          message = message.replace(fullMatch, `<img src="https://files.kick.com/emotes/${emote.id}/fullsize" alt="${emote.name}" class="w-4 h-4 mr-1 inline" />`);
        } else {
          console.log(`Invalid emote - or not in database (${fullMatch})`);
          message = message.replace(fullMatch, ``);
        }


      } else if (type === "emoji") {
        console.log(`Found emoji with value "${value}" - Full match: ${fullMatch}`);

        message = message.replace(fullMatch, `<img src="https://dbxmjjzl5pc1g.cloudfront.net/877d1966-06a7-4737-beca-d4bcfeb85820/images/emojis/${value}.png" alt="${value}" class="w-4 h-4 mr-1 inline" />`);
      }
    }

    return <span className="pl-1 text-white w-full" dangerouslySetInnerHTML={{ __html: message }} />;
  }

  function onFollowerCountUpdated(data: any) {
    type dataType = {
      followersCount: number,
      channel_id: number,
      username?: string,
      created_at: number,
      followed: boolean
    }

    data = data as dataType;

    console.log("Followers: " + data.followersCount);
  }

  function onChannelSubscription(data: ChannelSubscription) {
    const gift_size = data.user_ids.length;
    console.log("Gifted " + gift_size + " subs to " + data.user_ids + "!")

    alertSound.play();

    toast.custom((t) => (
      <>
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-xl rounded-lg flex px-4 py-2`}>
          <div className="flex flex-col items-center justify-center w-full">
            <img src="https://media.tenor.com/n7HuMMNjpHUAAAAd/therealmoisesb-moises-bournigal.gif" alt="emote" className="w-48 h-full inline" />
            <span className="font-bold">Gifted {gift_size} subs!</span>
          </div>
        </div>
      </>), {
      position: 'top-right',
      duration: 10000,
    });
  }

  function onLuckyUsersWhoGotGiftSubscriptions(data: LuckyUsersWhoGotGiftSubscription) {
    console.log(data.gifter_username + " has gifted " + data.usernames.length + " subs to " + data.usernames + "!");

    toast.custom((t) => (
      <>
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-xl rounded-lg flex px-4 py-2`}>
          <div className="flex flex-col items-center justify-center w-full">
            <img src="https://media.tenor.com/n7HuMMNjpHUAAAAd/therealmoisesb-moises-bournigal.gif" alt="emote" className="w-48 h-full inline" />
            <span className="font-bold">{data.gifter_username} Gifted {data.usernames.length}x subs!</span>
          </div>
        </div>
      </>), {
      position: 'top-right',
      duration: 10000
    });

  }

  function onSubscriptionSucceeded() {
    toast.custom((t) => (
      <>
        <h2 className="text-2xl font-bold opacity-30 select-none">Connected to API</h2>
      </>
    ), {
      position: 'bottom-right',
      duration: 3000,
    });
  }

  function testSubscribe() {
    onChannelSubscription({
      user_ids: [1, 2, 3],
      channel_id: parseInt(user_id as string),
    } as ChannelSubscription);
  }

  function testLuckyUsers() {
    onLuckyUsersWhoGotGiftSubscriptions({
      usernames: ["moisesbournigal", "moisesbournigal", "moisesbournigal"],
      gifter_username: "moisesbournigal",
    } as LuckyUsersWhoGotGiftSubscription);
  }

  const navigate = useNavigate()

  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen bg-green-600">


        {/* <button onClick={() => testSubscribe()} className="bg-white text-black font-bold py-2 px-4 rounded">
          onChannelSubscription
        </button>
        <button onClick={() => testLuckyUsers()} className="bg-white text-black font-bold py-2 px-4 rounded">
          onLuckyUsersWhoGotGiftSubscriptions
        </button> */}
      </div>
    </>
  )
}