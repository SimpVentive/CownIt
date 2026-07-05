package com.rork.cownit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.AppState
import com.rork.cownit.data.Commit
import com.rork.cownit.data.CommitLevel
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.theme.CownColors
import java.util.UUID

private data class LevelStyle(val bg: Color, val text: Color)

private fun levelStyle(level: CommitLevel): LevelStyle = when (level) {
    CommitLevel.SELF -> LevelStyle(CownColors.SelfBg, CownColors.SelfText)
    CommitLevel.TEAM -> LevelStyle(CownColors.TeamBg, CownColors.TeamText)
    CommitLevel.ORG -> LevelStyle(CownColors.OrgBg, CownColors.OrgText)
}

@Composable
fun MyCommitsScreen(
    state: AppState,
    onAddCommit: (Commit) -> Unit = {},
) {
    val userId = state.currentUserId ?: return
    val userCommits = state.data.commits.filter { it.personId == userId }
    var addingLevel by remember { mutableStateOf<CommitLevel?>(null) }
    var statement by remember { mutableStateOf("") }

    fun startAdd(level: CommitLevel) {
        statement = ""
        addingLevel = level
    }

    fun cancelAdd() {
        statement = ""
        addingLevel = null
    }

    fun saveCommit(level: CommitLevel) {
        val trimmed = statement.trim()
        if (trimmed.isEmpty()) return
        val levelCommits = userCommits.filter { it.level == level.id }
        if (levelCommits.size >= 3) return

        onAddCommit(
            Commit(
                id = UUID.randomUUID().toString(),
                personId = userId,
                level = level.id,
                statement = trimmed,
                createdAt = java.time.Instant.now().toString(),
            ),
        )
        cancelAdd()
    }

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("My commitments")
        Spacer(Modifier.height(20.dp))

        CommitLevel.entries.forEach { level ->
            val style = levelStyle(level)
            val levelCommits = userCommits.filter { it.level == level.id }
            val isAdding = addingLevel == level
            val canAdd = levelCommits.size < 3

            Text(
                text = level.label,
                color = style.text,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .background(style.bg, RoundedCornerShape(12.dp))
                    .padding(vertical = 12.dp, horizontal = 16.dp),
            )
            Spacer(Modifier.height(10.dp))
            CownCard(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.fillMaxWidth().heightIn(min = 64.dp)) {
                    if (levelCommits.isNotEmpty()) {
                        levelCommits.forEachIndexed { index, commit ->
                            if (index > 0) Spacer(Modifier.height(8.dp))
                            Box1(commit.statement)
                        }
                    } else {
                        Text(
                            "No commitments yet",
                            color = CownColors.Faint,
                            fontSize = 13.sp,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp),
                        )
                    }

                    if (isAdding) {
                        Spacer(Modifier.height(12.dp))
                        OutlinedTextField(
                            value = statement,
                            onValueChange = { statement = it },
                            label = { Text("Enter commitment statement", fontSize = 12.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 13.sp),
                            singleLine = false,
                            maxLines = 3,
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                            keyboardActions = KeyboardActions(onDone = { saveCommit(level) }),
                            shape = RoundedCornerShape(8.dp),
                        )
                        Spacer(Modifier.height(8.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = { saveCommit(level) },
                                modifier = Modifier.weight(1f).height(40.dp),
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = CownColors.LoginNavy,
                                    contentColor = CownColors.White,
                                ),
                                enabled = statement.trim().isNotEmpty(),
                            ) {
                                Text("Save", fontSize = 13.sp)
                            }
                            Button(
                                onClick = ::cancelAdd,
                                modifier = Modifier.weight(1f).height(40.dp),
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = CownColors.SurfaceMuted,
                                    contentColor = CownColors.Ink,
                                ),
                            ) {
                                Text("Cancel", fontSize = 13.sp)
                            }
                        }
                    } else if (canAdd) {
                        Spacer(Modifier.height(12.dp))
                        TextButton(
                            onClick = { startAdd(level) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(40.dp)
                                .border(1.dp, CownColors.Border, RoundedCornerShape(8.dp)),
                            colors = ButtonDefaults.textButtonColors(contentColor = CownColors.Muted),
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.padding(end = 4.dp))
                                Text("Add commitment", fontSize = 13.sp)
                            }
                        }
                    }
                }
            }
            Spacer(Modifier.height(20.dp))
        }

        CownCard(modifier = Modifier.fillMaxWidth()) {
            Column {
                Text("About commitments", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CownColors.InkSoft)
                Spacer(Modifier.height(8.dp))
                Text(
                    "You can set up to 3 commitments per level. Log achievements against any commitment at any time. There is no deadline — commitments are open-ended and accumulate over time.",
                    fontSize = 13.sp,
                    color = CownColors.Muted,
                    lineHeight = 20.sp,
                )
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun Box1(text: String) {
    Text(
        text = text,
        fontSize = 12.sp,
        color = CownColors.InkSoft,
        lineHeight = 18.sp,
        modifier = Modifier
            .fillMaxWidth()
            .background(CownColors.SurfaceMuted, RoundedCornerShape(8.dp))
            .padding(10.dp),
    )
}

@Composable
fun ScreenHeading(text: String) {
    Text(text, fontSize = 18.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
}
