export type GoalMood = "Happy" | "Hungry" | "Danger"

export interface GoalMoodResult {
  mood: GoalMood
  copy: string
  variant: "success" | "default" | "danger"
}

/**
 * Determines the visual state and message for a savings goal widget (Duolingo-style).
 */
export function getGoalMood(
  isTodayPaid: boolean,
  statusHealth: string,
  currentStreak: number,
  t: (key: string, params?: Record<string, string | number>) => string
): GoalMoodResult {
  const h = new Date().getHours()

  if (isTodayPaid) {
    return {
      mood: "Happy",
      copy: t("savings.goalDone"),
      variant: "success",
    }
  }

  if (statusHealth !== "A tiempo" && statusHealth !== "On Track") {
    return {
      mood: "Danger",
      copy: t("savings.dontSleepStreak", { count: currentStreak }),
      variant: "danger",
    }
  }

  // Hungry: isTodayPaid false, status ok
  if (h >= 5 && h < 12) {
    return {
      mood: "Hungry",
      copy: t("savings.morningPiggy"),
      variant: "default",
    }
  }
  if (h >= 12 && h < 18) {
    return {
      mood: "Hungry",
      copy: t("savings.afternoonPiggy"),
      variant: "default",
    }
  }
  return {
    mood: "Hungry",
    copy: t("savings.eveningPiggy"),
    variant: "default",
  }
}

/**
 * Returns true if we're in the last 4 hours of the day and today is not paid.
 */
export function isLastChanceOfDay(isTodayPaid: boolean): boolean {
  if (isTodayPaid) return false
  const h = new Date().getHours()
  return h >= 20 // 8 PM onwards
}
