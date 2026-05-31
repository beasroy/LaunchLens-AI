export function getScoreTone(score: number) {
  if (score >= 75) {
    return {
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
      bar: "from-emerald-400 to-teal-500",
      label: "Strong",
    };
  }
  if (score >= 50) {
    return {
      badge: "bg-amber-50 text-amber-700 ring-amber-200/60",
      bar: "from-amber-400 to-orange-500",
      label: "Moderate",
    };
  }
  return {
    badge: "bg-rose-50 text-rose-700 ring-rose-200/60",
    bar: "from-rose-400 to-pink-500",
    label: "Needs work",
  };
}

export function getScoreBucket(score: number): "strong" | "moderate" | "weak" {
  if (score >= 75) return "strong";
  if (score >= 50) return "moderate";
  return "weak";
}
