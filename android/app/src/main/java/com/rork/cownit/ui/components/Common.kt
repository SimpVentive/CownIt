package com.rork.cownit.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.ui.theme.CownColors

/** Flat white card with a hairline border and 12dp radius. No shadows. */
@Composable
fun CownCard(
    modifier: Modifier = Modifier,
    padding: PaddingValues = PaddingValues(16.dp),
    content: @Composable () -> Unit,
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CownColors.White),
        border = BorderStroke(0.5.dp, CownColors.Border),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
    ) {
        Box(modifier = Modifier.padding(padding)) {
            content()
        }
    }
}

/** Horizontal segment button used for role and level selection. */
@Composable
fun SegmentButton(
    label: String,
    selected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(42.dp),
        shape = RoundedCornerShape(8.dp),
        border = if (selected) null else BorderStroke(0.5.dp, CownColors.Border),
        colors = ButtonDefaults.buttonColors(
            containerColor = if (selected) CownColors.Active else CownColors.SurfaceMuted,
            contentColor = if (selected) CownColors.OnActive else CownColors.Ink,
        ),
        contentPadding = PaddingValues(horizontal = 4.dp),
    ) {
        Text(label, fontSize = 13.sp, textAlign = TextAlign.Center)
    }
}

/** Small rounded status pill. */
@Composable
fun StatusBadge(
    text: String,
    background: Color,
    textColor: Color,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .background(background, RoundedCornerShape(8.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp),
    ) {
        Text(
            text = text,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
        )
    }
}
