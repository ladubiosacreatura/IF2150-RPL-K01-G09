import { beforeEach, describe, expect, it, vi } from "vitest";

const user = vi.hoisted(() => ({ getCurrentUser: vi.fn() }));
const history = vi.hoisted(() => ({ findForUser: vi.fn() }));
const feedback = vi.hoisted(() => ({ create: vi.fn() }));
const feedbackErrors = vi.hoisted(() => ({
  FeedbackAlreadyExistsError: class FeedbackAlreadyExistsError extends Error {},
}));

vi.mock("@/controllers/userController", () => user);
vi.mock("@/models/sessionHistory", () => ({ SessionHistory: history }));
vi.mock("@/models/feedback", () => ({
  Feedback: feedback,
  FeedbackAlreadyExistsError: feedbackErrors.FeedbackAlreadyExistsError,
}));

const { checkFeedbackEligibility, submitFeedback } =
  await import("@/controllers/feedbackController");

const idSession = "c2251aa3-8f25-4948-af2e-0421a8cedb1c";
const completedSession = () => ({
  idSession,
  idMentor: "mentor-1",
  status: "SELESAI" as const,
  role: "MENTEE" as const,
  feedback: null,
});

beforeEach(() => {
  vi.resetAllMocks();
  user.getCurrentUser.mockResolvedValue({ idUser: "mentee-1" });
  history.findForUser.mockResolvedValue(completedSession());
  feedback.create.mockResolvedValue(undefined);
});

describe("checkFeedbackEligibility", () => {
  it("returns the session when the mentee attended a completed session without feedback", async () => {
    await expect(checkFeedbackEligibility(idSession)).resolves.toEqual({
      ok: true,
      data: completedSession(),
    });
    expect(history.findForUser).toHaveBeenCalledWith(idSession, "mentee-1");
  });

  it("rejects guests and malformed session ids", async () => {
    user.getCurrentUser.mockResolvedValueOnce(null);
    await expect(checkFeedbackEligibility(idSession)).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });
    await expect(checkFeedbackEligibility("not-a-session")).resolves.toEqual({
      ok: false,
      error: "INVALID_SESSION_ID",
    });
  });

  it.each([
    ["the user is not in the session", null, "NOT_PARTICIPANT"],
    ["the user is the mentor", { ...completedSession(), role: "MENTOR" }, "NOT_PARTICIPANT"],
    [
      "the session is not completed",
      { ...completedSession(), status: "TERJADWAL" },
      "SESSION_NOT_COMPLETED",
    ],
    [
      "feedback was already given",
      { ...completedSession(), feedback: { rating: 4, comment: "" } },
      "FEEDBACK_ALREADY_EXISTS",
    ],
  ])("rejects when %s", async (_case, session, error) => {
    history.findForUser.mockResolvedValueOnce(session);
    await expect(checkFeedbackEligibility(idSession)).resolves.toEqual({ ok: false, error });
  });
});

describe("submitFeedback", () => {
  it("saves the rating for the session mentor with a trimmed comment", async () => {
    await expect(submitFeedback(idSession, 5, "  Sangat membantu  ")).resolves.toEqual({
      ok: true,
      data: undefined,
    });
    expect(feedback.create).toHaveBeenCalledWith(
      idSession,
      "mentee-1",
      "mentor-1",
      5,
      "Sangat membantu",
    );
  });

  it("accepts a rating without a comment", async () => {
    await expect(submitFeedback(idSession, 1)).resolves.toMatchObject({ ok: true });
    expect(feedback.create).toHaveBeenCalledWith(idSession, "mentee-1", "mentor-1", 1, "");
  });

  it.each([0, 6, 2.5, Number.NaN])("rejects rating %s", async (rating) => {
    await expect(submitFeedback(idSession, rating, "")).resolves.toEqual({
      ok: false,
      error: "INVALID_RATING",
    });
    expect(feedback.create).not.toHaveBeenCalled();
  });

  it("rejects comments longer than 500 characters", async () => {
    await expect(submitFeedback(idSession, 4, "a".repeat(501))).resolves.toEqual({
      ok: false,
      error: "INVALID_COMMENT",
    });
    expect(feedback.create).not.toHaveBeenCalled();
  });

  it("does not save feedback when the mentee is not eligible", async () => {
    history.findForUser.mockResolvedValueOnce({ ...completedSession(), status: "TERJADWAL" });
    await expect(submitFeedback(idSession, 4, "")).resolves.toEqual({
      ok: false,
      error: "SESSION_NOT_COMPLETED",
    });
    expect(feedback.create).not.toHaveBeenCalled();
  });

  it("rejects a duplicate submission caught by the database", async () => {
    feedback.create.mockRejectedValueOnce(new feedbackErrors.FeedbackAlreadyExistsError());
    await expect(submitFeedback(idSession, 4, "")).resolves.toEqual({
      ok: false,
      error: "FEEDBACK_ALREADY_EXISTS",
    });
  });

  it("reports other persistence failures", async () => {
    feedback.create.mockRejectedValueOnce(new Error("network"));
    await expect(submitFeedback(idSession, 4, "")).resolves.toEqual({
      ok: false,
      error: "FEEDBACK_SUBMISSION_FAILED",
    });
  });
});
