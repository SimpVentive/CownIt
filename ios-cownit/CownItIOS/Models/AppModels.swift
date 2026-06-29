//
//  AppModels.swift
//  CownItIOS
//
//  Roles and role-aware navigation model.
//

import SwiftUI

/// The three workspace roles available in the top-right switcher.
enum Role: String, CaseIterable, Identifiable {
    case individual
    case hr
    case ceo

    var id: String { rawValue }

    var label: String {
        switch self {
        case .individual: return "Individual"
        case .hr: return "HR"
        case .ceo: return "CEO"
        }
    }
}

/// A single entry in the role-aware sidebar.
struct NavItem: Identifiable, Equatable {
    let id: String
    let label: String
    let icon: String

    static func == (lhs: NavItem, rhs: NavItem) -> Bool { lhs.id == rhs.id }
}

extension Role {
    /// Sidebar contents change depending on the active role.
    var navItems: [NavItem] {
        switch self {
        case .individual:
            return [
                NavItem(id: "dashboard", label: "Dashboard", icon: "square.grid.2x2"),
                NavItem(id: "commitments", label: "My Commitments", icon: "checkmark.circle"),
                NavItem(id: "goals", label: "Goals", icon: "flag"),
                NavItem(id: "checkins", label: "Check-ins", icon: "calendar.badge.checkmark"),
                NavItem(id: "profile", label: "Profile", icon: "person"),
            ]
        case .hr:
            return [
                NavItem(id: "overview", label: "Overview", icon: "square.grid.2x2"),
                NavItem(id: "people", label: "People", icon: "person.3"),
                NavItem(id: "commitments", label: "Commitments", icon: "list.bullet.clipboard"),
                NavItem(id: "reviews", label: "Reviews", icon: "star.bubble"),
                NavItem(id: "reports", label: "Reports", icon: "chart.bar"),
            ]
        case .ceo:
            return [
                NavItem(id: "company", label: "Company", icon: "building.2"),
                NavItem(id: "departments", label: "Departments", icon: "point.3.connected.trianglepath.dotted"),
                NavItem(id: "performance", label: "Performance", icon: "chart.line.uptrend.xyaxis"),
                NavItem(id: "alignment", label: "Alignment", icon: "target"),
                NavItem(id: "insights", label: "Insights", icon: "sparkles"),
            ]
        }
    }
}
