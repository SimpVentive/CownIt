package com.rork.cownit.data

/** The three workspace roles. */
enum class Role(val id: String, val label: String) {
    INDIVIDUAL("individual", "Individual"),
    HR("hr", "HR"),
    CEO("ceo", "CEO");

    companion object {
        fun fromId(id: String): Role = entries.first { it.id == id }
    }
}

/** Commit levels are exactly self | team | org (lowercase). */
enum class CommitLevel(val id: String, val label: String) {
    SELF("self", "Self"),
    TEAM("team", "Team / Dept"),
    ORG("org", "Organisation");

    companion object {
        fun fromId(id: String): CommitLevel = entries.first { it.id == id }
    }
}

/** CPQSDP impact dimensions. O (People) is the sixth, never P. */
enum class Dimension(val key: String, val label: String) {
    C("C", "Cost"),
    P("P", "Productivity"),
    Q("Q", "Quality"),
    S("S", "Safety"),
    D("D", "Delivery"),
    O("O", "People"),
}

data class Person(
    val id: String,
    val name: String,
    val initials: String,
    val department: String,
    val role: String,
)

data class Commit(
    val id: String,
    val personId: String,
    val level: String,
    val statement: String,
    val createdAt: String,
)

data class Achievement(
    val id: String,
    val personId: String,
    val commitId: String,
    val title: String,
    val evidence: String,
    val cpqsdp: List<String>,
    val impactRating: Int,
    val date: String,
    val fileAttachment: String?,
)

data class MonthlyUpdate(
    val id: String,
    val personId: String,
    val month: Int,
    val year: Int,
    val note: String,
    val updatedAt: String,
)

data class Message(
    val id: String,
    val fromRole: String,
    val fromName: String,
    val toPersonId: String,
    val body: String,
    val date: String,
    val read: Boolean,
)

data class HrComment(
    val id: String,
    val achievementId: String,
    val authorName: String,
    val body: String,
    val date: String,
)

/** All app data held in memory. Mutations replace whole lists. */
data class AppData(
    val people: List<Person>,
    val commits: List<Commit>,
    val achievements: List<Achievement>,
    val monthlyUpdates: List<MonthlyUpdate>,
    val messages: List<Message>,
    val hrComments: List<HrComment>,
)

/** Top-level app state — a single object as required. */
data class AppState(
    val isAuthenticated: Boolean = false,
    val activeRole: Role? = null,
    val activePage: String? = null,
    val selectedPersonId: String? = null,
    val currentUserId: String? = null,
    val loginRole: Role? = null,
    val data: AppData = seedData(),
)
