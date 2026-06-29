//
//  CownComponents.swift
//  CownItIOS
//
//  Reusable flat building blocks: cards, KPI stats, badges, progress bars,
//  avatars, list rows. No shadows, no gradients — hairline borders only.
//

import SwiftUI

/// A flat white card with a single hairline border.
struct FlatCard<Content: View>: View {
    var padding: CGFloat = 16
    @ViewBuilder var content: Content

    var body: some View {
        content
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(CownColors.white)
            .clipShape(.rect(cornerRadius: 12))
            .overlay {
                RoundedRectangle(cornerRadius: 12)
                    .stroke(CownColors.border, lineWidth: 0.5)
            }
    }
}

/// Small uppercase section eyebrow label.
struct SectionLabel: View {
    let text: String

    var body: some View {
        Text(text.uppercased())
            .font(CownFont.labelSmall)
            .tracking(0.8)
            .foregroundStyle(CownColors.faint)
    }
}

/// A KPI stat card with trend indicator.
struct StatCard: View {
    let label: String
    let value: String
    var delta: String? = nil
    var positive: Bool = true

    var body: some View {
        FlatCard {
            VStack(alignment: .leading, spacing: 0) {
                Text(label.uppercased())
                    .font(CownFont.labelSmall)
                    .tracking(0.8)
                    .foregroundStyle(CownColors.faint)
                Spacer().frame(height: 10)
                Text(value)
                    .font(CownFont.displaySmall)
                    .foregroundStyle(CownColors.ink)
                if let delta {
                    Spacer().frame(height: 8)
                    HStack(spacing: 4) {
                        let tint = positive ? CownColors.emerald : CownColors.rose
                        Image(systemName: positive ? "arrow.up" : "arrow.down")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(tint)
                        Text(delta)
                            .font(CownFont.bodySmall)
                            .fontWeight(.medium)
                            .foregroundStyle(tint)
                        Text("vs last cycle")
                            .font(CownFont.bodySmall)
                            .foregroundStyle(CownColors.faint)
                    }
                }
            }
        }
    }
}

enum BadgeTone {
    case emerald, amber, rose, blue, neutral

    var colors: (bg: Color, fg: Color) {
        switch self {
        case .emerald: return (CownColors.emeraldSoft, CownColors.emeraldDark)
        case .amber: return (CownColors.amberSoft, CownColors.amber)
        case .rose: return (CownColors.roseSoft, CownColors.rose)
        case .blue: return (CownColors.blueSoft, CownColors.blue)
        case .neutral: return (CownColors.canvas, CownColors.muted)
        }
    }
}

/// A soft, flat status pill.
struct StatusBadge: View {
    let text: String
    let tone: BadgeTone

    var body: some View {
        let c = tone.colors
        Text(text)
            .font(CownFont.labelMedium)
            .fontWeight(.medium)
            .foregroundStyle(c.fg)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(c.bg)
            .clipShape(.rect(cornerRadius: 6))
    }
}

/// A thin, flat progress bar with smooth fill animation.
struct ProgressBarView: View {
    let progress: Double
    var track: Color = CownColors.canvas
    var fill: Color = CownColors.emerald
    var height: CGFloat = 6

    @State private var animated: Double = 0

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(track)
                Capsule()
                    .fill(fill)
                    .frame(width: geo.size.width * animated)
            }
        }
        .frame(height: height)
        .onAppear {
            withAnimation(.easeInOut(duration: 0.7)) {
                animated = min(max(progress, 0), 1)
            }
        }
        .onChange(of: progress) { _, newValue in
            withAnimation(.easeInOut(duration: 0.7)) {
                animated = min(max(newValue, 0), 1)
            }
        }
    }
}

/// Circular avatar with initials.
struct InitialsAvatar: View {
    let initials: String
    var size: CGFloat = 36
    var bg: Color = CownColors.emeraldSoft
    var fg: Color = CownColors.emeraldDark

    var body: some View {
        Circle()
            .fill(bg)
            .frame(width: size, height: size)
            .overlay {
                Text(initials)
                    .font(CownFont.labelLarge)
                    .fontWeight(.semibold)
                    .foregroundStyle(fg)
            }
    }
}

/// A row entry with optional leading icon, title, subtitle, and trailing content.
struct ListRowView<Trailing: View>: View {
    let title: String
    var subtitle: String? = nil
    var leadingIcon: String? = nil
    var onTap: (() -> Void)? = nil
    @ViewBuilder var trailing: Trailing

    var body: some View {
        let row = HStack(spacing: 0) {
            if let leadingIcon {
                Image(systemName: leadingIcon)
                    .font(.system(size: 18))
                    .foregroundStyle(CownColors.muted)
                    .frame(width: 18)
                Spacer().frame(width: 12)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(CownFont.titleMedium)
                    .foregroundStyle(CownColors.ink)
                if let subtitle {
                    Text(subtitle)
                        .font(CownFont.bodySmall)
                        .foregroundStyle(CownColors.muted)
                }
            }
            Spacer(minLength: 12)
            trailing
        }
        .padding(.vertical, 12)
        .contentShape(Rectangle())

        if let onTap {
            Button(action: onTap) { row }
                .buttonStyle(.plain)
        } else {
            row
        }
    }
}

extension ListRowView where Trailing == EmptyView {
    init(title: String, subtitle: String? = nil, leadingIcon: String? = nil, onTap: (() -> Void)? = nil) {
        self.init(title: title, subtitle: subtitle, leadingIcon: leadingIcon, onTap: onTap) { EmptyView() }
    }
}

/// A 0.5px hairline divider.
struct Hairline: View {
    var axis: Axis = .horizontal
    var color: Color = CownColors.border

    var body: some View {
        Rectangle()
            .fill(color)
            .frame(
                width: axis == .vertical ? 0.5 : nil,
                height: axis == .horizontal ? 0.5 : nil
            )
    }
}
