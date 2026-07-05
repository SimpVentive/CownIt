package com.rork.cownit.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

/**
 * CownIt uses a single light, flat enterprise theme. No dark mode, no dynamic
 * colour — the palette is deliberate and consistent across the product.
 */
private val CownColorScheme = lightColorScheme(
    primary = CownColors.Active,
    onPrimary = CownColors.OnActive,
    background = CownColors.White,
    onBackground = CownColors.Ink,
    surface = CownColors.White,
    onSurface = CownColors.Ink,
    surfaceVariant = CownColors.SurfaceMuted,
    onSurfaceVariant = CownColors.Muted,
    outline = CownColors.Border,
    error = CownColors.Negative,
)

@Composable
fun AppTheme(
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = CownColorScheme,
        typography = CownTypography,
        content = content,
    )
}
