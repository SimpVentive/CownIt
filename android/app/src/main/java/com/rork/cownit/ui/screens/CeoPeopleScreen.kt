package com.rork.cownit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.AppState
import com.rork.cownit.data.computeHealthScore
import com.rork.cownit.data.hasCurrentMonthUpdate
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.components.StatusBadge
import com.rork.cownit.ui.theme.CownColors
import com.rork.cownit.util.formatDate
import com.rork.cownit.util.isoToMillis

@Composable
fun CeoPeopleScreen(state: AppState) {
    val data = state.data

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("People view")
        Spacer(Modifier.height(20.dp))

        data.people.forEach { person ->
            val commitCount = data.commits.count { it.personId == person.id }
            val achievementCount = data.achievements.count { it.personId == person.id }
            val health = computeHealthScore(person.id, data)
            val isUpdated = hasCurrentMonthUpdate(person.id, data)

            val updateTimes = data.monthlyUpdates.filter { it.personId == person.id }.mapNotNull { isoToMillis(it.updatedAt) }
            val achievementTimes = data.achievements.filter { it.personId == person.id }.mapNotNull { isoToMillis(it.date) }
            val lastActive = (updateTimes + achievementTimes).maxOrNull()
            val lastActiveText = if (lastActive == null) "No activity" else formatDate(java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", java.util.Locale.US).apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }.format(java.util.Date(lastActive)))

            CownCard(modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)) {
                Column {
                    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.Top) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(person.name, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
                            Spacer(Modifier.height(4.dp))
                            Text(person.department, fontSize = 12.sp, color = CownColors.Muted)
                        }
                        StatusBadge(
                            text = if (isUpdated) "Current" else "Overdue",
                            background = if (isUpdated) CownColors.PositiveBg else CownColors.NegativeBg,
                            textColor = if (isUpdated) CownColors.Positive else CownColors.Negative,
                        )
                    }
                    Spacer(Modifier.height(12.dp))
                    Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(CownColors.Border))
                    Spacer(Modifier.height(12.dp))
                    Text(
                        "$commitCount commits  •  $achievementCount achievements  •  Health: $health/100",
                        fontSize = 12.sp,
                        color = CownColors.Muted,
                    )
                    Spacer(Modifier.height(4.dp))
                    Text("Last active: $lastActiveText", fontSize = 12.sp, color = CownColors.Muted)
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}
