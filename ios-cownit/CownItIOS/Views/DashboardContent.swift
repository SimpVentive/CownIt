//
//  DashboardContent.swift
//  CownItIOS
//
//  Renders the content area for a given role + sidebar section.
//

import SwiftUI

struct DashboardContent: View {
    let role: Role
    let sectionId: String
    let sectionLabel: String

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                PageHeader(role: role, sectionId: sectionId, sectionLabel: sectionLabel)
                switch role {
                case .individual: individualSections
                case .hr: hrSections
                case .ceo: ceoSections
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 18)
            .padding(.bottom, 40)
        }
        .background(CownColors.canvas)
    }

    // MARK: - Individual

    @ViewBuilder private var individualSections: some View {
        StatRow(role: .individual)
        FlatCard {
            VStack(alignment: .leading, spacing: 0) {
                CardTitle("Active commitments")
                Spacer().frame(height: 4)
                CommitmentRow(title: "Ship onboarding redesign", due: "Due Jul 12", progress: 0.72, tone: .emerald, status: "On track")
                Hairline()
                CommitmentRow(title: "Reduce support backlog 30%", due: "Due Jul 20", progress: 0.45, tone: .amber, status: "At risk")
                Hairline()
                CommitmentRow(title: "Mentor two new engineers", due: "Ongoing", progress: 0.6, tone: .blue, status: "In progress")
            }
        }
        FlatCard {
            VStack(alignment: .leading, spacing: 0) {
                CardTitle("This week's check-in")
                Spacer().frame(height: 10)
                Text("You've completed 3 of 5 planned outcomes. Log a quick reflection to keep your streak alive.")
                    .font(CownFont.bodyMedium)
                    .foregroundStyle(CownColors.inkSoft)
                Spacer().frame(height: 14)
                ProgressBarView(progress: 0.6)
                Spacer().frame(height: 8)
                Text("3 / 5 outcomes")
                    .font(CownFont.bodySmall)
                    .foregroundStyle(CownColors.muted)
            }
        }
    }

    // MARK: - HR

    @ViewBuilder private var hrSections: some View {
        StatRow(role: .hr)
        FlatCard {
            VStack(alignment: .leading, spacing: 0) {
                CardTitle("Departments")
                Spacer().frame(height: 4)
                DeptRow(name: "Engineering", meta: "38 people", progress: 0.81)
                Hairline()
                DeptRow(name: "Sales", meta: "26 people", progress: 0.64)
                Hairline()
                DeptRow(name: "Product", meta: "19 people", progress: 0.77)
                Hairline()
                DeptRow(name: "Customer Success", meta: "22 people", progress: 0.58)
            }
        }
        FlatCard {
            VStack(alignment: .leading, spacing: 0) {
                CardTitle("Needs attention")
                Spacer().frame(height: 4)
                ListRowView(title: "12 reviews overdue", subtitle: "Q2 cycle closes in 4 days", onTap: {}) {
                    StatusBadge(text: "Overdue", tone: .rose)
                }
                Hairline()
                ListRowView(title: "8 commitments unassigned", subtitle: "Across Sales and Success", onTap: {}) {
                    StatusBadge(text: "Action", tone: .amber)
                }
            }
        }
    }

    // MARK: - CEO

    @ViewBuilder private var ceoSections: some View {
        StatRow(role: .ceo)
        FlatCard {
            VStack(alignment: .leading, spacing: 0) {
                CardTitle("Objective alignment")
                Spacer().frame(height: 10)
                ObjectiveRow(title: "Grow ARR to $24M", progress: 0.68, tone: .emerald)
                Spacer().frame(height: 14)
                ObjectiveRow(title: "Launch enterprise tier", progress: 0.42, tone: .amber)
                Spacer().frame(height: 14)
                ObjectiveRow(title: "World-class NPS (>60)", progress: 0.85, tone: .emerald)
            }
        }
        FlatCard {
            VStack(alignment: .leading, spacing: 0) {
                CardTitle("Department performance")
                Spacer().frame(height: 4)
                DeptRow(name: "Engineering", meta: "Velocity +12%", progress: 0.81)
                Hairline()
                DeptRow(name: "Sales", meta: "Quota 64%", progress: 0.64)
                Hairline()
                DeptRow(name: "Product", meta: "On roadmap", progress: 0.77)
            }
        }
    }
}

// MARK: - Page header

private struct PageHeader: View {
    let role: Role
    let sectionId: String
    let sectionLabel: String

    var body: some View {
        let copy = headerCopy(role: role, sectionId: sectionId, sectionLabel: sectionLabel)
        HStack(alignment: .center, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(copy.title)
                    .font(CownFont.headlineMedium)
                    .foregroundStyle(CownColors.ink)
                Text(copy.subtitle)
                    .font(CownFont.bodyMedium)
                    .foregroundStyle(CownColors.muted)
            }
            Spacer(minLength: 0)
            if let cta = copy.cta {
                PrimaryButton(text: cta)
            }
        }
    }
}

private struct PrimaryButton: View {
    let text: String

