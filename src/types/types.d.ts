type User = {
  follower_badges: string[],
  id: number,
  isSuperAdmin: boolean,
  is_founder: boolean,
  is_subscribed: boolean,
  months_subscribed: number,
  profile_thumb: string,
  quantity_gifted: number,
  role: string,
  username: string,
  verified: boolean,
}

type Message = {
  action: null,
  chatroom_id: number,
  created_at: number,
  giftedUsers?: [],
  id: string,
  is_info?: null,
  link_preview?: null,
  message: string,
  months_subscribed?: null,
  replied_to?: null,
  role: null,
  subscriptions_count: null,
  type: string,
}

type ChannelSubscription = {
  user_ids: number[],
  channel_id: number
}

type Channel = {
  id: number,
  user_id: number,
  slug: string,
  playback_url: string,
  name_updated_at?: number,
  vod_enabled: boolean,
  subscription_enabled: boolean,
  cf_rate_limiter: number,
  can_host: boolean,
  chatroom: Chatroom
}

type Chatroom = {
  id: number,
  chatable_type: string,
  channel_id: number,
  created_at: string,
  updated_at: string,
  chat_mode_old: string,
  chat_mode: string,
  slow_mode: boolean,
  chatable_id: number,
}

type LuckyUsersWhoGotGiftSubscription = {
  channel: Channel,
  usernames: string[]
  gifter_username: string
}

type Emote = {
  id: number,
  channel_id: number,
  name: string,
  subscriber_only: boolean,
}

type Streamer = {
  asending_links: object,
  banner_image: object,
  can_host: boolean,
  cf_rate_limiter: boolean,
  chatroom: Chatroom,
  follower_badges: [],
  followers_count: number,
  following: boolean,
  id: number,
  livestream: object,
  media: object,
  muted: boolean,
  name_updated_at?: null,
  offline_banner_image?: null,
  plan: object,
  playback_url: string,
  previous_livestreams: [object],
  recent_categories: [object],
  role?: null,
  slug: string,
  subscriber_badges: [SubscriberBadges],
  subscription?: null,
  subscription_enabled: boolean,
  user: object,
  user_id: number,
  verified?: {
    channel_id: number,
    created_at: string,
    id: number,
    updated_at: string,
  },
  vod_enabled: boolean
}

type SubscriberBadges = {
  id: number,
  channel_id: number,
  months: number,
  badge_image: [
    src: string,
    srcset?: string,
  ]
}