package com.rork.cownit.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.rork.cownit.ui.model.NavItem
import com.rork.cownit.ui.model.Role
import com.rork.cownit.ui.theme.CownColors

/**
 * Collapsed icon-rail sidebar that reflows its items based on the active role.
 * Labels appear beneath each icon to keep the rail compact yet legible on phones.
 */
@Composable
fun Sidebar(
    role: Role,
    items: List<NavItem>,
    activeId: String,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxHeight()
            .width(76.dp)
            .background(CownColors.RailTint)
            .padding(vertical = 14.dp, horizontal = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = role.label.uppercase(),
            color = CownColors.Faint,
            fontWeight = FontWeight.SemiBold,
            style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
        )
        Spacer(Modifier.height(14.dp))
        items.forEach { item ->
            SidebarItem(
                item = item,
                selected = item.id == activeId,
                onClick = { onSelect(item.id) },
            )
            Spacer(Modifier.height(6.dp))
        }
    }
}

@Composable
private fun SidebarItem(
    item: NavItem,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val bg by animateColorAsState(
        targetValue = if (selected) CownColors.EmeraldSoft else Color.Transparent,
        animationSpec = tween(180),
        label = "navBg",
    )
    val fg by animateColorAsState(
        targetValue = if (selected) CownColors.EmeraldDark else CownColors.Muted,
        animationSpec = tween(180),
        label = "navFg",
    )
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(bg)
            .clickableNoRipple(onClick)
            .padding(vertical = 9.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Icon(
            imageVector = item.icon,
            contentDescription = item.label,
            tint = fg,
            modifier = Modifier.size(20.dp),
        )
        Spacer(Modifier.height(5.dp))
        Text(
            text = item.label,
            color = fg,
            fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Medium,
            style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
            maxLines = 2,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            lineHeight = androidx.compose.ui.unit.TextUnit(12f, androidx.compose.ui.unit.TextUnitType.Sp),
        )
    }
}
