package com.rork.cownit.ui.screens

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.background
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.MoreHoriz
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.rork.cownit.ui.components.BadgeTone
import com.rork.cownit.ui.components.FlatCard
import com.rork.cownit.ui.components.InitialsAvatar
import com.rork.cownit.ui.components.ListRow
import com.rork.cownit.ui.components.ProgressBar
import com.rork.cownit.ui.components.StatCard
import com.rork.cownit.ui.components.StatusBadge
import com.rork.cownit.ui.components.clickableNoRipple
import com.rork.cownit.ui.model.Role
import com.rork.cownit.ui.theme.CownColors

/** Renders the content area for a given role + sidebar section. */
@Composable
fun DashboardContent(
    role: Role,
    sectionId: String,
    sectionLabel: String,
    modifier: Modifier = Modifier,
) {
    LazyColumn(
        modifier = modifier.fillMaxWidth(),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 18.dp, bottom = 40.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item { PageHeader(role = role, sectionId = sectionId, sectionLabel = sectionLabel) }
        when (role) {
            Role.INDIVIDUAL -> individualSections(sectionId)
            Role.HR -> hrSections(sectionId)
            Role.CEO -> ceoSections(sectionId)
        }
    }
}

@Composable
private fun PageHeader(role: Role, sectionId: String, sectionLabel: String) {
    val (title, subtitle, cta) = headerCopy(role, sectionId, sectionLabel)
    Column {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(
                    text = title,
                    color = CownColors.Ink,
                    style = androidx.compose.material3.MaterialTheme.typography.headlineMedium,
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    text = subtitle,
                    color = CownColors.Muted,
                    style = androidx.compose.material3.MaterialTheme.typography.bodyMedium,
                )
            }
            if (cta != null) {
                Spacer(Modifier.width(12.dp))
                PrimaryButton(text = cta)
            }
        }
    }
}

@Composable
private fun PrimaryButton(text: String) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(9.dp))
            .background(CownColors.Ink)
            .clickableNoRipple { }
            .padding(horizontal = 14.dp, vertical = 9.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = Icons.Outlined.Add,
            contentDescription = null,
            tint = CownColors.White,
            modifier = Modifier.size(16.dp),
        )
        Spacer(Modifier.width(6.dp))
        Text(
            text = text,
            color = CownColors.White,
            fontWeight = FontWeight.Medium,
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall,
        )
    }
}

private fun headerCopy(role: Role, sectionId: String, sectionLabel: String): Triple<String, String, String?> =
    when (role) {
        Role.INDIVIDUAL -> when (sectionId) {
            "dashboard" -> Triple("Good morning, Alex", "Here's where your commitments stand this cycle.", null)
            "commitments" -> Triple("My Commitments", "Track what you've committed to and own the outcome.", "New")
            "goals" -> Triple("Goals", "Your objectives and key results for Q3.", "New")
            "checkins" -> Triple("Check-ins", "Weekly progress updates and reflections.", "Add")
            else -> Triple("Profile", "Your role, team, and accountability settings.", null)
        }
        Role.HR -> when (sectionId) {
            "overview" -> Triple("People Overview", "Organization-wide commitment health at a glance.", null)
            "people" -> Triple("People", "142 employees across 6 departments.", "Invite")
            "commitments" -> Triple("Commitments", "Monitor commitment follow-through across teams.", null)
            "reviews" -> Triple("Reviews", "Performance review cycles and completion.", "Start")
            else -> Triple("Reports", "Exportable insights on engagement and delivery.", "Export")
        }
        Role.CEO -> when (sectionId) {
            "company" -> Triple("Company Pulse", "How the whole organization is owning its goals.", null)
            "departments" -> Triple("Departments", "Performance and alignment by department.", null)
            "performance" -> Triple("Performance", "Delivery trends across the last four cycles.", null)
            "alignment" -> Triple("Strategic Alignment", "How team goals ladder up to company objectives.", null)
            else -> Triple("Insights", "AI-surfaced risks and momentum signals.", "Export")
        }
    }

