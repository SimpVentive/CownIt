//
//  CownTypography.swift
//  CownItIOS
//
//  A tightly tuned typographic scale for a professional dashboard.
//  System font family, deliberate weights, controlled tracking.
//

import SwiftUI

/// Named text styles used across CownIt, mirroring the Android type scale.
enum CownFont {
    static let displaySmall = Font.system(size: 30, weight: .semibold)
    static let headlineMedium = Font.system(size: 24, weight: .semibold)
    static let headlineSmall = Font.system(size: 20, weight: .semibold)
    static let titleLarge = Font.system(size: 17, weight: .semibold)
    static let titleMedium = Font.system(size: 15, weight: .medium)
    static let titleSmall = Font.system(size: 13, weight: .medium)
    static let bodyLarge = Font.system(size: 15, weight: .regular)
    static let bodyMedium = Font.system(size: 13, weight: .regular)
    static let bodySmall = Font.system(size: 12, weight: .regular)
    static let labelLarge = Font.system(size: 13, weight: .medium)
    static let labelMedium = Font.system(size: 11, weight: .medium)
    static let labelSmall = Font.system(size: 10, weight: .semibold)
}
