package com.rork.cownit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.AppState
import com.rork.cownit.data.CommitLevel
import com.rork.cownit.data.HrComment
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.components.fieldColors
import com.rork.cownit.ui.theme.CownColors
import com.rork.cownit.util.formatDate
import com.rork.cownit.util.isoToMillis
import com.rork.cownit.util.nowIso

private data class LvlStyle(val bg: Color, val text: Color)

private fun lvlStyle(level: CommitLevel): LvlStyle = when (level) {
    CommitLevel.SELF -> LvlStyle(CownColors.SelfBg, CownColors.SelfText)
    CommitLevel.TEAM -> LvlStyle(CownColors.TeamBg, CownColors.TeamText)
    CommitLevel.ORG -> LvlStyle(CownColors.OrgBg, CownColors.OrgText)
}

@Composable
fun HrDrilldownScreen(
    state: AppState,
    onAddComment: (HrComment) -> Unit,
) {
    val personId = state.selectedPersonId
    if (personId == null) {
        Column(modifier = Modifier.fillMaxWidth()) {
            ScreenHeading("Individual view")
            Spacer(Modifier.height(20.dp))
            EmptyState("Select a person from the People list to view details")
        }
        return
    }

    val person = state.data.people.first { it.id == personId }
    val personCommits = state.data.commits.filter { it.personId == personId }
    val achievements = state.data.achievements
        .filter { it.personId == personId }
        .sortedByDescending { isoToMillis(it.date) ?: 0L }

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading(person.name)
        Spacer(Modifier.height(20.dp))

        Text("Commitments", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
        Spacer(Modifier.height(12.dp))
        CommitLevel.entries.forEach { level ->
            val style = lvlStyle(level)
            val levelCommits = personCommits.filter { it.level == level.id }
            Text(
                level.label,
                color = style.text,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth().background(style.bg, RoundedCornerShape(12.dp)).padding(vertical = 12.dp),
            )
            Spacer(Modifier.height(10.dp))
            CownCard(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.fillMaxWidth().heightIn(min = 40.dp)) {
                    if (levelCommits.isEmpty()) {
                        Text("None", fontSize = 12.sp, color = CownColors.Faint)
                    } else {
                        levelCommits.forEach { commit ->
                            Text("• ${commit.statement}", fontSize = 12.sp, color = CownColors.InkSoft, lineHeight = 18.sp, modifier = Modifier.padding(bottom = 6.dp))
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
        }

        Spacer(Modifier.height(8.dp))
        Text("Achievements", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
        Spacer(Modifier.height(12.dp))

        if (achievements.isEmpty()) {
            EmptyState("No achievements logged yet")
        } else {
            achievements.forEachIndexed { index, achievement ->
                if (index > 0) Spacer(Modifier.height(16.dp))
                val comments = state.data.hrComments.filter { it.achievementId == achievement.id }
                var draft by remember(achievement.id) { mutableStateOf("") }

                CownCard(modifier = Modifier.fillMaxWidth()) {
                    Column {
                        Text(achievement.title, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
                        Spacer(Modifier.height(8.dp))
                        Row {
                            Text(formatDate(achievement.date), fontSize = 12.sp, color = CownColors.Muted)
                            Text("  •  ", fontSize = 12.sp, color = CownColors.Faint)
                            Text("Impact: ${achievement.impactRating}/10", fontSize = 12.sp, color = CownColors.Muted)
                        }
                        Spacer(Modifier.height(8.dp))
                        Text(achievement.evidence, fontSize = 12.sp, color = CownColors.Muted, lineHeight = 18.sp)

                        if (comments.isNotEmpty()) {
                            Spacer(Modifier.height(12.dp))
                            Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(CownColors.Border))
                            Spacer(Modifier.height(12.dp))
                            comments.forEachIndexed { i, comment ->
                                if (i > 0) Spacer(Modifier.height(8.dp))
                                HrCommentBlock(comment.body, comment.authorName, comment.date)
                            }
                        }

                        Spacer(Modifier.height(12.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            OutlinedTextField(
                                value = draft,
                                onValueChange = { draft = it },
                                placeholder = { Text("Add a comment...", fontSize = 12.sp, color = CownColors.Faint) },
                                singleLine = true,
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(8.dp),
                                colors = fieldColors(),
                            )
                            Spacer(Modifier.width(8.dp))
                            Button(
                                onClick = {
                                    if (draft.isNotBlank()) {
                                        onAddComment(
                                            HrComment(
                                                id = "hrc" + System.currentTimeMillis(),
                                                achievementId = achievement.id,
                                                authorName = "HR",
                                                body = draft.trim(),
                                                date = nowIso(),
                                            )
                                        )
                                        draft = ""
                                    }
                                },
                                enabled = draft.isNotBlank(),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = CownColors.Active,
                                    contentColor = CownColors.OnActive,
                                    disabledContainerColor = CownColors.Border,
                                    disabledContentColor = CownColors.White,
                                ),
                            ) {
                                Text("Post", fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}
