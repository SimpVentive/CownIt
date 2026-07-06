package com.rork.cownit.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.AppState
import com.rork.cownit.data.Message
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.components.clickableNoRipple
import com.rork.cownit.ui.components.disabledFieldColors
import com.rork.cownit.ui.components.fieldColors
import com.rork.cownit.ui.theme.CownColors
import com.rork.cownit.util.formatDate
import com.rork.cownit.util.isoToMillis
import com.rork.cownit.util.nowIso

@Composable
fun CeoMessageScreen(
    state: AppState,
    onSend: (Message) -> Unit,
) {
    val people = state.data.people
    var recipientId by remember { mutableStateOf(people.firstOrNull()?.id ?: "") }
    var body by remember { mutableStateOf("") }
    var sent by remember { mutableStateOf(false) }
    var menuOpen by remember { mutableStateOf(false) }

    val recipient = people.firstOrNull { it.id == recipientId }
    val canSend = body.trim().length >= 5

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("Send message")
        Spacer(Modifier.height(20.dp))

        CownCard(modifier = Modifier.fillMaxWidth()) {
            Column {
                Label("To")
                Spacer(Modifier.height(8.dp))
                Box(modifier = Modifier.fillMaxWidth()) {
                    OutlinedTextField(
                        value = recipient?.let { "${it.name} — ${it.department}" } ?: "",
                        onValueChange = {},
                        readOnly = true,
                        enabled = false,
                        trailingIcon = { Icon(Icons.Outlined.ExpandMore, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth().clickableNoRipple { menuOpen = true },
                        shape = RoundedCornerShape(8.dp),
                        colors = disabledFieldColors(),
                    )
                    DropdownMenu(expanded = menuOpen, onDismissRequest = { menuOpen = false }) {
                        people.forEach { person ->
                            DropdownMenuItem(
                                text = { Text("${person.name} — ${person.department}", fontSize = 13.sp) },
                                onClick = { recipientId = person.id; menuOpen = false },
                            )
                        }
                    }
                }

                Spacer(Modifier.height(20.dp))
                Label("Message")
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = body,
                    onValueChange = { body = it; sent = false },
                    placeholder = { Text("Your message...", fontSize = 13.sp, color = CownColors.Faint) },
                    modifier = Modifier.fillMaxWidth().heightIn(min = 110.dp),
                    shape = RoundedCornerShape(8.dp),
                    colors = fieldColors(),
                )

                Spacer(Modifier.height(16.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Button(
                        onClick = {
                            if (canSend) {
                                onSend(
                                    Message(
                                        id = "msg" + System.currentTimeMillis(),
                                        fromRole = "ceo",
                                        fromName = "CEO",
                                        toPersonId = recipientId,
                                        body = body.trim(),
                                        date = nowIso(),
                                        read = false,
                                    )
                                )
                                body = ""
                                sent = true
                            }
                        },
                        enabled = canSend,
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = CownColors.Active,
                            contentColor = CownColors.OnActive,
                            disabledContainerColor = CownColors.Border,
                            disabledContentColor = CownColors.White,
                        ),
                    ) {
                        Text("Send", fontSize = 13.sp)
                    }
                    if (sent) {
                        Spacer(Modifier.height(0.dp))
                        Text("  Message sent", fontSize = 13.sp, color = CownColors.Positive)
                    }
                }
            }
        }

        val ceoMessages = state.data.messages
            .filter { it.fromRole == "ceo" }
            .sortedByDescending { isoToMillis(it.date) ?: 0L }

        if (ceoMessages.isNotEmpty()) {
            Spacer(Modifier.height(28.dp))
            Text("Sent messages", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
            Spacer(Modifier.height(12.dp))
            ceoMessages.forEachIndexed { index, message ->
                if (index > 0) Spacer(Modifier.height(12.dp))
                val toPerson = people.firstOrNull { it.id == message.toPersonId }
                CownCard(modifier = Modifier.fillMaxWidth()) {
                    Column {
                        Text(
                            "To: ${toPerson?.name ?: "Unknown"}${toPerson?.let { " — ${it.department}" } ?: ""}",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = CownColors.InkSoft,
                        )
                        Spacer(Modifier.height(8.dp))
                        Text(message.body, fontSize = 13.sp, color = CownColors.InkSoft, lineHeight = 20.sp)
                        Spacer(Modifier.height(8.dp))
                        Text(formatDate(message.date), fontSize = 12.sp, color = CownColors.Faint)
                    }
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}
