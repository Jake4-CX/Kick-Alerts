# Kick Alerts

This is a basic kick alert web app made using React (TypeScript). Currently there's greenscreen chat alert and **untested** gift & subscription notifications. Due to how Kick restricts their API access (CORS and strict cloudflare policy), this application is very scuffed and was developed within a few hours. Feel free to improve this application though PRs and if you discover a bug open an issue. I wouldn't recommend using this in production when better working alternatives are released.

## How to use

Here is an example on how to use kick alerts.
Examples:

- ``https://kick-alerts.pages.dev/alerts/{STREAMER_NAME}/{STREAMER_ID}/{STREAMER_CHAT_ID}``
  - Working Examples:
    - **[Suspendas](https://kick.com/suspendas)**: ``https://kick-alerts.pages.dev/alerts/suspendas/77528/77526``
    - **[TheRealMoisesB](https://kick.com/therealmoisesb)**: ``https://kick-alerts.pages.dev/alerts/therealmoisesb/57942/57940``
  - **{STREAMER_NAME}**: The username of the streamer (case sensitive)
  - **{STREAMER_ID}**: The streamer's ID. This can be found by quering the kicks API or viewing the open chat's websocket session. This is often referred to as the channel id.
  - **{STREAMER_CHAT_ID}**: The chat's ID. This can also be found by queriing the kicks API or viewing the websocket session. This is called the chatroom id.

**Need help?** DM me on discord: Jake4#2664

### ToDo

- [ ] Automated - Queries Kicks API (Requirement: Kick to publicize API)
- [ ] Recode application.

### In Progress

- [ ] Subscription alerts - (kind of works)
- [ ] Gift alerts - (kind of works)

### Done

- [x] Greenscreen Chat.

## Discovered chat pusher events:

- ChatMessageSentEvent ``{"data": {"message":{"id":"adde50ea-52b6-4d20-9af8-7d1cc981b590","message":"[emote:20263:Susskekw]","type":"message","replied_to":null,"is_info":null,"link_preview":null,"chatroom_id":"77526","role":null,"created_at":1679407025,"action":null,"optional_message":null,"months_subscribed":2,"subscriptions_count":null,"giftedUsers":null},"user":{"id":345492,"username":"fall3nkid","role":null,"isSuperAdmin":false,"profile_thumb":null,"verified":false,"follower_badges":[],"is_subscribed":true,"is_founder":false,"months_subscribed":2,"quantity_gifted":0}}}``
- ChatMessageReact ``{"data":{"data":{"message_id":"69e0350c-de6c-4891-ab9c-e2a6726b5984","reaction":"ud83dudca5","chatroom_id":"603448","user_id":1030238}}}``
- ChannelSubscriptionEvent ``{"data": {"user_ids":[894845],"channel_id":603664}}``
- ChatMessageDeletedEvent ``{"data":{"deletedMessage":{"id":"e4a2cc71-5e99-49e5-9112-2eafb30b414d","deleted_by":5649,"chatroom_id":"4910"}}}``
- UserMutedEvent ``{"data":{"mutedUser":{"id":89164,"user_id":78345,"muted_user_id":171553,"created_at":"2023-03-11T17:09:12.000000Z","updated_at":"2023-03-11T17:09:12.000000Z","muted_by":200513,"muted_user":{"id":171553,"username":"jantjuh","agreed_to_terms":true,"bio":null,"country":null,"state":null,"city":null,"instagram":null,"twitter":null,"youtube":null,"discord":null,"tiktok":null,"facebook":null,"birthdate":null}}}}``
- UserUnmutedEvent ``{"data": {"data": { "message_id":"69e0350c-de6c-4891-ab9c-e2a6726b5984", "reaction":"ud83dudca5" }}``
- LuckyUsersWhoGotGiftSubscriptionsEvent ``{"data": { "user_ids":[32713], "channel_id":4911}}``
- GiftsLeaderboardUpdated ``{"data": {"channel":{"id":4911,"user_id":4959,"slug":"classybeef","playback_url":"https://fa723fc1b171.us-west-2.playback.live-video.net/api/video/v1/us-west-2.196233775518.channel.CY9ydRZGGeGL.m3u8","name_updated_at":null,"vod_enabled":true,"subscription_enabled":true,"cf_rate_limiter":"2.35","can_host":true,"chatroom":{"id":4910,"chatable_type":"AppModelsChannel","channel_id":4911,"created_at":"2022-11-22T13:44:17.000000Z","updated_at":"2023-03-16T20:23:42.000000Z","chat_mode_old":"public","chat_mode":"followers_only","slow_mode":false,"chatable_id":4911}},"leaderboard":[{"user_id":5714,"username":"joeclassybeef","quantity":1042},{"user_id":6658,"username":"pyronation","quantity":824},{"user_id":235534,"username":"Gingerninja57","quantity":150},{"user_id":38101,"username":"spazz2189","quantity":126},{"user_id":5776,"username":"donvolto","quantity":112},{"user_id":2178,"username":"Evert","quantity":100},{"user_id":470211,"username":"76forthy3","quantity":91},{"user_id":5718,"username":"hairyfoxx","quantity":76},{"user_id":1040405,"username":"reality23","quantity":75},{"user_id":22,"username":"Eddie","quantity":50}],"gifter_id":183402,"gifted_quantity":5}}``

**Note** this is just the data object of the packet and all events begin with `App\\Events\\`