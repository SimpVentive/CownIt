package com.rork.cownit.ui.model

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountTree
import androidx.compose.material.icons.outlined.Assignment
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.Business
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Dashboard
import androidx.compose.material.icons.outlined.EventAvailable
import androidx.compose.material.icons.outlined.Flag
import androidx.compose.material.icons.outlined.Groups
import androidx.compose.material.icons.outlined.Insights
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.RateReview
import androidx.compose.material.icons.outlined.TrackChanges
import androidx.compose.material.icons.outlined.TrendingUp
import androidx.compose.ui.graphics.vector.ImageVector

/** The three workspace roles available in the top-right switcher. */
enum class Role(val label: String) {
    INDIVIDUAL("Individual"),
    HR("HR"),
    CEO("CEO"),
}

/** A single entry in the role-aware sidebar. */
data class NavItem(
    val id: String,
    val label: String,
    val icon: ImageVector,
)

/** Sidebar contents change depending on the active role. */
fun navItemsFor(role: Role): List<NavItem> = when (role) {
    Role.INDIVIDUAL -> listOf(
        NavItem("dashboard", "Dashboard", Icons.Outlined.Dashboard),
        NavItem("commitments", "My Commitments", Icons.Outlined.CheckCircle),
        NavItem("goals", "Goals", Icons.Outlined.Flag),
        NavItem("checkins", "Check-ins", Icons.Outlined.EventAvailable),
        NavItem("profile", "Profile", Icons.Outlined.Person),
    )
    Role.HR -> listOf(
        NavItem("overview", "Overview", Icons.Outlined.Dashboard),
        NavItem("people", "People", Icons.Outlined.Groups),
        NavItem("commitments", "Commitments", Icons.Outlined.Assignment),
        NavItem("reviews", "Reviews", Icons.Outlined.RateReview),
        NavItem("reports", "Reports", Icons.Outlined.BarChart),
    )
    Role.CEO -> listOf(
        NavItem("company", "Company", Icons.Outlined.Business),
        NavItem("departments", "Departments", Icons.Outlined.AccountTree),
        NavItem("performance", "Performance", Icons.Outlined.TrendingUp),
        NavItem("alignment", "Alignment", Icons.Outlined.TrackChanges),
        NavItem("insights", "Insights", Icons.Outlined.Insights),
    )
}