    var body: some View {
        Button(action: {}) {
            HStack(spacing: 6) {
                Image(systemName: "plus")
                    .font(.system(size: 14, weight: .semibold))
                Text(text)
                    .font(CownFont.titleSmall)
            }
            .foregroundStyle(CownColors.white)
            .padding(.horizontal, 14)
            .padding(.vertical, 9)
            .background(CownColors.ink)
            .clipShape(.rect(cornerRadius: 9))
        }
        .buttonStyle(.plain)
    }
}

private func headerCopy(role: Role, sectionId: String, sectionLabel: String) -> (title: String, subtitle: String, cta: String?) {
    switch role {
    case .individual:
        switch sectionId {
        case "dashboard": return ("Good morning, Alex", "Here's where your commitments stand this cycle.", nil)
        case "commitments": return ("My Commitments", "Track what you've committed to and own the outcome.", "New")
        case "goals": return ("Goals", "Your objectives and key results for Q3.", "New")
        case "checkins": return ("Check-ins", "Weekly progress updates and reflections.", "Add")
        default: return ("Profile", "Your role, team, and accountability settings.", nil)
        }
    case .hr:
        switch sectionId {
        case "overview": return ("People Overview", "Organization-wide commitment health at a glance.", nil)
        case "people": return ("People", "142 employees across 6 departments.", "Invite")
        case "commitments": return ("Commitments", "Monitor commitment follow-through across teams.", nil)
        case "reviews": return ("Reviews", "Performance review cycles and completion.", "Start")
        default: return ("Reports", "Exportable insights on engagement and delivery.", "Export")
        }
    case .ceo:
        switch sectionId {
        case "company": return ("Company Pulse", "How the whole organization is owning its goals.", nil)
        case "departments": return ("Departments", "Performance and alignment by department.", nil)
        case "performance": return ("Performance", "Delivery trends across the last four cycles.", nil)
        case "alignment": return ("Strategic Alignment", "How team goals ladder up to company objectives.", nil)
        default: return ("Insights", "AI-surfaced risks and momentum signals.", "Export")
        }
    }
}

// MARK: - Shared bits

private struct StatRow: View {
    let role: Role

    private var stats: [(label: String, value: String, delta: String)] {
        switch role {
        case .individual: return [("Commitments", "8", "+2"), ("On track", "75%", "+6%")]
        case .hr: return [("Employees", "142", "+9"), ("Follow-through", "82%", "+4%")]
        case .ceo: return [("Goal completion", "71%", "+5%"), ("Alignment", "88%", "+3%")]
        }
    }

    var body: some View {
        HStack(spacing: 12) {
            ForEach(stats, id: \.label) { stat in
                StatCard(label: stat.label, value: stat.value, delta: stat.delta, positive: true)
            }
        }
    }
}

private struct CardTitle: View {
    let text: String
    init(_ text: String) { self.text = text }

    var body: some View {
        HStack {
            Text(text)
                .font(CownFont.titleLarge)
                .foregroundStyle(CownColors.ink)
            Spacer()
            Image(systemName: "ellipsis")
                .font(.system(size: 18))
                .foregroundStyle(CownColors.faint)
        }
    }
}

private struct CommitmentRow: View {
    let title: String
    let due: String
    let progress: Double
    let tone: BadgeTone
    let status: String

    private var fillColor: Color {
        switch tone {
        case .amber: return CownColors.amber
        case .rose: return CownColors.rose
        case .blue: return CownColors.blue
        default: return CownColors.emerald
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text(title)
                    .font(CownFont.titleMedium)
                    .foregroundStyle(CownColors.ink)
                Spacer()
                StatusBadge(text: status, tone: tone)
            }
            Spacer().frame(height: 10)
            ProgressBarView(progress: progress, fill: fillColor)
            Spacer().frame(height: 8)
            HStack {
                Text("\(Int(progress * 100))% complete")
                    .font(CownFont.bodySmall)
                    .foregroundStyle(CownColors.muted)
                Spacer()
                Text(due)
                    .font(CownFont.bodySmall)
                    .foregroundStyle(CownColors.faint)
            }
        }
        .padding(.vertical, 12)
    }
}

private struct DeptRow: View {
    let name: String
    let meta: String
    let progress: Double

    var body: some View {
        HStack(spacing: 12) {
            InitialsAvatar(initials: String(name.prefix(2)).uppercased())
            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(CownFont.titleMedium)
                    .foregroundStyle(CownColors.ink)
                Text(meta)
                    .font(CownFont.bodySmall)
                    .foregroundStyle(CownColors.muted)
            }
            Spacer()
            VStack(alignment: .leading, spacing: 6) {
                ProgressBarView(progress: progress)
                Text("\(Int(progress * 100))%")
                    .font(CownFont.bodySmall)
                    .foregroundStyle(CownColors.muted)
            }
            .frame(width: 96)
        }
        .padding(.vertical, 12)
    }
}

private struct ObjectiveRow: View {
    let title: String
    let progress: Double
    let tone: BadgeTone

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text(title)
                    .font(CownFont.titleMedium)
                    .foregroundStyle(CownColors.ink)
                Spacer()
                Text("\(Int(progress * 100))%")
                    .font(CownFont.titleMedium)
                    .fontWeight(.semibold)
                    .foregroundStyle(CownColors.inkSoft)
            }
            Spacer().frame(height: 10)
            ProgressBarView(progress: progress, fill: tone == .amber ? CownColors.amber : CownColors.emerald)
        }
    }
}
