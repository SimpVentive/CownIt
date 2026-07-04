//
//  Sidebar.swift
//  CownItIOS
//
//  Collapsed icon-rail sidebar that reflows its items based on the active role.
//  Labels appear beneath each icon to keep the rail compact yet legible.
//

import SwiftUI

struct Sidebar: View {
    let role: Role
    let items: [NavItem]
    let activeId: String
    let onSelect: (String) -> Void

    var body: some View {
        VStack(spacing: 6) {
            Text(role.label.uppercased())
                .font(CownFont.labelSmall)
                .tracking(0.8)
                .foregroundStyle(CownColors.faint)
                .padding(.bottom, 8)
            ForEach(items) { item in
                SidebarItem(
                    item: item,
                    selected: item.id == activeId,
                    onTap: { onSelect(item.id) }
                )
            }
            Spacer()
        }
        .padding(.vertical, 14)
        .padding(.horizontal, 8)
        .frame(width: 76)
        .frame(maxHeight: .infinity)
        .background(CownColors.railTint)
    }
}

private struct SidebarItem: View {
    let item: NavItem
    let selected: Bool
    let onTap: () -> Void

    var body: some View {
        let fg = selected ? CownColors.emeraldDark : CownColors.muted
        Button(action: onTap) {
            VStack(spacing: 5) {
                Image(systemName: item.icon)
                    .font(.system(size: 19))
                    .foregroundStyle(fg)
                Text(item.label)
                    .font(CownFont.labelSmall)
                    .fontWeight(selected ? .semibold : .medium)
                    .foregroundStyle(fg)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 9)
            .background(selected ? CownColors.emeraldSoft : .clear)
            .clipShape(.rect(cornerRadius: 12))
        }
        .buttonStyle(.plain)
        .animation(.easeInOut(duration: 0.18), value: selected)
    }
}
