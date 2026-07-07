package com.rork.cownit.data

/** Initial in-memory seed data, mirroring the source dataset. */
fun seedData(): AppData = AppData(
    people = listOf(
        Person("p1", "John Smith", "JS", "Operations", "individual"),
        Person("p2", "Sarah Johnson", "SJ", "Quality", "individual"),
        Person("p3", "Mike Chen", "MC", "Safety", "individual"),
        Person("p4", "Lisa Davis", "LD", "HR", "individual"),
    ),
    commits = listOf(
        Commit("c1", "p1", "self", "Completed process documentation for Q2", "2026-06-15T10:30:00Z"),
        Commit("c2", "p1", "team", "Led training session for new team members", "2026-06-18T14:00:00Z"),
        Commit("c3", "p1", "org", "Implemented new operational standards across departments", "2026-06-20T09:15:00Z"),
        Commit("c4", "p2", "self", "Completed quality audit for product line A", "2026-06-10T11:00:00Z"),
        Commit("c5", "p2", "team", "Coordinated quality review with cross-functional team", "2026-06-17T13:30:00Z"),
        Commit("c6", "p2", "org", "Established company-wide quality metrics framework", "2026-06-22T15:45:00Z"),
        Commit("c7", "p3", "self", "Completed safety incident report analysis", "2026-06-12T09:00:00Z"),
        Commit("c8", "p3", "team", "Organized safety training for warehouse staff", "2026-06-19T10:30:00Z"),
        Commit("c9", "p3", "org", "Updated company safety protocols to meet regulatory standards", "2026-06-25T14:20:00Z"),
        Commit("c10", "p4", "self", "Processed employee onboarding for new hires", "2026-06-08T10:00:00Z"),
        Commit("c11", "p4", "team", "Facilitated conflict resolution between team members", "2026-06-16T11:00:00Z"),
        Commit("c12", "p4", "org", "Developed company-wide employee engagement program", "2026-06-23T16:00:00Z"),
    ),
    achievements = listOf(
        Achievement(
            id = "a1",
            personId = "p1",
            commitId = "c1",
            title = "Process documentation excellence",
            evidence = "Comprehensive documentation completed and approved by management",
            cpqsdp = listOf("P", "Q"),
            impactRating = 8,
            date = "2026-06-15T10:30:00Z",
            fileAttachment = null,
        ),
        Achievement(
            id = "a2",
            personId = "p1",
            commitId = "c2",
            title = "Team development initiative",
            evidence = "Training session conducted for 15 team members with positive feedback",
            cpqsdp = listOf("D", "O"),
            impactRating = 7,
            date = "2026-06-18T14:00:00Z",
            fileAttachment = null,
        ),
        Achievement(
            id = "a3",
            personId = "p1",
            commitId = "c3",
            title = "Organisational standards implementation",
            evidence = "New operational standards adopted across all departments",
            cpqsdp = listOf("C", "P", "O"),
            impactRating = 9,
            date = "2026-06-20T09:15:00Z",
            fileAttachment = null,
        ),
    ),
    monthlyUpdates = listOf(
        MonthlyUpdate("m1", "p1", 6, 2026, "Strong performance this month with three major achievements", "2026-06-29T10:00:00Z"),
        MonthlyUpdate("m2", "p2", 6, 2026, "Quality metrics on track for end of quarter", "2026-06-28T14:30:00Z"),
    ),
    messages = listOf(
        Message(
            id = "msg1",
            fromRole = "hr",
            fromName = "Lisa Davis",
            toPersonId = "p1",
            body = "Great work on the team training session last week. Your leadership is appreciated.",
            date = "2026-06-19T09:00:00Z",
            read = true,
        ),
        Message(
            id = "msg2",
            fromRole = "ceo",
            fromName = "Robert Kim",
            toPersonId = "p1",
            body = "The new operational standards you implemented are making a real difference. Keep up the excellent work.",
            date = "2026-06-24T15:30:00Z",
            read = false,
        ),
    ),
    hrComments = listOf(
        HrComment(
            id = "hrc1",
            achievementId = "a1",
            authorName = "Lisa Davis",
            body = "Excellent documentation work. This will be a valuable resource for the entire team.",
            date = "2026-06-16T11:00:00Z",
        ),
    ),
)

/** Demo login users keyed by role. All passwords are "password". */
data class DemoUser(val id: String, val name: String)

val demoUsers: Map<Role, List<DemoUser>> = mapOf(
    Role.INDIVIDUAL to listOf(
        DemoUser("p1", "John Smith"),
        DemoUser("p2", "Sarah Johnson"),
        DemoUser("p3", "Mike Chen"),
        DemoUser("p4", "Lisa Davis"),
    ),
    Role.HR to listOf(DemoUser("hr-user", "HR Manager")),
    Role.CEO to listOf(DemoUser("ceo-user", "CEO")),
)
