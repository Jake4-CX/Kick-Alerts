import { useNavigate, useParams } from "react-router-dom"

import Pusher from 'pusher-js';
import * as PusherTypes from 'pusher-js';
import React, { useEffect, useState } from "react";

import toast, { useToasterStore } from 'react-hot-toast';
import { Streamers } from "../API/Services/Streamers";

import bitSound from '../assets/sounds/notification_bits.ogg';

var presenceChannel: PusherTypes.PresenceChannel;

export const UserAlert = (props: any) => {

  const { username, user_id, chatroom_id, toast_limit, chat_duration } = useParams()

  const [subscriptionsQueue, setSubscriptionsQueue] = useState<JSX.Element[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<JSX.Element | null>();

  const alertSound = new Audio(bitSound);

  // var [userMessages, setUserMessages] = useState<[User, Message][]>([]);
  // const USER_MESSAGE_CACHE_SIZE = 10;

  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= (toast_limit === undefined ? 12 : parseInt(toast_limit))) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts]);

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

    if (user_id !== undefined && chatroom_id !== undefined) {
      connectToSocket();
    }

  }, [username]);


  function onChatMessageSentEvent(data: any) {
    const message: Message = data.message;
    const user: User = data.user;
    console.log(user.username + ": " + message.message);

    // setUserMessages((userMessages) => {
    //   return [...userMessages.slice(Math.abs(USER_MESSAGE_CACHE_SIZE) * -1), [user, message]];
    // });

    const toastContent = ( // Build dynamic toast content outside of toast.custom to prevent constant re-rendering
      <>
        <div className="line-clamp-4 flex font-[500] -my-2 py-1 px-2 text-[20px]" style={{ textShadow: '1px 1px 10px black, 1px 1px 12px #2C2C2C' }}>
          {subscribifier(user)}
          {/* <span className="font-bold">{user.username}</span> */}
          {messageEmojifier(message.message)}
        </div>
      </>
    )

    toast.custom((t) =>
      <>
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-3xl w-full flex px-4 py-2`}>
          {toastContent}
        </div>
      </>, {
      position: 'bottom-left',
      duration: (chat_duration === undefined ? 15000 : parseInt(chat_duration) * 1000),
      id: "chatmessage." + message.id
    });

  }

  function subscribifier(user: User) {

    var badges = "";

    if (user.verified) {
      badges += `<img src="/assets/images/verified.png" alt="Verified" class="badge" />`;
    }

    if (user.isSuperAdmin) {
      badges += `<img src="/assets/images/moderator.png" alt="Super Admin" class="badge" />`;
    }

    if (user.role !== null && user.role.toLowerCase() === "moderator") {
      badges += `<img src="/assets/images/moderator.png" alt="Moderator" class="badge" />`;
    }


    if (user.is_founder) {
      badges += `<img src="/assets/images/founder.png" alt="Moderator" class="badge" />`;
    }

    if (user.is_subscribed) {

      switch (true) { // First month = 1 (Even if it's their first day of subscribing)
        case (user.months_subscribed >= 12):
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="badge" />`; // 12 month
          break;
        case (user.months_subscribed >= 6):
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="badge" />`; // 6 month
          break;
        case (user.months_subscribed >= 3):
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="badge" />`; // 3 month
          break;
        case (user.months_subscribed >= 2):
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="badge" />`; // 2 month
          break;
        default:
          badges += `<img src="/assets/images/subscriber_0.png" alt="Subscriber" class="badge" />`;
      }
    }

    if (user.quantity_gifted > 0) {

      switch (true) {
        case (user.quantity_gifted >= 100):
          badges += `<img src="/assets/images/gifted_orange.png" alt="Gifted ${user.quantity_gifted}" class="badge" />`;
          break;
        case (user.quantity_gifted >= 50):
          badges += `<img src="/assets/images/gifted_red.png" alt="Gifted ${user.quantity_gifted}" class="badge" />`;
          break;
        case (user.quantity_gifted >= 25):
          badges += `<img src="/assets/images/gifted_purple.png" alt="Gifted ${user.quantity_gifted}" class="badge" />`;
          break;
        case (user.quantity_gifted >= 10):
          badges += `<img src="/assets/images/gifted_blue.png" alt="Gifted ${user.quantity_gifted}" class="badge" />`;
          break;
        case (user.quantity_gifted >= 5):
          badges += `<img src="/assets/images/gifted_blue.png" alt="Gifted ${user.quantity_gifted}" class="badge" />`;
          break;
        default:
          badges += `<img src="/assets/images/gifted_blue.png" alt="Gifted ${user.quantity_gifted}" class="badge" />`;
      }
    }

    if (user.follower_badges.length > 0) {
      if (user.follower_badges.includes("OG")) {
        badges += `<img src="/assets/images/OG.png" alt="OG" class="badge" />`;
      }
      if (user.follower_badges.includes("Channel Host")) {
        badges += `<img src="/assets/images/Broadcaster.png" alt="Broadcaster" class="badge" />`;
      }
      if (user.follower_badges.includes("VIP")) {
        badges += `<img src="/assets/images/VIP.png" alt="VIP" class="badge" />`;
      }
    }

    const textColours = ["text-green-500", "text-blue-500", "text-red-500", "text-yellow-500", "text-purple-500", "text-pink-500"];
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

        message = message.replace(fullMatch, `<img src="https://files.kick.com/emotes/${emoteID}/fullsize" alt="${emoteName}" class="emote" />`);

      } else if (type === "emoji") {
        console.log(`Found emoji with value "${value}" - Full match: ${fullMatch}`);

        message = message.replace(fullMatch, `<img src="https://dbxmjjzl5pc1g.cloudfront.net/877d1966-06a7-4737-beca-d4bcfeb85820/images/emojis/${value}.png" alt="${value}" class="emote" />`);
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

    // username: "" if this is a gift

    if (data.username === undefined || data.username === "" || data.user_ids.length > 1) {
      console.log("[GIFT] User ID(s): " + data.user_ids + " ChannelID: " + data.channel_id);
      return;
    }
    console.log(`[SUB] Username: ${data.username} (ID: ${data.user_ids[0]}) ChannelID: ${data.channel_id}`);

    alertSound.play();

    const test: JSX.Element = <div><h1>Yooo</h1></div>

    toast.custom((t) => (
      <>
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-xl rounded-lg flex px-4 py-2`}>
          <div className="flex flex-col items-center justify-center w-full">
            <img src="https://media.tenor.com/qrPKbhgp4XMAAAAd/therealmoisesb-moises.gif" alt="emote" className="w-48 h-full inline" />
            <div className="">
              <span className="font-bold">{data.username}</span>
              <span className="ml-1">has just subscribed!</span>
            </div>
          </div>
        </div>
      </>), {
      position: 'top-right',
      duration: 10000,
    });
  }

  function onLuckyUsersWhoGotGiftSubscriptions(data: LuckyUsersWhoGotGiftSubscription) {
    console.log(data.gifter_username + " has gifted " + data.usernames.length + " subs to " + data.usernames + "!");

    alertSound.play();

    toast.custom((t) => (
      <>
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-xl rounded-lg flex px-4 py-2`}>
          <div className="flex flex-col items-center justify-center w-full">
            <img src="https://media.tenor.com/n7HuMMNjpHUAAAAd/therealmoisesb-moises-bournigal.gif" alt="emote" className="w-48 h-full inline" />
            <div className="">
              <span className="font-bold">{data.gifter_username}</span>
              <span className="ml-1">has gifted</span>
              <span className="ml-1 font-bold">{data.usernames.length}</span>
              <span className="ml-1">subs!</span>
            </div>
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
      user_ids: [1],
      username: "Jake4",
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
      <div className="flex justify-center items-center h-screen w-screen">


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