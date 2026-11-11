import { beforeEach, describe, expect, it, vi } from "vitest";

const user = vi.hoisted(() => ({ getCurrentUser: vi.fn() }));
const history = vi.hoisted(() => ({
  confirmSession: vi.fn(),
  findForUser: vi.fn(),
}));
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

const { processSessionCompletion } = await import("@/controllers/sessionHistoryController");

const idSession = "c2251aa3-8f25-4948-af2e-0421a8cedb1c";
const input = () => ({
  status: "SELESAI" as const,
  reason: "",
  rating: 5,
  comment: "Sangat membantu",
});
const session = () => ({
  idSession,
  idMentor: "mentor-1",
  endTime: new Date(Date.now() - 60_000).toISOString(),
  status: "TERJADWAL" as const,
  role: "MENTEE" as const,
  feedback: null,
});

beforeEach(() => {
  vi.resetAllMocks();
  user.getCurrentUser.mockResolvedValue({ idUser: "mentee-1" });
  history.findForUser.mockResolvedValue(session());
  history.confirmSession.mockResolvedValue(undefined);
  feedback.create.mockResolvedValue(undefined);
});

describe("processSessionCompletion", () => {
  it("confirms an ended session and saves the mentee rating", async () => {
    await expect(processSessionCompletion(idSession, input())).resolves.toEqual({
      ok: true,
      data: { status: "SELESAI", feedbackSaved: true },
    });
    expect(history.confirmSession).toHaveBeenCalledWith(idSession, "SELESAI", "");
    expect(feedback.create).toHaveBeenCalledWith(
      idSession,
      "mentee-1",
      "mentor-1",
      5,
      "Sangat membantu",
    );
  });

  it("allows rating a completed session after an earlier feedback-save failure", async () => {
    history.findForUser.mockResolvedValue({ ...session(), status: "SELESAI" });

    await expect(processSessionCompletion(idSession, input())).resolves.toEqual({
      ok: true,
      data: { status: "SELESAI", feedbackSaved: true },
    });
    expect(history.confirmSession).not.toHaveBeenCalled();
    expect(feedback.create).toHaveBeenCalledOnce();
  });

  it("allows confirming completion without submitting a rating", async () => {
    const data = { ...input(), rating: 0, comment: "" };

    await expect(processSessionCompletion(idSession, data)).resolves.toEqual({
      ok: true,
      data: { status: "SELESAI", feedbackSaved: false },
    });
    expect(history.confirmSession).toHaveBeenCalledOnce();
    expect(feedback.create).not.toHaveBeenCalled();
  });

  it("rejects unauthorized users and malformed ratings", async () => {
    user.getCurrentUser.mockResolvedValue(null);
    await expect(processSessionCompletion(idSession, input())).resolves.toEqual({
      ok: false,
      error: "UNAUTHORIZED",
    });

    user.getCurrentUser.mockResolvedValue({ idUser: "mentee-1" });
    await expect(processSessionCompletion(idSession, { ...input(), rating: 6 })).resolves.toEqual({
      ok: false,
      error: "INVALID_RATING",
    });
    expect(history.findForUser).not.toHaveBeenCalled();
  });

  it("does not confirm a session before it ends", async () => {
    history.findForUser.mockResolvedValue({
      ...session(),
      endTime: new Date(Date.now() + 60_000).toISOString(),
    });

    await expect(processSessionCompletion(idSession, input())).resolves.toEqual({
      ok: false,
      error: "SESSION_NOT_ENDED",
    });
    expect(history.confirmSession).not.toHaveBeenCalled();
  });

  it("does not allow a mentor to submit feedback", async () => {
    history.findForUser.mockResolvedValue({ ...session(), role: "MENTOR" });

    await expect(processSessionCompletion(idSession, input())).resolves.toEqual({
      ok: false,
      error: "FEEDBACK_NOT_ALLOWED",
    });
    expect(history.confirmSession).not.toHaveBeenCalled();
  });

  it("reports feedback persistence failures without losing the completed session state", async () => {
    feedback.create.mockRejectedValue(new Error("database unavailable"));

    await expect(processSessionCompletion(idSession, input())).resolves.toEqual({
      ok: false,
      error: "FEEDBACK_SUBMISSION_FAILED",
    });
    expect(history.confirmSession).toHaveBeenCalledOnce();
  });
});
