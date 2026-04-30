import { store, generateId } from "./store";

export const seed = () => {
  if (store.users.length > 0) return; // Prevent reseeding

  const user = { id: "user-1", name: "You" };
  const workspace = { id: "ws-1", name: "My Workspace" };

  const general = {
    id: generateId(),
    workspaceId: workspace.id,
    name: "general",
  };

  store.users.push(user);
  store.workspaces.push(workspace);
  store.channels.push(general);

  store.channelMembers.push({
    channelId: general.id,
    userId: user.id,
  });
};
