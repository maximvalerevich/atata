import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Имя обязательно"),
          phone: z.string().min(1, "Телефон обязателен"),
        })
      )
      .mutation(async ({ input }) => {
        const { name, phone } = input;
        const message = `🔔 Новая заявка с сайта АТАР\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}`;
        
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (!botToken || !chatId) {
          throw new Error("Telegram не настроен. Пожалуйста, добавьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в настройки.");
        }
        
        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: "Markdown",
            }),
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Ошибка Telegram API: ${errorData.description || "Неизвестная ошибка"}`);
        }
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