/* ----------------------------- INDIVIDUAL ----------------------------- */

private fun androidx.compose.foundation.lazy.LazyListScope.individualSections(sectionId: String) {
    item { StatRow(role = Role.INDIVIDUAL) }
    item {
        FlatCard {
            Column {
                CardTitle("Active commitments")
                Spacer(Modifier.height(4.dp))
                commitmentRow("Ship onboarding redesign", "Due Jul 12", 0.72f, BadgeTone.Emerald, "On track")
                Divider()
                commitmentRow("Reduce support backlog 30%", "Due Jul 20", 0.45f, BadgeTone.Amber, "At risk")
                Divider()
                commitmentRow("Mentor two new engineers", "Ongoing", 0.6f, BadgeTone.Blue, "In progress")
            }
        }
    }
    item {
        FlatCard {
            Column {
                CardTitle("This week's check-in")
                Spacer(Modifier.height(10.dp))
                Text(
                    "You've completed 3 of 5 planned outcomes. Log a quick reflection to keep your streak alive.",
                    color = CownColors.InkSoft,
                    style = androidx.compose.material3.MaterialTheme.typography.bodyMedium,
                )
                Spacer(Modifier.height(14.dp))
                ProgressBar(progress = 0.6f)
                Spacer(Modifier.height(8.dp))
                Text("3 / 5 outcomes", color = CownColors.Muted, style = androidx.compose.material3.MaterialTheme.typography.bodySmall)
            }
        }
    }
}

/* -------------------------------- HR -------------------------------- */

private fun androidx.compose.foundation.lazy.LazyListScope.hrSections(sectionId: String) {
    item { StatRow(role = Role.HR) }
    item {
        FlatCard {
            Column {
                CardTitle("Departments")
                Spacer(Modifier.height(4.dp))
                deptRow("Engineering", "38 people", 0.81f)
                Divider()
                deptRow("Sales", "26 people", 0.64f)
                Divider()
                deptRow("Product", "19 people", 0.77f)
                Divider()
                deptRow("Customer Success", "22 people", 0.58f)
            }
        }
    }
    item {
        FlatCard {
            Column {
                CardTitle("Needs attention")
                Spacer(Modifier.height(4.dp))
                ListRow(
                    title = "12 reviews overdue",
                    subtitle = "Q2 cycle closes in 4 days",
                    onClick = {},
                    trailing = { StatusBadge("Overdue", BadgeTone.Rose) },
                )
                Divider()
                ListRow(
                    title = "8 commitments unassigned",
                    subtitle = "Across Sales and Success",
                    onClick = {},
                    trailing = { StatusBadge("Action", BadgeTone.Amber) },
                )
            }
        }
    }
}

/* -------------------------------- CEO -------------------------------- */

private fun androidx.compose.foundation.lazy.LazyListScope.ceoSections(sectionId: String) {
    item { StatRow(role = Role.CEO) }
    item {
        FlatCard {
            Column {
                CardTitle("Objective alignment")
                Spacer(Modifier.height(10.dp))
                objectiveRow("Grow ARR to \$24M", 0.68f, BadgeTone.Emerald)
                Spacer(Modifier.height(14.dp))
                objectiveRow("Launch enterprise tier", 0.42f, BadgeTone.Amber)
                Spacer(Modifier.height(14.dp))
                objectiveRow("World-class NPS (>60)", 0.85f, BadgeTone.Emerald)
            }
        }
    }
    item {
        FlatCard {
            Column {
                CardTitle("Department performance")
                Spacer(Modifier.height(4.dp))
                deptRow("Engineering", "Velocity +12%", 0.81f)
                Divider()
                deptRow("Sales", "Quota 64%", 0.64f)
                Divider()
                deptRow("Product", "On roadmap", 0.77f)
            }
        }
    }
}

