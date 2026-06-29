//
//  TopBar.swift
//  CownItIOS
//
//  Fixed top navigation bar: logo + wordmark on the left, role switcher on
//  the right, plus a notifications button.
//

import SwiftUI

struct TopBar: View {
    let activeRole: Role
    let onRoleChange: (Role) -> Void

    var body: some View {
        HStack(spacing: 0) {
            Logo()
            Spacer(minLength: 12)
            RoleSwitcher(activeRole: activeRole, onRoleChange: onRoleChange)
            Spacer().frame(width: 12)
            Button(action: {}) {
                Image(systemName: "bell")
                    .font(.system(size: 18))
                    .foregroundStyle(CownColors.inkSoft)
                    .frame(width: 36, height: 36)
                    .background(CownColors.canvas)
                    .clipShape(.rect(cornerRadius: 9))
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 16)
        .frame(height: 58)
        .background(CownColors.white)
    }
}

private struct Logo: View {
    var body: some View {
        HStack(spacing: 9) {
            Image(systemName: "checkmark")
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(CownColors.emerald)
                .frame(width: 28, height: 28)
                .background(CownColors.ink)
                .clipShape(.rect(cornerRadius: 8))
            HStack(spacing: 0) {
                Text("Cown")
                    .foregroundStyle(CownColors.ink)
                Text("It")
                    .foregroundStyle(CownColors.emerald)
            }
            .font(CownFont.titleLarge)
        }
    }
}

/// Three-button segmented role switcher.
private struct RoleSwitcher: View {
    let activeRole: Role
    let onRoleChange: (Role) -> Void

    var body: some View {
        HStack(spacing: 2) {
            ForEach(Role.allCases) { role in
                let selected = role == activeRole
                Button {
                    onRoleChange(role)
                } label: {
                    Text(role.label)
                        .font(CownFont.titleSmall)
                        .fontWeight(selected ? .semibold : .medium)
                        .foregroundStyle(selected ? CownColors.ink : CownColors.muted)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 7)
                        .background(selected ? CownColors.white : .clear)
                        .clipShape(.rect(cornerRadius: 8))
                }
                .buttonStyle(.plain)
                .animation(.easeInOut(duration: 0.18), value: activeRole)
            }
        }
        .padding(2)
        .background(CownColors.canvas)
        .clipShape(.rect(cornerRadius: 10))
    }
}
