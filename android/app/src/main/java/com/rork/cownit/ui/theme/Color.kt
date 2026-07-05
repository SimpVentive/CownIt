package com.rork.cownit.ui.theme

import androidx.compose.ui.graphics.Color

/**
 * CownIt design tokens.
 * The brand has no primary colour — it is neutral gray with CPQSDP and commit
 * level colours providing all accent. Flat, professional, enterprise tone.
 */
object CownColors {
    // Neutrals / surfaces
    val White = Color(0xFFFFFFFF)
    val Canvas = Color(0xFFF9F9F9)
    val SurfaceMuted = Color(0xFFF5F5F5)
    val Border = Color(0xFFE0E0E0)

    // Text / ink
    val Ink = Color(0xFF000000)
    val InkSoft = Color(0xFF333333)
    val Muted = Color(0xFF666666)
    val Faint = Color(0xFF999999)

    // Neutral action accent (active states) — neutral, not a brand colour
    val Active = Color(0xFF000000)
    val OnActive = Color(0xFFFFFFFF)

    // Login screen accent — deep navy used for the primary login button only
    val LoginNavy = Color(0xFF0B1F3A)

    // CPQSDP dimension colours
    val Cost = Color(0xFF534AB7)          // C
    val Productivity = Color(0xFF0F6E56)  // P
    val Quality = Color(0xFF3B6D11)       // Q
    val Safety = Color(0xFF993C1D)        // S
    val Delivery = Color(0xFF185FA5)      // D
    val People = Color(0xFF854F0B)        // O

    // Commit level colours
    val SelfBg = Color(0xFFEEEDFE)
    val SelfText = Color(0xFF3C3489)
    val TeamBg = Color(0xFFE1F5EE)
    val TeamText = Color(0xFF085041)
    val OrgBg = Color(0xFFFAEEDA)
    val OrgText = Color(0xFF633806)

    // Neutral status (kept muted, used only for health/status indication)
    val Positive = Color(0xFF2E7D32)
    val PositiveBg = Color(0xFFE8F5E9)
    val Negative = Color(0xFFB42318)
    val NegativeBg = Color(0xFFFBEAE8)
    val Caution = Color(0xFF8A6D1A)
    val CautionBg = Color(0xFFFBF3E2)
}

/** Maps a CPQSDP key to its dimension colour. */
fun cpqsdpColor(key: String): Color = when (key) {
    "C" -> CownColors.Cost
    "P" -> CownColors.Productivity
    "Q" -> CownColors.Quality
    "S" -> CownColors.Safety
    "D" -> CownColors.Delivery
    "O" -> CownColors.People
    else -> CownColors.Muted
}
