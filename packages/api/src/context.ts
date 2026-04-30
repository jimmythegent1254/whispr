export async function createContext() {
  return {
    session: {
      user: {
        id: "u_me",
        name: "You",
      },
    },
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
