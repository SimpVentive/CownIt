package com.rork.cownit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.AppState
import com.rork.cownit.data.Dimension
import com.rork.cownit.data.hasCurrentMonthUpdate
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.theme.CownColors
import com.rork.cownit.ui.theme.cpqsdpColor
import com.rork.cownit.util.formatDate
import com.rork.cownit.util.isoToMillis

@Composable
fun CeoDashboardScreen(state: AppState) {
    val data = state.data
    val totalPeople = data.people.size
    val totalAchievements = data.achievements.size
    val avgImpact = if (totalAchievements > 0) {
        String.format("%.1f", data.achievements.sumOf { it.impactRating }.toDouble() / totalAchievements)
    } else "—"
    val updatedCount = data.people.count { hasCurrentMonthUpdate(it.id, data) }
    val uniqueDepts = data.people.map { it.department }.toSet().size

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("Dashboard")
        Spacer(Modifier.height(20.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            StatCard("People committed", totalPeople.toString(), Modifier.weight(1f), "across $uniqueDepts ${if (uniqueDepts == 1) "department" else "departments"}")
            StatCard("Total achievements", totalAchievements.toString(), Modifier.weight(1f), "since programme start")
        }
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            StatCard("Avg impact score", avgImpact, Modifier.weight(1f), "self-rated / 10")
            StatCard("Updated this month", "$updatedCount/$totalPeople", Modifier.weight(1f), "individuals")
        }

        Spacer(Modifier.height(28.dp))
        Text("CPQSDP impact scores", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
        Spacer(Modifier.height(12.dp))

        Dimension.entries.chunked(2).forEach { rowDims ->
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)) {
                rowDims.forEach { dim ->
                    val withDim = data.achievements.filter { it.cpqsdp.contains(dim.key) }
                    val score = if (withDim.isNotEmpty()) withDim.sumOf { it.impactRating }.toDouble() / withDim.size else null
                    val color = cpqsdpColor(dim.key)
                    CownCard(modifier = Modifier.weight(1f)) {
                        Column {
                            Text(dim.label, fontSize = 12.sp, color = CownColors.Muted)
                            Spacer(Modifier.height(8.dp))
                            Text(score?.let { String.format("%.1f", it) } ?: "—", fontSize = 20.sp, fontWeight = FontWeight.Medium, color = color)
                            if (score != null) {
                                Spacer(Modifier.height(8.dp))
                                Box(modifier = Modifier.fillMaxWidth().height(3.dp).background(CownColors.Border, RoundedCornerShape(2.dp))) {
                                    Box(modifier = Modifier.fillMaxWidth((score / 10.0).toFloat()).height(3.dp).background(color, RoundedCornerShape(2.dp)))
                                }
                            }
                        }
                    }
                }
                if (rowDims.size == 1) Spacer(Modifier.weight(1f))
            }
        }

        Spacer(Modifier.height(16.dp))
        Text("Recent achievements", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
        Spacer(Modifier.height(12.dp))

        val recent = data.achievements.sortedByDescending { isoToMillis(it.date) ?: 0L }.take(5)
        if (recent.isEmpty()) {
            EmptyState("No achievements yet")
        } else {
            recent.forEachIndexed { index, achievement ->
                if (index > 0) Spacer(Modifier.height(12.dp))
                val person = data.people.firstOrNull { it.id == achievement.personId }
                CownCard(modifier = Modifier.fillMaxWidth()) {
                    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.Top) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(achievement.title, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
                            Spacer(Modifier.height(4.dp))
                            Text("By ${person?.name ?: "Unknown"} · ${formatDate(achievement.date)}", fontSize = 12.sp, color = CownColors.Muted)
                        }
                        Box(
                            modifier = Modifier.background(CownColors.SurfaceMuted, RoundedCornerShape(8.dp)).padding(horizontal = 10.dp, vertical = 4.dp),
                        ) {
                            Text("${achievement.impactRating}/10", fontSize = 12.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
                        }
                    }
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}
