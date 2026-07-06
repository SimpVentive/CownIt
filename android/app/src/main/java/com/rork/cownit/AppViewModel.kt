package com.rork.cownit

import androidx.lifecycle.ViewModel
import com.rork.cownit.data.Achievement
import com.rork.cownit.data.AppData
import com.rork.cownit.data.AppState
import com.rork.cownit.data.Commit
import com.rork.cownit.data.HrComment
import com.rork.cownit.data.Message
import com.rork.cownit.data.Role
import com.rork.cownit.data.seedData
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/** Default page per role. */
private fun defaultPageFor(role: Role): String = when (role) {
    Role.INDIVIDUAL -> "my-commits"
    Role.HR -> "people"
    Role.CEO -> "dashboard"
}

/**
 * Single source of truth for CownIt. All data mutations route through
 * [onDataChange], which replaces a whole entity list.
 */
class AppViewModel : ViewModel() {
    private val _state = MutableStateFlow(AppState())
    val state: StateFlow<AppState> = _state.asStateFlow()

    fun login(role: Role, userId: String) {
        _state.value = _state.value.copy(
            isAuthenticated = true,
            activeRole = role,
            loginRole = role,
            activePage = defaultPageFor(role),
            currentUserId = userId,
            selectedPersonId = null,
        )
    }

    fun logout() {
        _state.value = AppState(data = seedData())
    }

    /** Individuals cannot switch roles — only HR and CEO can. */
    val canSwitchRole: Boolean get() = _state.value.loginRole != Role.INDIVIDUAL

    fun changeRole(role: Role) {
        _state.value = _state.value.copy(
            activeRole = role,
            activePage = defaultPageFor(role),
            selectedPersonId = null,
        )
    }

    fun changePage(page: String) {
        _state.value = _state.value.copy(activePage = page)
    }

    fun selectPerson(personId: String?) {
        _state.value = _state.value.copy(selectedPersonId = personId)
    }

    /** Replace a whole entity list. */
    private fun applyData(transform: (AppData) -> AppData) {
        _state.value = _state.value.copy(data = transform(_state.value.data))
    }

    fun addAchievement(achievement: Achievement) =
        applyData { it.copy(achievements = it.achievements + achievement) }

    fun addHrComment(comment: HrComment) =
        applyData { it.copy(hrComments = it.hrComments + comment) }

    fun addMessage(message: Message) =
        applyData { it.copy(messages = it.messages + message) }

    fun addMessages(messages: List<Message>) =
        applyData { it.copy(messages = it.messages + messages) }

    fun addCommit(commit: Commit) =
        applyData { it.copy(commits = it.commits + commit) }
}