/* ----------------------------- shared bits ----------------------------- */

@Composable
private fun StatRow(role: Role) {
    val stats = when (role) {
        Role.INDIVIDUAL -> listOf(
            Triple("Commitments", "8", "+2"),
            Triple("On track", "75%", "+6%"),
        )
        Role.HR -> listOf(
            Triple("Employees", "142", "+9"),
            Triple("Follow-through", "82%", "+4%"),
        )
        Role.CEO -> listOf(
            Triple("Goal completion", "71%", "+5%"),
            Triple("Alignment", "88%", "+3%"),
        )
    }
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        stats.forEach { (label, value, delta) ->
            StatCard(
                label = label,
                value = value,
                delta = delta,
                positive = true,
                modifier = Modifier.weight(1f),
            )
        }
    }
}

@Composable
private fun CardTitle(text: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(
            text = text,
            color = CownColors.Ink,
            style = androidx.compose.material3.MaterialTheme.typography.titleLarge,
            modifier = Modifier.weight(1f),
        )
        Icon(
            imageVector = Icons.Outlined.MoreHoriz,
            contentDescription = null,
            tint = CownColors.Faint,
            modifier = Modifier.size(18.dp),
        )
    }
}

@Composable
private fun Divider() {
    Box(
        Modifier
            .fillMaxWidth()
            .height(0.5.dp)
            .background(CownColors.Border)
    )
}

@Composable
private fun commitmentRow(title: String, due: String, progress: Float, tone: BadgeTone, status: String) {
    Column(Modifier.padding(vertical = 12.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = title,
                color = CownColors.Ink,
                style = androidx.compose.material3.MaterialTheme.typography.titleMedium,
                modifier = Modifier.weight(1f),
            )
            StatusBadge(status, tone)
        }
        Spacer(Modifier.height(10.dp))
        ProgressBar(
            progress = progress,
            fill = when (tone) {
                BadgeTone.Amber -> CownColors.Amber
                BadgeTone.Rose -> CownColors.Rose
                BadgeTone.Blue -> CownColors.Blue
                else -> CownColors.Emerald
            },
        )
        Spacer(Modifier.height(8.dp))
        Row {
            Text("${(progress * 100).toInt()}% complete", color = CownColors.Muted, style = androidx.compose.material3.MaterialTheme.typography.bodySmall)
            Spacer(Modifier.weight(1f))
            Text(due, color = CownColors.Faint, style = androidx.compose.material3.MaterialTheme.typography.bodySmall)
        }
    }
}

@Composable
private fun deptRow(name: String, meta: String, progress: Float) {
    Row(modifier = Modifier.padding(vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
        InitialsAvatar(initials = name.take(2).uppercase())
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(name, color = CownColors.Ink, style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
            Text(meta, color = CownColors.Muted, style = androidx.compose.material3.MaterialTheme.typography.bodySmall)
        }
        Spacer(Modifier.width(12.dp))
        Box(Modifier.width(96.dp)) {
            Column {
                ProgressBar(progress = progress)
                Spacer(Modifier.height(6.dp))
                Text("${(progress * 100).toInt()}%", color = CownColors.Muted, style = androidx.compose.material3.MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
private fun objectiveRow(title: String, progress: Float, tone: BadgeTone) {
    Column {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = title,
                color = CownColors.Ink,
                style = androidx.compose.material3.MaterialTheme.typography.titleMedium,
                modifier = Modifier.weight(1f),
            )
            Text(
                "${(progress * 100).toInt()}%",
                color = CownColors.InkSoft,
                fontWeight = FontWeight.SemiBold,
                style = androidx.compose.material3.MaterialTheme.typography.titleMedium,
            )
        }
        Spacer(Modifier.height(10.dp))
        ProgressBar(
            progress = progress,
            fill = if (tone == BadgeTone.Amber) CownColors.Amber else CownColors.Emerald,
        )
    }
}
