package com.rork.cownit.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.GridView
import androidx.compose.material.icons.outlined.Mail
import androidx.compose.material.icons.outlined.Message
import androidx.compose.material.icons.outlined.NotificationsNone
import androidx.compose.material.icons.outlined.PersonSearch
import androidx.compose.material.icons.outlined.Send
import androidx.compose.material.icons.outlined.TrendingUp
import androidx.compose.material.icons.outlined.People
import androidx.compose.ui.graphics.vector.ImageVector
import com.rork.cownit.data.Role

data class NavItem(val page: String, val label: String, val icon: ImageVector)

fun navItemsFor(role: Role): List<NavItem> = when (role) {
    Role.INDIVIDUAL -> listOf(
        NavItem("my-commits", "Commits", Icons.Outlined.CheckCircle),
        NavItem("log-achievement", "Log", Icons.Outlined.TrendingUp),
        NavItem("my-impact", "Impact", Icons.Outlined.BarChart),
        NavItem("messages", "Messages", Icons.Outlined.Message),
    )
    Role.HR -> listOf(
        NavItem("people", "People", Icons.Outlined.People),
        NavItem("drilldown", "View", Icons.Outlined.PersonSearch),
        NavItem("reminders", "Reminders", Icons.Outlined.NotificationsNone),
    )
    Role.CEO -> listOf(
        NavItem("dashboard", "Dashboard", Icons.Outlined.GridView),
        NavItem("people", "People", Icons.Outlined.People),
        NavItem("heatmap", "Heatmap", Icons.Outlined.BarChart),
        NavItem("message", "Message", Icons.Outlined.Send),
    )
}
