package com.rork.cownit.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.TextFieldColors
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.rork.cownit.ui.theme.CownColors

/** Clickable without the ripple indication, used for read-only dropdown fields. */
fun Modifier.clickableNoRipple(onClick: () -> Unit): Modifier = this.then(
    Modifier.clickable(
        interactionSource = MutableInteractionSource(),
        indication = null,
        onClick = onClick,
    )
)

@Composable
fun fieldColors(): TextFieldColors = OutlinedTextFieldDefaults.colors(
    focusedBorderColor = CownColors.Faint,
    unfocusedBorderColor = CownColors.Border,
    focusedContainerColor = CownColors.White,
    unfocusedContainerColor = CownColors.White,
    cursorColor = CownColors.Ink,
)

@Composable
fun disabledFieldColors(): TextFieldColors = OutlinedTextFieldDefaults.colors(
    disabledBorderColor = CownColors.Border,
    disabledContainerColor = CownColors.White,
    disabledTextColor = CownColors.Ink,
    disabledTrailingIconColor = CownColors.Muted,
)
