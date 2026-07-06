package com.rork.cownit.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

<<<<<<< HEAD
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
=======
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
>>>>>>> 4bf9e85d0aad0573bdb35b4b2b04a136edc4b6bf
)

@Composable
fun AppTheme(
<<<<<<< HEAD
    content: @Composable () -> Unit
=======
    content: @Composable () -> Unit,
>>>>>>> 4bf9e85d0aad0573bdb35b4b2b04a136edc4b6bf
) {
    MaterialTheme(
        colorScheme = CownColorScheme,
        typography = CownTypography,
<<<<<<< HEAD
        content = content
=======
        content = content,
>>>>>>> 4bf9e85d0aad0573bdb35b4b2b04a136edc4b6bf
    )
}
