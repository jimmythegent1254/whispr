export type Reaction = {
  emoji: string;
  users: string[]; // usernames who reacted
};

export type Message = {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  reactions: Reaction[];
  edited?: boolean;
  pinned?: boolean;
};

export type User = {
  id: string;
  name: string;
  avatarColor?: string;
  online?: boolean;
  title?: string;
};

export type Conversation = {
  id: string;
  type: "channel" | "dm";
  name: string;
  topic?: string;
  members: string[]; // user ids
  messages: Message[];
};

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "🔥", "🎉"] as const;

export const CURRENT_USER_ID = "u_me";

export const USERS: Record<string, User> = {
  u_me: {
    id: "u_me",
    name: "You",
    avatarColor: "oklch(0.78 0.14 175)",
    online: true,
    title: "Product Designer",
  },
  u_ada: {
    id: "u_ada",
    name: "Ada Lovelace",
    avatarColor: "oklch(0.7 0.18 25)",
    online: true,
    title: "Engineering Lead",
  },
  u_grace: {
    id: "u_grace",
    name: "Grace Hopper",
    avatarColor: "oklch(0.72 0.16 295)",
    online: true,
    title: "Staff Engineer",
  },
  u_linus: {
    id: "u_linus",
    name: "Linus Park",
    avatarColor: "oklch(0.7 0.16 230)",
    online: false,
    title: "Backend Dev",
  },
  u_mira: {
    id: "u_mira",
    name: "Mira Chen",
    avatarColor: "oklch(0.75 0.15 60)",
    online: true,
    title: "PM",
  },
  u_sam: {
    id: "u_sam",
    name: "Sam Rivera",
    avatarColor: "oklch(0.7 0.17 140)",
    online: false,
    title: "Designer",
  },
};

const now = Date.now();
const m = (mins: number) => now - mins * 60_000;

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c_general",
    type: "channel",
    name: "general",
    topic: "Company-wide announcements and work-based matters",
    members: ["u_me", "u_ada", "u_grace", "u_linus", "u_mira", "u_sam"],
    messages: [
      {
        id: "m1",
        userId: "u_ada",
        content: "Morning team! ☀️ Reminder we have the roadmap review at 2pm.",
        timestamp: m(180),
        reactions: [{ emoji: "👍", users: ["u_grace", "u_mira"] }],
      },
      {
        id: "m2",
        userId: "u_mira",
        content: "I'll bring the Q3 priorities deck.",
        timestamp: m(176),
        reactions: [],
      },
      {
        id: "m3",
        userId: "u_grace",
        content:
          "Pushed the new auth refactor to staging — would love eyes on it before EOD.",
        timestamp: m(120),
        reactions: [
          { emoji: "🔥", users: ["u_ada", "u_linus"] },
          { emoji: "🎉", users: ["u_mira"] },
        ],
      },
      {
        id: "m4",
        userId: "u_sam",
        content: "New brand explorations are in Figma — feedback welcome!",
        timestamp: m(45),
        reactions: [{ emoji: "❤️", users: ["u_me", "u_ada", "u_mira"] }],
      },
    ],
  },
  {
    id: "c_random",
    type: "channel",
    name: "random",
    topic: "Non-work banter and water cooler chat",
    members: ["u_me", "u_ada", "u_grace", "u_mira", "u_sam"],
    messages: [
      {
        id: "r1",
        userId: "u_mira",
        content: "Anyone tried the new ramen spot on 5th?",
        timestamp: m(300),
        reactions: [{ emoji: "😂", users: ["u_sam"] }],
      },
      {
        id: "r2",
        userId: "u_sam",
        content: "Went last week — get the spicy miso 🔥",
        timestamp: m(295),
        reactions: [{ emoji: "🔥", users: ["u_mira", "u_ada"] }],
      },
    ],
  },
  {
    id: "c_dev",
    type: "channel",
    name: "development",
    topic: "Engineering discussions, PRs, and incidents",
    members: ["u_me", "u_ada", "u_grace", "u_linus"],
    messages: [
      {
        id: "d1",
        userId: "u_linus",
        content: "Deploy pipeline is ~30% faster after the cache changes.",
        timestamp: m(500),
        reactions: [{ emoji: "🎉", users: ["u_ada", "u_grace", "u_me"] }],
      },
      {
        id: "d2",
        userId: "u_grace",
        content: "Nice work. Let's document the new flow in the wiki.",
        timestamp: m(490),
        reactions: [],
      },
    ],
  },
  {
    id: "dm_ada",
    type: "dm",
    name: "Ada Lovelace",
    members: ["u_me", "u_ada"],
    messages: [
      {
        id: "da1",
        userId: "u_ada",
        content: "Hey! Got a sec to look at the onboarding mocks?",
        timestamp: m(60),
        reactions: [],
      },
      {
        id: "da2",
        userId: "u_me",
        content: "Yeah sending notes shortly 👀",
        timestamp: m(58),
        reactions: [],
      },
    ],
  },
  {
    id: "dm_mira",
    type: "dm",
    name: "Mira Chen",
    members: ["u_me", "u_mira"],
    messages: [
      {
        id: "dm1",
        userId: "u_mira",
        content: "Standup pushed to 10:30 tomorrow 👍",
        timestamp: m(800),
        reactions: [{ emoji: "👍", users: ["u_me"] }],
      },
    ],
  },
];
