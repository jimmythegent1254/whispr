import type { RouterClient } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import {
  createChannel,
  getChannelMessages,
  getChannels,
  sendChannelMessage,
} from "../services/channel";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),

  getChannels: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .handler(({ input }) => {
      return getChannels(input.workspaceId);
    }),
  createChannel: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        name: z.string(),
      }),
    )
    .handler(({ input }) => {
      return createChannel(input.workspaceId, input.name);
    }),

  // 📨 Messages
  getChannelMessages: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .handler(({ input }) => {
      return getChannelMessages(input.channelId);
    }),

  sendChannelMessage: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
        content: z.string(),
      }),
    )
    .handler(({ input, context }) => {
      return sendChannelMessage({
        channelId: input.channelId,
        senderId: context.session.user.id,
        content: input.content,
      });
    }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
