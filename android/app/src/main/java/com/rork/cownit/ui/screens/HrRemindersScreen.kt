package com.rork.cownit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.AppState
import com.rork.cownit.data.Message
import com.rork.cownit.data.hasCurrentMonthUpdate
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.theme.CownColors
import com.rork.cownit.util.formatDateShort
import com.rork.cownit.util.isoToMillis
import com.rork.cownit.util.nowIso

private const val REMINDER_BODY =
    "Your monthly commit update is overdue. Please log your progress and at least one achievement before end of this month."

@Composable
fun HrRemindersScreen(
    state: AppState,
    onSendReminders: (List<Message>) -> Unit,
) {
    var sentIds by remember { mutableStateOf<Set<String>>(emptySet()) }
    val overdue = state.data.people.filter { !hasCurrentMonthUpdate(it.id, state.data) }

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("Reminders")
        Spacer(Modifier.height(20.dp))

        if (overdue.isEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CownColors.PositiveBg, RoundedCornerShape(12.dp))
                    .padding(16.dp),
            ) {
                Text("All individuals are up to date for this month.", fontSize = 13.sp, color = CownColors.Positive)
            }
            Spacer(Modifier.height(24.dp))
            return@Column
        }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(CownColors.CautionBg, RoundedCornerShape(12.dp))
                .padding(horizontal = 16.dp, vertical = 12.dp),
        ) {
            Text("${overdue.size} people overdue for this month's update", fontSize = 13.sp, color = CownColors.Caution)
        }
        Spacer(Modifier.height(20.dp))

        overdue.forEach { person ->
            val lastUpdate = state.data.monthlyUpdates
                .filter { it.personId == person.id }
                .maxByOrNull { isoToMillis(it.updatedAt) ?: 0L }
            val sent = sentIds.contains(person.id)

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
                    .background(CownColors.CautionBg, RoundedCornerShape(12.dp))
                    .border(0.5.dp, CownColors.Border, RoundedCornerShape(12.dp))
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(person.name, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "${person.department} · Last updated ${if (lastUpdate != null) formatDateShort(lastUpdate.updatedAt) else "Never"}",
                        fontSize = 12.sp,
                        color = CownColors.Muted,
                    )
                }
                if (sent) {
                    Text("Sent", fontSize = 13.sp, color = CownColors.Positive)
                } else {
                    Button(
                        onClick = {
                            onSendReminders(listOf(reminderFor(person.id)))
                            sentIds = sentIds + person.id
                        },
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = CownColors.Delivery, contentColor = CownColors.White),
                    ) {
                        Text("Send reminder", fontSize = 12.sp)
                    }
                }
            }
        }

        Spacer(Modifier.height(20.dp))
        CownCard(modifier = Modifier.fillMaxWidth()) {
            Column {
                Text("Send to all overdue", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
                Spacer(Modifier.height(8.dp))
                Text(
                    "Send a reminder message to all ${overdue.size} overdue individuals at once.",
                    fontSize = 12.sp,
                    color = CownColors.Muted,
                )
                Spacer(Modifier.height(12.dp))
                val allSent = sentIds.containsAll(overdue.map { it.id })
                Button(
                    onClick = {
                        val toSend = overdue.filter { !sentIds.contains(it.id) }.map { reminderFor(it.id) }
                        if (toSend.isNotEmpty()) onSendReminders(toSend)
                        sentIds = sentIds + overdue.map { it.id }
                    },
                    enabled = !allSent,
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CownColors.Active,
                        contentColor = CownColors.OnActive,
                        disabledContainerColor = CownColors.Border,
                        disabledContentColor = CownColors.White,
                    ),
                ) {
                    Text("Send to all", fontSize = 13.sp)
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

private fun reminderFor(personId: String): Message = Message(
    id = "msg" + System.currentTimeMillis() + personId,
    fromRole = "hr",
    fromName = "HR",
    toPersonId = personId,
    body = REMINDER_BODY,
    date = nowIso(),
    read = false,
)
