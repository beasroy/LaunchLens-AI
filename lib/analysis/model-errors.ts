type GeminiApiErrorBody = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function parseGeminiApiError(message: string): GeminiApiErrorBody | null {
  const jsonMatch = message.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]) as GeminiApiErrorBody;
  } catch {
    return null;
  }
}

export function isQuotaExceededError(error: unknown): boolean {
  const message = getErrorMessage(error);
  const apiError = parseGeminiApiError(message);
  const apiMessage = apiError?.error?.message ?? "";

  if (apiError?.error?.code === 429) return true;

  const combined = `${message} ${apiMessage}`;
  return (
    /\b429\b/.test(combined) ||
    /quota exceeded/i.test(combined) ||
    /exceeded your current quota/i.test(combined) ||
    /free_tier/i.test(combined) ||
    /free-tier/i.test(combined) ||
    (/RESOURCE_EXHAUSTED/i.test(combined) && /quota/i.test(combined))
  );
}

/** Whether to try the next model in the chain (overload or per-model quota). */
export function shouldFallbackToNextModel(error: unknown): boolean {
  return isModelOverloadError(error) || isQuotaExceededError(error);
}

/** Temporary capacity issues — safe to retry with a fallback model. */
export function isModelOverloadError(error: unknown): boolean {
  if (isQuotaExceededError(error)) return false;

  const message = getErrorMessage(error);
  const apiError = parseGeminiApiError(message);

  if (apiError?.error?.code === 503) return true;

  const status = apiError?.error?.status ?? "";
  const apiMessage = apiError?.error?.message ?? "";
  const combined = `${message} ${status} ${apiMessage}`;

  return (
    /\b503\b/.test(combined) ||
    /UNAVAILABLE/i.test(combined) ||
    /high demand/i.test(combined) ||
    /overloaded/i.test(combined)
  );
}

export function formatAnalysisError(
  error: unknown,
  options?: { allModelsTried?: boolean }
): string {
  if (isQuotaExceededError(error) && options?.allModelsTried) {
    return [
      "You've reached the free-tier quota for all configured models, so validation can't run right now.",
      "Quotas usually reset over time, or you can upgrade your plan in Google AI Studio.",
      "Check usage: https://ai.dev/rate-limit",
    ].join(" ");
  }

  if (!(error instanceof Error)) {
    return "Analysis failed unexpectedly.";
  }

  const apiError = parseGeminiApiError(error.message);
  const apiMessage = apiError?.error?.message;

  if (apiMessage && !isQuotaExceededError(error)) {
    if (isModelOverloadError(error)) {
      return "The AI model is temporarily overloaded. Please try again in a few minutes.";
    }
    return apiMessage;
  }

  if (isModelOverloadError(error)) {
    return "All configured models are temporarily overloaded. Please try again in a few minutes.";
  }

  return error.message;
}
