package com.rork.cownit.ui.navigation

<<<<<<< HEAD
import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.rork.cownit.ui.screens.HomeScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        composable("home") {
            HomeScreen(navController = navController)
        }
    }
}
=======
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.rork.cownit.AppViewModel
import com.rork.cownit.data.Role
import com.rork.cownit.ui.screens.AuthScreen
import com.rork.cownit.ui.screens.CeoDashboardScreen
import com.rork.cownit.ui.screens.CeoHeatmapScreen
import com.rork.cownit.ui.screens.CeoMessageScreen
import com.rork.cownit.ui.screens.CeoPeopleScreen
import com.rork.cownit.ui.screens.HrDrilldownScreen
import com.rork.cownit.ui.screens.HrPeopleScreen
import com.rork.cownit.ui.screens.HrRemindersScreen
import com.rork.cownit.ui.screens.LogAchievementScreen
import com.rork.cownit.ui.screens.MessagesScreen
import com.rork.cownit.ui.screens.MyCommitsScreen
import com.rork.cownit.ui.screens.MyImpactScreen
import com.rork.cownit.ui.theme.CownColors

@Composable
fun AppNavigation(viewModel: AppViewModel = viewModel()) {
    val state by viewModel.state.collectAsState()

    if (!state.isAuthenticated) {
        AuthScreen(onLogin = viewModel::login)
        return
    }

    val role = state.activeRole ?: Role.INDIVIDUAL
    val items = navItemsFor(role)
    val currentUser = state.data.people.firstOrNull { it.id == state.currentUserId }

    Scaffold(
        containerColor = CownColors.White,
        topBar = {
            CownTopBar(
                activeRole = role,
                userName = currentUser?.name,
                canSwitchRole = viewModel.canSwitchRole,
                onRoleChange = viewModel::changeRole,
                onLogout = viewModel::logout,
            )
        },
        bottomBar = {
            NavigationBar(containerColor = CownColors.White, tonalElevation = 0.dp) {
                items.forEach { item ->
                    val selected = state.activePage == item.page
                    NavigationBarItem(
                        selected = selected,
                        onClick = { viewModel.changePage(item.page) },
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label, fontSize = 11.sp, fontWeight = FontWeight.Medium) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = CownColors.Active,
                            selectedTextColor = CownColors.Active,
                            unselectedIconColor = CownColors.Faint,
                            unselectedTextColor = CownColors.Faint,
                            indicatorColor = CownColors.SurfaceMuted,
                        ),
                    )
                }
            }
        },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 16.dp),
        ) {
            when (role) {
                Role.INDIVIDUAL -> when (state.activePage) {
                    "my-commits" -> MyCommitsScreen(state, onAddCommit = viewModel::addCommit)
                    "log-achievement" -> LogAchievementScreen(state, onSave = viewModel::addAchievement)
                    "my-impact" -> MyImpactScreen(state)
                    "messages" -> MessagesScreen(state)
                }
                Role.HR -> when (state.activePage) {
                    "people" -> HrPeopleScreen(state, onSelectPerson = { id ->
                        viewModel.selectPerson(id)
                        viewModel.changePage("drilldown")
                    })
                    "drilldown" -> HrDrilldownScreen(state, onAddComment = viewModel::addHrComment)
                    "reminders" -> HrRemindersScreen(state, onSendReminders = viewModel::addMessages)
                }
                Role.CEO -> when (state.activePage) {
                    "dashboard" -> CeoDashboardScreen(state)
                    "people" -> CeoPeopleScreen(state)
                    "heatmap" -> CeoHeatmapScreen(state)
                    "message" -> CeoMessageScreen(state, onSend = viewModel::addMessage)
                }
            }
        }
    }
}

@Composable
private fun CownTopBar(
    activeRole: Role,
    userName: String?,
    canSwitchRole: Boolean,
    onRoleChange: (Role) -> Unit,
    onLogout: () -> Unit,
) {
    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("CownIt", fontSize = 18.sp, fontWeight = FontWeight.Medium, color = CownColors.Ink, modifier = Modifier.weight(1f))
            if (userName != null) {
                Text(userName, fontSize = 12.sp, color = CownColors.Muted)
                Spacer(Modifier.height(0.dp))
                TextButton(onClick = onLogout) {
                    Text("Logout", fontSize = 12.sp, color = CownColors.Negative)
                }
            }
        }
        if (canSwitchRole) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp).padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Role.entries.forEach { role ->
                    val selected = activeRole == role
                    Button(
                        onClick = { onRoleChange(role) },
                        modifier = Modifier.weight(1f).height(38.dp),
                        shape = RoundedCornerShape(8.dp),
                        border = if (selected) null else BorderStroke(0.5.dp, CownColors.Border),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 4.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (selected) CownColors.Active else CownColors.SurfaceMuted,
                            contentColor = if (selected) CownColors.OnActive else CownColors.Ink,
                        ),
                    ) {
                        Text(role.label, fontSize = 13.sp)
                    }
                }
            }
        }
        Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(CownColors.Border))
    }
}
>>>>>>> 4bf9e85d0aad0573bdb35b4b2b04a136edc4b6bf
