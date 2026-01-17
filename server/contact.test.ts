import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up environment variables for tests
    process.env.TELEGRAM_BOT_TOKEN = "test-bot-token";
    process.env.TELEGRAM_CHAT_ID = "test-chat-id";
  });

  it("should successfully submit contact form with valid data", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Mock successful Telegram API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const result = await caller.contact.submit({
      name: "Иван Петров",
      phone: "+7 (923) 123-45-67",
    });

    expect(result).toEqual({ success: true });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-bot-token/sendMessage",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );

    // Verify the message content
    const callArgs = mockFetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.chat_id).toBe("test-chat-id");
    expect(body.text).toContain("Иван Петров");
    expect(body.text).toContain("+7 (923) 123-45-67");
    expect(body.parse_mode).toBe("Markdown");
  });

  it("should throw error when name is empty", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        phone: "+7 (923) 123-45-67",
      })
    ).rejects.toThrow();
  });

  it("should throw error when phone is empty", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Иван Петров",
        phone: "",
      })
    ).rejects.toThrow();
  });

  it("should throw error when Telegram credentials are missing", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Remove environment variables
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;

    await expect(
      caller.contact.submit({
        name: "Иван Петров",
        phone: "+7 (923) 123-45-67",
      })
    ).rejects.toThrow("Telegram не настроен");
  });

  it("should throw error when Telegram API returns error", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    process.env.TELEGRAM_BOT_TOKEN = "test-bot-token";
    process.env.TELEGRAM_CHAT_ID = "test-chat-id";

    // Mock failed Telegram API response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ description: "Invalid bot token" }),
    });

    await expect(
      caller.contact.submit({
        name: "Иван Петров",
        phone: "+7 (923) 123-45-67",
      })
    ).rejects.toThrow("Ошибка Telegram API");
  });
});
