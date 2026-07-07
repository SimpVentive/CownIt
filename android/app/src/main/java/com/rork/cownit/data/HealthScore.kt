package com.rork.cownit.data

import java.util.Calendar

private fun currentMonthYear(): Pair<Int, Int> {
    val cal = Calendar.getInstance()
    return (cal.get(Calendar.MONTH) + 1) to cal.get(Calendar.YEAR)
}

private fun isoMonthYear(iso: String): Pair<Int, Int>? {
    // ISO strings look like 2026-06-15T10:30:00Z
    return try {
        val datePart = iso.substringBefore('T')
        val (y, m, _) = datePart.split('-')
        m.toInt() to y.toInt()
    } catch (e: Exception) {
        null
    }
}

/**
 * Health score, 0–100:
 *  40 — all 3 commit levels have at least one statement
 *  40 — monthly update logged for the current calendar month
 *  20 — at least one achievement logged in the current calendar month
 */
fun computeHealthScore(personId: String, data: AppData): Int {
    val (month, year) = currentMonthYear()
    var score = 0.0

    val filledLevels = data.commits
        .filter { it.personId == personId }
        .map { it.level }
        .toSet()
    score += (filledLevels.size / 3.0) * 40.0

    val hasUpdate = data.monthlyUpdates.any {
        it.personId == personId && it.month == month && it.year == year
    }
    if (hasUpdate) score += 40.0

    val hasAchievement = data.achievements.any { a ->
        a.personId == personId && isoMonthYear(a.date)?.let { (m, y) -> m == month && y == year } == true
    }
    if (hasAchievement) score += 20.0

    return Math.round(score).toInt()
}

/** True when the person has logged a monthly update for the current calendar month. */
fun hasCurrentMonthUpdate(personId: String, data: AppData): Boolean {
    val (month, year) = currentMonthYear()
    return data.monthlyUpdates.any {
        it.personId == personId && it.month == month && it.year == year
    }
}
