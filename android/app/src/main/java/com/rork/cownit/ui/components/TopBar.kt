package com.rork.cownit.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.NotificationsNone
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.rork.cownit.ui.model.Role
import com.rork.cownit.ui.theme.CownColors

/** The fixed top navigation bar: logo + wordmark on the left, role switcher on the right. */
@Composable
fun TopBar(
    activeRole: Role,
    onRoleChange: (Role) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(CownColors.White)
            .padding(horizontal = 16.dp)
            .height(58.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Logo()
        Spacer(Modifier.weight(1f))
        RoleSwitcher(activeRole = activeRole, onRoleChange = onRoleChange)
        Spacer(Modifier.width(12.dp))
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(9.dp))
                .background(CownColors.Canvas)
                .clickableNoRipple { },
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Outlined.NotificationsNone,
                contentDescription = "Notifications",
                tint = CownColors.InkSoft,
                modifier = Modifier.size(18.dp),
            )
        }
    }
}

@Composable
private fun Logo(modifier: Modifier = Modifier) {
    Row(verticalAlignment = Alignment.CenterVertically, modifier = modifier) {
        Box(
            modifier = Modifier
                .size(28.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(CownColors.Ink),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Outlined.Check,
                contentDescription = null,
                tint = CownColors.Emerald,
                modifier = Modifier.size(18.dp),
            )
        }
        Spacer(Modifier.width(9.dp))
        Row(verticalAlignment = Alignment.Bottom) {
            Text(
                text = "Cown",
                color = CownColors.Ink,
                fontWeight = FontWeight.SemiBold,
                style = androidx.compose.material3.MaterialTheme.typography.titleLarge,
            )
            Text(
                text = "It",
                color = CownColors.Emerald,
                fontWeight = FontWeight.SemiBold,
                style = androidx.compose.material3.MaterialTheme.typography.titleLarge,
            )
        }
    }
}

/** Three-button segmented role switcher. */
@Composable
private fun RoleSwitcher(
    activeRole: Role,
    onRoleChange: (Role) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(CownColors.Canvas)
            .padding(2.dp),
        horizontalArrangement = Arrangement.spacedBy(2.dp),
    ) {
        Role.entries.forEach { role ->
            val selected = role == activeRole
            val bg by animateColorAsState(
                targetValue = if (selected) CownColors.White else Color.Transparent,
                animationSpec = tween(180),
                label = "segBg",
            )
            val fg by animateColorAsState(
                targetValue = if (selected) CownColors.Ink else CownColors.Muted,
                animationSpec = tween(180),
                label = "segFg",
            )
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(bg)
                    .clickableNoRipple { onRoleChange(role) }
                    .padding(horizontal = 14.dp, vertical = 7.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = role.label,
                    color = fg,
                    fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Medium,
                    style = androidx.compose.material3.MaterialTheme.typography.titleSmall,
                )
            }
        }
    }
}
