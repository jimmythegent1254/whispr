import { store, generateId, type Conversation } from "./store";

export const seed = () => {
  if (store.users.length > 0) return;

  const users = [
    {
      id: "u_me",
      name: "You",
      avatarColor: "oklch(0.78 0.14 175)",
      online: true,
      title: "Product Designer",
    },
    {
      id: "u_ada",
      name: "Ada Lovelace",
      avatarColor: "oklch(0.7 0.18 25)",
      online: true,
      title: "Engineering Lead",
    },
    {
      id: "u_grace",
      name: "Grace Hopper",
      avatarColor: "oklch(0.72 0.16 295)",
      online: true,
      title: "Staff Engineer",
    },
    {
      id: "u_linus",
      name: "Linus Park",
      avatarColor: "oklch(0.7 0.16 230)",
      online: false,
      title: "Backend Dev",
    },
    {
      id: "u_mira",
      name: "Mira Chen",
      avatarColor: "oklch(0.75 0.15 60)",
      online: true,
      title: "PM",
    },
    {
      id: "u_sam",
      name: "Sam Rivera",
      avatarColor: "oklch(0.7 0.17 140)",
      online: false,
      title: "Designer",
    },
    {
      id: "u_tesla",
      name: "Nikola Tesla",
      avatarColor: "oklch(0.7 0.15 180)",
      online: false,
      title: "Inventor",
    },
    {
      id: "u_curie",
      name: "Marie Curie",
      avatarColor: "oklch(0.75 0.16 320)",
      online: true,
      title: "Scientist",
    },
    {
      id: "u_turing",
      name: "Alan Turing",
      avatarColor: "oklch(0.72 0.17 90)",
      online: false,
      title: "Computer Scientist",
    },
    {
      id: "u_babbage",
      name: "Charles Babbage",
      avatarColor: "oklch(0.7 0.18 0)",
      online: false,
      title: "Mathematician",
    },
  ];

  store.users.push(...users);

  const workspace = {
    id: "ws_1",
    name: "Whispr Workspace",
  };

  store.workspaces.push(workspace);

  const conversations = [
    {
      id: "c_general",
      workspaceId: workspace.id,
      type: "channel",
      name: "general",
      topic: "Company-wide announcements and work-based matters",
    },
    {
      id: "c_random",
      workspaceId: workspace.id,
      type: "channel",
      name: "random",
      topic: "Non-work banter and water cooler chat",
    },
    {
      id: "c_dev",
      workspaceId: workspace.id,
      type: "channel",
      name: "development",
      topic: "Engineering discussions, PRs, and incidents",
    },
    {
      id: "c_design",
      workspaceId: workspace.id,
      type: "channel",
      name: "design",
      topic: "Design discussions and feedback",
    },

    // DM example
    {
      id: "dm_ada",
      workspaceId: workspace.id,
      type: "dm",
      name: "Ada Lovelace",
    },
  ] satisfies Conversation[];

  store.conversations.push(...conversations);

  const allUserIds = users.map((u) => u.id);

  for (const conv of conversations) {
    for (const userId of allUserIds) {
      store.conversationMembers.push({
        conversationId: conv.id,
        userId,
      });
    }
  }

  const now = Date.now();
  const m = (mins: number) => now - mins * 60_000;

  const messages = [
    // GENERAL
    {
      id: generateId(),
      conversationId: "c_general",
      senderId: "u_ada",
      content: "Welcome to the workspace 👋",
      createdAt: m(180),
    },
    {
      id: generateId(),
      conversationId: "c_general",
      senderId: "u_grace",
      content: "Excited to build this out.",
      createdAt: m(175),
    },
    {
      id: generateId(),
      conversationId: "c_general",
      senderId: "u_mira",
      content: "Roadmap review at 2pm.",
      createdAt: m(170),
    },
    {
      id: generateId(),
      conversationId: "c_general",
      senderId: "u_me",
      content: "Got it 👍",
      createdAt: m(165),
    },

    // RANDOM
    {
      id: generateId(),
      conversationId: "c_random",
      senderId: "u_sam",
      content: "Best coffee spot near office?",
      createdAt: m(120),
    },
    {
      id: generateId(),
      conversationId: "c_random",
      senderId: "u_mira",
      content: "Try the one on 5th street ☕",
      createdAt: m(118),
    },
    {
      id: generateId(),
      conversationId: "c_random",
      senderId: "u_curie",
      content: "Caffeine improves reaction time in cognitive tasks.",
      createdAt: m(115),
    },

    // DEV
    {
      id: generateId(),
      conversationId: "c_dev",
      senderId: "u_linus",
      content: "Auth refactor is complete.",
      createdAt: m(60),
    },
    {
      id: generateId(),
      conversationId: "c_dev",
      senderId: "u_turing",
      content: "We should add rate limiting next.",
      createdAt: m(55),
    },
    {
      id: generateId(),
      conversationId: "c_dev",
      senderId: "u_grace",
      content: "Agree. I'll draft it.",
      createdAt: m(50),
    },

    // DESIGN
    {
      id: generateId(),
      conversationId: "c_design",
      senderId: "u_sam",
      content: "New UI mock is up in Figma.",
      createdAt: m(30),
    },
    {
      id: generateId(),
      conversationId: "c_design",
      senderId: "u_mira",
      content: "Spacing improvements look great.",
      createdAt: m(25),
    },
    {
      id: generateId(),
      conversationId: "c_design",
      senderId: "u_me",
      content: "This is starting to feel like Slack 👀",
      createdAt: m(20),
    },

    // DM
    {
      id: generateId(),
      conversationId: "dm_ada",
      senderId: "u_ada",
      content: "Hey, can you review the onboarding flow?",
      createdAt: m(10),
    },
    {
      id: generateId(),
      conversationId: "dm_ada",
      senderId: "u_me",
      content: "Yep, sending feedback soon.",
      createdAt: m(8),
    },
  ];

  store.messages.push(...messages);
};
