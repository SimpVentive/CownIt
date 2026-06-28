package com.rork.cownit.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val CownColorScheme = lightColorScheme(
    primary = CownColors.Emerald,
    onPrimary = CownColors.White,
    primaryContainer = CownColors.EmeraldSoft,
    onPrimaryContainer = CownColors.EmeraldDark,
    secondary = CownColors.InkSoft,
    onSecondary = CownColors.White,
    background = CownColors.Canvas,
    onBackground = CownColors.Ink,
    surface = CownColors.White,
    onSurface = CownColors.Ink,
    surfaceVariant = CownColors.Canvas,
    onSurfaceVariant = CownColors.Muted,
    outline = CownColors.Border,
    outlineVariant = CownColors.Border,
    error = CownColors.Rose,
    onError = CownColors.White,
)

@Composable
fun AppTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = CownColorScheme,
        typography = CownTypography,
        content = content
    )
}
