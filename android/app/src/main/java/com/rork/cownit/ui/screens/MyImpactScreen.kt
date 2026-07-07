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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.Achievement
import com.rork.cownit.data.AppState
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.theme.CownColors
import com.rork.cownit.ui.theme.cpqsdpColor
import com.rork.cownit.util.formatDate
import com.rork.cownit.util.isoToMillis

@Composable
fun MyImpactScreen(state: AppState) {
    val achievements = state.data.achievements
        .filter { it.personId == state.currentUserId }
        .sortedByDescending { isoToMillis(it.date) ?: 0L }

    val avgRating = if (achievements.isNotEmpty()) {
        String.format("%.1f", achievements.sumOf { it.impactRating }.toDouble() / achievements.size)
    } else "—"
    val dimsCovered = achievements.flatMap { it.cpqsdp }.toSet().size

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("My impact")
        Spacer(Modifier.height(20.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            StatCard("Achievements logged", achievements.size.toString(), Modifier.weight(1f))
            StatCard("Avg impact rating", avgRating, Modifier.weight(1f))
            StatCard("Dimensions covered", "$dimsCovered/6", Modifier.weight(1f))
        }

        Spacer(Modifier.height(28.dp))
        Text("Achievements", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
        Spacer(Modifier.height(12.dp))

        if (achievements.isEmpty()) {
            EmptyState("No achievements logged yet")
        } else {
            achievements.forEachIndexed { index, achievement ->
                if (index > 0) Spacer(Modifier.height(12.dp))
                AchievementCard(achievement, state)
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun AchievementCard(achievement: Achievement, state: AppState) {
    val comments = state.data.hrComments.filter { it.achievementId == achievement.id }
    CownCard(modifier = Modifier.fillMaxWidth()) {
        Column {
            Text(achievement.title, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                Text(formatDate(achievement.date), fontSize = 12.sp, color = CownColors.Muted)
                Text("  •  ", fontSize = 12.sp, color = CownColors.Faint)
                achievement.cpqsdp.forEach { dim ->
                    Box(modifier = Modifier.size(6.dp).background(cpqsdpColor(dim), CircleShape))
                    Spacer(Modifier.width(4.dp))
                }
                Text(achievement.cpqsdp.joinToString(", "), fontSize = 12.sp, color = CownColors.Muted)
                Text("  •  ", fontSize = 12.sp, color = CownColors.Faint)
                Text("Impact: ${achievement.impactRating}/10", fontSize = 12.sp, color = CownColors.Muted)
            }
            Spacer(Modifier.height(8.dp))
            Text(achievement.evidence, fontSize = 12.sp, color = CownColors.Muted, lineHeight = 18.sp)
            achievement.fileAttachment?.let {
                Spacer(Modifier.height(8.dp))
                Text("Attachment: $it", fontSize = 12.sp, color = CownColors.Faint)
            }
            if (comments.isNotEmpty()) {
                Spacer(Modifier.height(12.dp))
                Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(CownColors.Border))
                Spacer(Modifier.height(12.dp))
                comments.forEachIndexed { i, comment ->
                    if (i > 0) Spacer(Modifier.height(8.dp))
                    HrCommentBlock(comment.body, comment.authorName, comment.date)
                }
            }
        }
    }
}

@Composable
fun HrCommentBlock(body: String, author: String, date: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(CownColors.SurfaceMuted, androidx.compose.foundation.shape.RoundedCornerShape(8.dp))
            .padding(12.dp),
    ) {
        Text("HR comment", fontSize = 12.sp, fontWeight = FontWeight.Medium, color = CownColors.InkSoft)
        Spacer(Modifier.height(4.dp))
        Text(body, fontSize = 12.sp, color = CownColors.Muted, lineHeight = 18.sp)
        Spacer(Modifier.height(4.dp))
        Text("$author · ${formatDate(date)}", fontSize = 11.sp, color = CownColors.Faint)
    }
}

@Composable
fun StatCard(label: String, value: String, modifier: Modifier = Modifier, sub: String? = null) {
    CownCard(modifier = modifier) {
        Column {
            Text(label, fontSize = 12.sp, color = CownColors.Muted)
            Spacer(Modifier.height(8.dp))
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
            if (sub != null) {
                Spacer(Modifier.height(4.dp))
                Text(sub, fontSize = 11.sp, color = CownColors.Faint)
            }
        }
    }
}

@Composable
fun EmptyState(text: String) {
    CownCard(modifier = Modifier.fillMaxWidth()) {
        Text(
            text,
            fontSize = 13.sp,
            color = CownColors.Faint,
            modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp),
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
        )
    }
}
