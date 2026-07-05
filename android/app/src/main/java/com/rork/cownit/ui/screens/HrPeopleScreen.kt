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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.AppState
import com.rork.cownit.data.computeHealthScore
import com.rork.cownit.data.hasCurrentMonthUpdate
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.components.StatusBadge
import com.rork.cownit.ui.theme.CownColors
import com.rork.cownit.util.formatDateShort
import com.rork.cownit.util.isoToMillis

private fun healthColor(score: Int): Color = when {
    score >= 75 -> CownColors.Positive
    score >= 50 -> CownColors.Delivery
    else -> CownColors.Negative
}

@Composable
fun HrPeopleScreen(state: AppState, onSelectPerson: (String) -> Unit) {
    val people = state.data.people
    val updatedCount = people.count { hasCurrentMonthUpdate(it.id, state.data) }
    val avgScore = if (people.isNotEmpty()) people.sumOf { computeHealthScore(it.id, state.data) } / people.size else 0

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("People")
        Spacer(Modifier.height(20.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            StatCard("Total people", people.size.toString(), Modifier.weight(1f))
            StatCardColored("Updated", updatedCount.toString(), CownColors.Positive, Modifier.weight(1f))
        }
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            StatCardColored("Overdue", (people.size - updatedCount).toString(), CownColors.Negative, Modifier.weight(1f))
            StatCard("Avg health score", avgScore.toString(), Modifier.weight(1f))
        }

        Spacer(Modifier.height(24.dp))

        people.forEach { person ->
            val score = computeHealthScore(person.id, state.data)
            val hasUpdate = hasCurrentMonthUpdate(person.id, state.data)
            val lastUpdate = state.data.monthlyUpdates
                .filter { it.personId == person.id }
                .maxByOrNull { isoToMillis(it.updatedAt) ?: 0L }

            CownCard(modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)) {
                Column {
                    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.Top) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(person.name, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
                            Spacer(Modifier.height(4.dp))
                            Text(person.department, fontSize = 12.sp, color = CownColors.Muted)
                        }
                        StatusBadge(
                            text = if (hasUpdate) "Current" else "Overdue",
                            background = if (hasUpdate) CownColors.PositiveBg else CownColors.NegativeBg,
                            textColor = if (hasUpdate) CownColors.Positive else CownColors.Negative,
                        )
                    }
                    Spacer(Modifier.height(12.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Health: $score/100", fontSize = 12.sp, color = CownColors.Muted)
                        Spacer(Modifier.width(10.dp))
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(4.dp)
                                .background(CownColors.Border, RoundedCornerShape(2.dp)),
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth(score / 100f)
                                    .height(4.dp)
                                    .background(healthColor(score), RoundedCornerShape(2.dp)),
                            )
                        }
                    }
                    Spacer(Modifier.height(12.dp))
                    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            "Last update: ${if (lastUpdate != null) formatDateShort(lastUpdate.updatedAt) else "Never"}",
                            fontSize = 12.sp,
                            color = CownColors.Muted,
                            modifier = Modifier.weight(1f),
                        )
                        Button(
                            onClick = { onSelectPerson(person.id) },
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = CownColors.Active, contentColor = CownColors.OnActive),
                        ) {
                            Text("View", fontSize = 12.sp)
                        }
                    }
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
fun StatCardColored(label: String, value: String, valueColor: Color, modifier: Modifier = Modifier) {
    CownCard(modifier = modifier) {
        Column {
            Text(label, fontSize = 12.sp, color = CownColors.Muted)
            Spacer(Modifier.height(8.dp))
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Medium, color = valueColor)
        }
    }
}
