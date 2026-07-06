package com.rork.cownit.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.AppState
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.theme.CownColors
import com.rork.cownit.util.formatDate
import com.rork.cownit.util.isoToMillis

@Composable
fun MessagesScreen(state: AppState) {
    val messages = state.data.messages
        .filter { it.toPersonId == state.currentUserId }
        .sortedByDescending { isoToMillis(it.date) ?: 0L }

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("Messages")
        Spacer(Modifier.height(20.dp))

        if (messages.isEmpty()) {
            EmptyState("No messages yet")
        } else {
            messages.forEachIndexed { index, message ->
                if (index > 0) Spacer(Modifier.height(12.dp))
                CownCard(modifier = Modifier.fillMaxWidth()) {
                    Column {
                        Text(
                            "From: ${message.fromName} (${message.fromRole.uppercase()})",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = CownColors.Ink,
                        )
                        Spacer(Modifier.height(8.dp))
                        Text(message.body, fontSize = 13.sp, color = CownColors.InkSoft, lineHeight = 20.sp)
                        Spacer(Modifier.height(12.dp))
                        Text(
                            formatDate(message.date) + if (message.read) " · Read" else "",
                            fontSize = 12.sp,
                            color = CownColors.Faint,
                        )
                    }
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}
