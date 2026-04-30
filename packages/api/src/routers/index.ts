import type { RouterClient } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

import { createChannel, getChannels } from "../services/channel";
import {
  getConversations,
  getConversationsWithMessages,
} from "../services/conversations";
import { getUsers } from "../services/users";

import {
  getChannelMessages,
  sendChannelMessage,
  addChannelMember,
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

  getUsers: protectedProcedure.handler(() => {
    return getUsers();
  }),

  getConversations: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .handler(({ input }) => {
      return getConversations(input.workspaceId);
    }),

  getConversationsWithMessages: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .handler(({ input }) => {
      return getConversationsWithMessages(input.workspaceId);
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
    .handler(({ input, context }) => {
      return createChannel(
        input.workspaceId,
        input.name,
        context.session.user.id,
      );
    }),

  getChannelMessages: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .handler(({ input }) => {
      return getChannelMessages(input.conversationId);
    }),

  sendChannelMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string(),
      }),
    )
    .handler(({ input, context }) => {
      return sendChannelMessage({
        conversationId: input.conversationId,
        senderId: context.session.user.id,
        content: input.content,
      });
    }),

  addChannelMember: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        userId: z.string(),
      }),
    )
    .handler(({ input, context }) => {
      return addChannelMember(
        input.conversationId,
        input.userId,
        context.session.user.id,
      );
    }),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
