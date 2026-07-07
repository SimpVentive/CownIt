package com.rork.cownit.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ExpandMore
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.Achievement
import com.rork.cownit.data.AppState
import com.rork.cownit.data.CommitLevel
import com.rork.cownit.data.Dimension
import com.rork.cownit.ui.components.SegmentButton
import com.rork.cownit.ui.components.clickableNoRipple
import com.rork.cownit.ui.components.disabledFieldColors
import com.rork.cownit.ui.components.fieldColors
import com.rork.cownit.ui.theme.CownColors
import com.rork.cownit.ui.theme.cpqsdpColor
import com.rork.cownit.util.nowIso

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun LogAchievementScreen(
    state: AppState,
    onSave: (Achievement) -> Unit,
) {
    var title by remember { mutableStateOf("") }
    var selectedLevel by remember { mutableStateOf<CommitLevel?>(null) }
    var selectedCommitId by remember { mutableStateOf<String?>(null) }
    var evidence by remember { mutableStateOf("") }
    var selectedDims by remember { mutableStateOf<List<String>>(emptyList()) }
    var rating by remember { mutableStateOf<Int?>(null) }
    var errors by remember { mutableStateOf<Map<String, String>>(emptyMap()) }
    var commitMenuOpen by remember { mutableStateOf(false) }

    val userCommits = state.data.commits.filter { it.personId == state.currentUserId }
    val levelCommits = selectedLevel?.let { lvl -> userCommits.filter { it.level == lvl.id } } ?: emptyList()
    val selectedCommit = levelCommits.firstOrNull { it.id == selectedCommitId }

    fun validate(): Boolean {
        val e = mutableMapOf<String, String>()
        if (title.isBlank()) e["title"] = "Title is required"
        if (selectedLevel == null) e["level"] = "Select a commitment level"
        if (selectedCommitId == null) e["commit"] = "Select a commit"
        if (evidence.isBlank()) e["evidence"] = "Evidence is required"
        if (selectedDims.isEmpty()) e["dims"] = "Select at least one dimension"
        if (rating == null) e["rating"] = "Select an impact rating"
        errors = e
        return e.isEmpty()
    }

    fun save() {
        if (!validate()) return
        onSave(
            Achievement(
                id = "a" + System.currentTimeMillis(),
                personId = state.currentUserId ?: "",
                commitId = selectedCommitId ?: "",
                title = title.trim(),
                evidence = evidence.trim(),
                cpqsdp = selectedDims,
                impactRating = rating ?: 0,
                date = nowIso(),
                fileAttachment = null,
            )
        )
        title = ""; selectedLevel = null; selectedCommitId = null; evidence = ""
        selectedDims = emptyList(); rating = null; errors = emptyMap()
    }

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("Log achievement")
        Spacer(Modifier.height(20.dp))

        // Title
        Label("What did you achieve?")
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = title,
            onValueChange = { title = it },
            placeholder = { Text("Brief title", fontSize = 13.sp, color = CownColors.Faint) },
            singleLine = true,
            isError = errors.containsKey("title"),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            colors = fieldColors(),
        )
        FieldError(errors["title"])
        Spacer(Modifier.height(20.dp))

        // Level
        Label("Commitment level")
        Spacer(Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
            CommitLevel.entries.forEach { level ->
                SegmentButton(
                    label = level.label,
                    selected = selectedLevel == level,
                    modifier = Modifier.weight(1f),
                    onClick = { selectedLevel = level; selectedCommitId = null },
                )
            }
        }
        FieldError(errors["level"])

        // Commit dropdown
        if (selectedLevel != null) {
            Spacer(Modifier.height(20.dp))
            Label("Select a commit")
            Spacer(Modifier.height(8.dp))
            Box(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = selectedCommit?.statement ?: "Choose a commit...",
                    onValueChange = {},
                    readOnly = true,
                    enabled = false,
                    maxLines = 2,
                    trailingIcon = { Icon(Icons.Outlined.ExpandMore, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth().clickableNoRipple { commitMenuOpen = true },
                    shape = RoundedCornerShape(8.dp),
                    colors = disabledFieldColors(),
                )
                DropdownMenu(expanded = commitMenuOpen, onDismissRequest = { commitMenuOpen = false }) {
                    if (levelCommits.isEmpty()) {
                        DropdownMenuItem(text = { Text("No commits at this level", fontSize = 13.sp, color = CownColors.Faint) }, onClick = { commitMenuOpen = false })
                    }
                    levelCommits.forEach { commit ->
                        DropdownMenuItem(
                            text = { Text(commit.statement, fontSize = 13.sp) },
                            onClick = { selectedCommitId = commit.id; commitMenuOpen = false },
                        )
                    }
                }
            }
            FieldError(errors["commit"])
        }

        Spacer(Modifier.height(20.dp))
        // Evidence
        Label("Evidence / notes")
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = evidence,
            onValueChange = { evidence = it },
            placeholder = { Text("What happened, when, who was involved, outcome...", fontSize = 13.sp, color = CownColors.Faint) },
            isError = errors.containsKey("evidence"),
            modifier = Modifier.fillMaxWidth().heightIn(min = 96.dp),
            shape = RoundedCornerShape(8.dp),
            colors = fieldColors(),
        )
        FieldError(errors["evidence"])
        Spacer(Modifier.height(20.dp))

        // Dimensions
        Label("Impact dimensions")
        Spacer(Modifier.height(8.dp))
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Dimension.entries.forEach { dim ->
                val active = selectedDims.contains(dim.key)
                val color = cpqsdpColor(dim.key)
                DimChip(
                    label = "${dim.key} — ${dim.label}",
                    active = active,
                    color = color,
                    onClick = {
                        selectedDims = if (active) selectedDims - dim.key else selectedDims + dim.key
                    },
                )
            }
        }
        FieldError(errors["dims"])
        Spacer(Modifier.height(20.dp))

        // Rating
        Label("Impact rating")
        Spacer(Modifier.height(8.dp))
        FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            (1..10).forEach { num ->
                val active = rating == num
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .background(if (active) CownColors.Active else CownColors.SurfaceMuted, RoundedCornerShape(8.dp))
                        .border(0.5.dp, if (active) CownColors.Active else CownColors.Border, RoundedCornerShape(8.dp))
                        .clickableNoRipple { rating = num },
                    contentAlignment = Alignment.Center,
                ) {
                    Text("$num", fontSize = 12.sp, color = if (active) CownColors.OnActive else CownColors.Ink)
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        Text(
            "1–3 Minor · 4–6 Moderate · 7–8 Significant · 9–10 Transformational",
            fontSize = 12.sp,
            color = CownColors.Faint,
        )
        FieldError(errors["rating"])
        Spacer(Modifier.height(24.dp))

        Button(
            onClick = { save() },
            modifier = Modifier.fillMaxWidth().height(46.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(containerColor = CownColors.Active, contentColor = CownColors.OnActive),
        ) {
            Text("Save achievement", fontSize = 13.sp, fontWeight = FontWeight.Medium)
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun DimChip(label: String, active: Boolean, color: Color, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .background(if (active) color else CownColors.SurfaceMuted, RoundedCornerShape(8.dp))
            .border(0.5.dp, if (active) color else CownColors.Border, RoundedCornerShape(8.dp))
            .clickableNoRipple(onClick)
            .padding(horizontal = 12.dp, vertical = 8.dp),
    ) {
        Text(label, fontSize = 12.sp, color = if (active) Color.White else CownColors.Ink)
    }
}

@Composable
fun Label(text: String) {
    Text(text, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
}

@Composable
fun FieldError(error: String?) {
    if (error != null) {
        Spacer(Modifier.height(4.dp))
        Text(error, color = CownColors.Negative, fontSize = 12.sp)
    }
}
