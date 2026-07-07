package com.rork.cownit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.cownit.data.AppData
import com.rork.cownit.data.AppState
import com.rork.cownit.data.Dimension
import com.rork.cownit.ui.components.CownCard
import com.rork.cownit.ui.theme.CownColors

private data class CellColor(val bg: Color, val text: Color)

private fun cellColor(score: Double?): CellColor = when {
    score == null -> CellColor(CownColors.SurfaceMuted, CownColors.Faint)
    score >= 8 -> CellColor(Color(0xFFE8F5E9), Color(0xFF2E7D32))
    score >= 6 -> CellColor(Color(0xFFE3F2FD), Color(0xFF1565C0))
    score >= 4 -> CellColor(Color(0xFFFFF3E0), Color(0xFFE65100))
    else -> CellColor(Color(0xFFFFEBEE), Color(0xFFC62828))
}

private fun dimScore(data: AppData, personId: String?, dim: String): Double? {
    val list = data.achievements.filter {
        (personId == null || it.personId == personId) && it.cpqsdp.contains(dim)
    }
    if (list.isEmpty()) return null
    return list.sumOf { it.impactRating }.toDouble() / list.size
}

private const val NAME_COL = 84
private const val CELL = 44

@Composable
fun CeoHeatmapScreen(state: AppState) {
    val data = state.data
    val scroll = rememberScrollState()

    Column(modifier = Modifier.fillMaxWidth()) {
        ScreenHeading("Impact heatmap")
        Spacer(Modifier.height(20.dp))

        CownCard(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.horizontalScroll(scroll)) {
                // Header row
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.width(NAME_COL.dp))
                    Dimension.entries.forEach { dim ->
                        Box(modifier = Modifier.width(CELL.dp), contentAlignment = Alignment.Center) {
                            Text(dim.key, fontSize = 11.sp, fontWeight = FontWeight.Medium, color = CownColors.Muted)
                        }
                    }
                }
                Spacer(Modifier.height(4.dp))

                data.people.forEach { person ->
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(bottom = 4.dp)) {
                        Box(modifier = Modifier.width(NAME_COL.dp)) {
                            Text(person.name.substringBefore(' '), fontSize = 12.sp, color = CownColors.Ink)
                        }
                        Dimension.entries.forEach { dim ->
                            val score = dimScore(data, person.id, dim.key)
                            HeatCell(score, FontWeight.Medium)
                        }
                    }
                }

                Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(CownColors.Border).padding(vertical = 4.dp))
                Spacer(Modifier.height(8.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.width(NAME_COL.dp)) {
                        Text("Org avg", fontSize = 12.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink)
                    }
                    Dimension.entries.forEach { dim ->
                        val score = dimScore(data, null, dim.key)
                        HeatCell(score, FontWeight.Medium)
                    }
                }
            }
        }

        Spacer(Modifier.height(20.dp))
        // Legend
        Column {
            LegendRow(Color(0xFFE8F5E9), "8–10 High")
            Spacer(Modifier.height(8.dp))
            LegendRow(Color(0xFFE3F2FD), "6–7 Good")
            Spacer(Modifier.height(8.dp))
            LegendRow(Color(0xFFFFF3E0), "4–5 Moderate")
            Spacer(Modifier.height(8.dp))
            LegendRow(Color(0xFFFFEBEE), "1–3 Low")
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun HeatCell(score: Double?, weight: FontWeight) {
    val c = cellColor(score)
    Box(
        modifier = Modifier
            .padding(2.dp)
            .size(width = (CELL - 4).dp, height = 30.dp)
            .background(c.bg, RoundedCornerShape(4.dp)),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            score?.let { String.format("%.1f", it) } ?: "—",
            fontSize = 11.sp,
            fontWeight = weight,
            color = c.text,
            textAlign = TextAlign.Center,
        )
    }
}

@Composable
private fun LegendRow(swatch: Color, label: String) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(modifier = Modifier.size(12.dp).background(swatch, RoundedCornerShape(3.dp)))
        Text(label, fontSize = 12.sp, color = CownColors.Muted)
    }
}
