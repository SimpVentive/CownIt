package com.rork.cownit.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.systemBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.rork.cownit.ui.components.Sidebar
import com.rork.cownit.ui.components.TopBar
import com.rork.cownit.ui.model.Role
import com.rork.cownit.ui.model.navItemsFor
import com.rork.cownit.ui.theme.CownColors

@Composable
fun HomeScreen(navController: NavController) {
    var role by rememberSaveable { mutableStateOf(Role.INDIVIDUAL) }
    var activeSection by rememberSaveable { mutableStateOf(navItemsFor(Role.INDIVIDUAL).first().id) }

    val items = navItemsFor(role)
    // Keep the active section valid when the role (and thus the sidebar) changes.
    val activeItem = items.firstOrNull { it.id == activeSection } ?: items.first()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CownColors.Canvas)
            .windowInsetsPadding(WindowInsets.systemBars)
    ) {
        TopBar(
            activeRole = role,
            onRoleChange = { newRole ->
                role = newRole
                activeSection = navItemsFor(newRole).first().id
            },
        )
        HairlineRow()
        Row(Modifier.fillMaxSize()) {
            Sidebar(
                role = role,
                items = items,
                activeId = activeItem.id,
                onSelect = { activeSection = it },
            )
            VerticalHairline()
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(CownColors.Canvas),
            ) {
                AnimatedContent(
                    targetState = role to activeItem.id,
                    transitionSpec = {
                        (fadeIn(tween(220)) togetherWith fadeOut(tween(140)))
                    },
                    label = "content",
                ) { (currentRole, sectionId) ->
                    DashboardContent(
                        role = currentRole,
                        sectionId = sectionId,
                        sectionLabel = navItemsFor(currentRole).first { it.id == sectionId }.label,
                    )
                }
            }
        }
    }
}

@Composable
private fun HairlineRow() {
    Box(
        Modifier
            .fillMaxWidth()
            .height(0.5.dp)
            .background(CownColors.Border)
    )
}

@Composable
private fun VerticalHairline() {
    Box(
        Modifier
            .fillMaxHeight()
            .width(0.5.dp)
            .background(CownColors.Border)
    )
}
