package com.rork.cownit.util

import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import java.util.TimeZone

private val isoParser: SimpleDateFormat
    get() = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US).apply {
        timeZone = TimeZone.getTimeZone("UTC")
    }

/** Formats an ISO timestamp as e.g. "Jun 15, 2026". Empty/invalid returns "". */
fun formatDate(iso: String?): String {
    if (iso.isNullOrBlank()) return ""
    return try {
        val date = isoParser.parse(iso) ?: return ""
        SimpleDateFormat("MMM dd, yyyy", Locale.US).format(date)
    } catch (e: Exception) {
        ""
    }
}

/** Short format e.g. "Jun 15". */
fun formatDateShort(iso: String?): String {
    if (iso.isNullOrBlank()) return "Never"
    return try {
        val date = isoParser.parse(iso) ?: return "Never"
        SimpleDateFormat("MMM dd", Locale.US).format(date)
    } catch (e: Exception) {
        "Never"
    }
}

/** Epoch millis for an ISO timestamp, or null. */
fun isoToMillis(iso: String?): Long? {
    if (iso.isNullOrBlank()) return null
    return try {
        isoParser.parse(iso)?.time
    } catch (e: Exception) {
        null
    }
}

/** Current timestamp as an ISO-8601 UTC string. */
fun nowIso(): String = isoParser.format(Calendar.getInstance().time)

/** Current calendar month name, e.g. "June". */
fun currentMonthName(): String {
    val cal = Calendar.getInstance()
    return SimpleDateFormat("MMMM", Locale.US).format(cal.time)
}
