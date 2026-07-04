//
//  CownColors.swift
//  CownItIOS
//
//  Flat, professional enterprise palette — white surfaces, hairline borders,
//  ink text, and a single confident emerald accent.
//

import SwiftUI

/// CownIt design tokens.
enum CownColors {
    // Brand
    static let emerald = Color(hex: 0x0E8A5F)
    static let emeraldDark = Color(hex: 0x0A6B49)
    static let emeraldSoft = Color(hex: 0xE7F4EE)

    // Ink / text
    static let ink = Color(hex: 0x0F1722)
    static let inkSoft = Color(hex: 0x374151)
    static let muted = Color(hex: 0x6B7280)
    static let faint = Color(hex: 0x9CA3AF)

    // Surfaces
    static let white = Color(hex: 0xFFFFFF)
    static let canvas = Color(hex: 0xF7F8F9)
    static let railTint = Color(hex: 0xFBFBFC)

    // Hairlines
    static let border = Color(hex: 0xE6E8EB)
    static let borderStrong = Color(hex: 0xD8DBDF)

    // Status accents
    static let amber = Color(hex: 0xB7791F)
    static let amberSoft = Color(hex: 0xFBF3E2)
    static let rose = Color(hex: 0xB42318)
    static let roseSoft = Color(hex: 0xFBEAE8)
    static let blue = Color(hex: 0x1D4ED8)
    static let blueSoft = Color(hex: 0xE8EEFC)
}

extension Color {
    /// Build a fully opaque color from a 24-bit hex literal (e.g. 0x0E8A5F).
    init(hex: UInt32) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: 1.0)
    }
}
