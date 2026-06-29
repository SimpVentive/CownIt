//
//  ContentView.swift
//  CownItIOS
//
//  Main screen: top bar, role-aware sidebar, and animated content area.
//

import SwiftUI

struct ContentView: View {
    @State private var role: Role = .individual
    @State private var activeSection: String = Role.individual.navItems.first?.id ?? "dashboard"

    private var items: [NavItem] { role.navItems }
    private var activeItem: NavItem {
        items.first(where: { $0.id == activeSection }) ?? items[0]
    }

    var body: some View {
        VStack(spacing: 0) {
            TopBar(
                activeRole: role,
                onRoleChange: { newRole in
                    role = newRole
                    activeSection = newRole.navItems.first?.id ?? activeSection
                }
            )
            Hairline()
            HStack(spacing: 0) {
                Sidebar(
                    role: role,
                    items: items,
                    activeId: activeItem.id,
                    onSelect: { activeSection = $0 }
                )
                Hairline(axis: .vertical)
                DashboardContent(
                    role: role,
                    sectionId: activeItem.id,
                    sectionLabel: activeItem.label
                )
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .transition(.opacity)
                .id("\(role.rawValue)-\(activeItem.id)")
                .animation(.easeInOut(duration: 0.22), value: activeItem.id)
            }
        }
        .background(CownColors.canvas)
        .ignoresSafeArea(.keyboard)
    }
}

#Preview {
    ContentView()
}
