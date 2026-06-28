package com.rork.cownit.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowForward
import androidx.compose.material.icons.outlined.ArrowDownward
import androidx.compose.material.icons.outlined.ArrowUpward
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.rork.cownit.ui.theme.CownColors

/** Hairline (0.5px) border used throughout the app. */
val Hairline = BorderStroke(0.5.dp, CownColors.Border)

/** A flat white card with a single hairline border — no shadow, no gradient. */
@Composable
fun FlatCard(
    modifier: Modifier = Modifier,
    padding: PaddingValues = PaddingValues(16.dp),
    content: @Composable () -> Unit,
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        color = CownColors.White,
        border = Hairline,
    ) {
        Box(Modifier.padding(padding)) { content() }
    }
}

/** Small uppercase section eyebrow label. */
@Composable
fun SectionLabel(text: String, modifier: Modifier = Modifier) {
    Text(
        text = text.uppercase(),
        color = CownColors.Faint,
        fontWeight = FontWeight.SemiBold,
        style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
        modifier = modifier,
    )
}

/** A KPI stat card with trend indicator. */
@Composable
fun StatCard(
    label: String,
    value: String,
    delta: String? = null,
    positive: Boolean = true,
    modifier: Modifier = Modifier,
) {
    FlatCard(modifier = modifier, padding = PaddingValues(16.dp)) {
        Column {
            Text(
                text = label.uppercase(),
                color = CownColors.Faint,
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
            )
            Spacer(Modifier.height(10.dp))
            Text(
                text = value,
                color = CownColors.Ink,
                style = androidx.compose.material3.MaterialTheme.typography.displaySmall,
            )
            if (delta != null) {
                Spacer(Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    val tint = if (positive) CownColors.Emerald else CownColors.Rose
                    Icon(
                        imageVector = if (positive) Icons.Outlined.ArrowUpward else Icons.Outlined.ArrowDownward,
                        contentDescription = null,
                        tint = tint,
                        modifier = Modifier.size(14.dp),
                    )
                    Spacer(Modifier.width(4.dp))
                    Text(
                        text = delta,
                        color = tint,
                        fontWeight = FontWeight.Medium,
                        style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
                    )
                    Spacer(Modifier.width(6.dp))
                    Text(
                        text = "vs last cycle",
                        color = CownColors.Faint,
                        style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
                    )
                }
            }
        }
    }
}

enum class BadgeTone { Emerald, Amber, Rose, Blue, Neutral }

/** A soft, flat status pill. */
@Composable
fun StatusBadge(text: String, tone: BadgeTone, modifier: Modifier = Modifier) {
    val (bg, fg) = when (tone) {
        BadgeTone.Emerald -> CownColors.EmeraldSoft to CownColors.EmeraldDark
        BadgeTone.Amber -> CownColors.AmberSoft to CownColors.Amber
        BadgeTone.Rose -> CownColors.RoseSoft to CownColors.Rose
        BadgeTone.Blue -> CownColors.BlueSoft to CownColors.Blue
        BadgeTone.Neutral -> CownColors.Canvas to CownColors.Muted
    }
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(bg)
            .padding(horizontal = 8.dp, vertical = 4.dp),
    ) {
        Text(
            text = text,
            color = fg,
            fontWeight = FontWeight.Medium,
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium,
        )
    }
}

/** A thin, flat progress bar with smooth fill animation. */
@Composable
fun ProgressBar(
    progress: Float,
    modifier: Modifier = Modifier,
    track: Color = CownColors.Canvas,
    fill: Color = CownColors.Emerald,
    height: androidx.compose.ui.unit.Dp = 6.dp,
) {
    val animated by animateFloatAsState(
        targetValue = progress.coerceIn(0f, 1f),
        animationSpec = tween(700),
        label = "progress",
    )
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .clip(CircleShape)
            .background(track),
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(animated)
                .height(height)
                .clip(CircleShape)
                .background(fill),
        )
    }
}

/** Circular avatar with initials. */
@Composable
fun InitialsAvatar(
    initials: String,
    modifier: Modifier = Modifier,
    size: androidx.compose.ui.unit.Dp = 36.dp,
    bg: Color = CownColors.EmeraldSoft,
    fg: Color = CownColors.EmeraldDark,
) {
    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(bg),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = initials,
            color = fg,
            fontWeight = FontWeight.SemiBold,
            style = androidx.compose.material3.MaterialTheme.typography.labelLarge,
        )
    }
}

/** A row entry with leading icon, title, optional trailing chevron. */
@Composable
fun ListRow(
    title: String,
    subtitle: String? = null,
    leadingIcon: ImageVector? = null,
    trailing: @Composable (() -> Unit)? = null,
    onClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .let { if (onClick != null) it.clickableNoRipple(onClick) else it }
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (leadingIcon != null) {
            Icon(
                imageVector = leadingIcon,
                contentDescription = null,
                tint = CownColors.Muted,
                modifier = Modifier.size(18.dp),
            )
            Spacer(Modifier.width(12.dp))
        }
        Column(Modifier.weight(1f)) {
            Text(
                text = title,
                color = CownColors.Ink,
                style = androidx.compose.material3.MaterialTheme.typography.titleMedium,
            )
            if (subtitle != null) {
                Text(
                    text = subtitle,
                    color = CownColors.Muted,
                    style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
                )
            }
        }
        if (trailing != null) {
            trailing()
        } else if (onClick != null) {
            Icon(
                imageVector = Icons.AutoMirrored.Outlined.ArrowForward,
                contentDescription = null,
                tint = CownColors.Faint,
                modifier = Modifier.size(16.dp),
            )
        }
    }
}

@Composable
fun Modifier.clickableNoRipple(onClick: () -> Unit): Modifier {
    val source = androidx.compose.runtime.remember { MutableInteractionSource() }
    return this.clickable(
        interactionSource = source,
        indication = null,
        onClick = onClick,
    )
}
