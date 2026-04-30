export async function createContext() {
  return {
    session: {
      user: {
        id: "user-1",
        name: "You",
      },
    },
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
