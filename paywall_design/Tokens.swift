// Still design tokens — SwiftUI. Solid colors only; never use gradients.
import SwiftUI

extension Color {
    init(hex: UInt32, alpha: Double = 1) {
        self.init(.sRGB,
                  red: Double((hex >> 16) & 0xFF) / 255,
                  green: Double((hex >> 8) & 0xFF) / 255,
                  blue: Double(hex & 0xFF) / 255,
                  opacity: alpha)
    }
    /// Resolves per color scheme. Dark is the primary design target.
    static func still(dark: UInt32, light: UInt32) -> Color {
        Color(UIColor { $0.userInterfaceStyle == .light
            ? UIColor(Color(hex: light)) : UIColor(Color(hex: dark)) })
    }
}

enum StillColor {
    static let bg            = Color.still(dark: 0x000000, light: 0xFFFFFF)
    static let surface       = Color.still(dark: 0x141414, light: 0xF3F3F3)
    static let surfaceRaised = Color.still(dark: 0x1E1E1E, light: 0xEAEAEA)
    static let surfaceHigh   = Color.still(dark: 0x2A2A2A, light: 0xDEDEDE)
    static let border        = Color.still(dark: 0x262626, light: 0xE4E4E4)
    static let borderStrong  = Color.still(dark: 0x3A3A3A, light: 0xCDCDCD)
    static let textPrimary   = Color.still(dark: 0xE8E8E8, light: 0x141414)
    static let textSecondary = Color.still(dark: 0x9C9C9C, light: 0x5E5E5E)
    static let textTertiary  = Color.still(dark: 0x6E6E6E, light: 0x8A8A8A)
    static let inverse       = Color.still(dark: 0xD6D6D6, light: 0x1A1A1A)
    static let onInverse     = Color.still(dark: 0x0A0A0A, light: 0xF2F2F2)
    static let danger        = Color.still(dark: 0xE0605A, light: 0xC8433D)
    static let success       = Color.still(dark: 0x5DB07E, light: 0x2F8A57)
    static let warning       = Color.still(dark: 0xD9A441, light: 0xA87414)
}

enum StillFont {
    static let display  = Font.system(size: 34, weight: .bold)
    static let title1   = Font.system(size: 28, weight: .bold)
    static let title2   = Font.system(size: 22, weight: .bold)
    static let title3   = Font.system(size: 20, weight: .semibold)
    static let prompt   = Font.system(size: 24, weight: .bold)
    static let headline = Font.system(size: 17, weight: .semibold)
    static let body     = Font.system(size: 17, weight: .regular)
    static let callout  = Font.system(size: 16, weight: .regular)
    static let subhead  = Font.system(size: 15, weight: .regular)
    static let footnote = Font.system(size: 13, weight: .regular)
    static let caption  = Font.system(size: 12, weight: .regular)
    static let overline = Font.system(size: 12, weight: .semibold) // + .tracking(1.4), .textCase(.uppercase)
}

enum StillSpace {
    static let s1: CGFloat = 4, s2: CGFloat = 8, s3: CGFloat = 12, s4: CGFloat = 16
    static let s5: CGFloat = 20, s6: CGFloat = 24, s8: CGFloat = 32, s10: CGFloat = 40, s14: CGFloat = 56
}

enum StillRadius {
    static let xs: CGFloat = 8, sm: CGFloat = 12, md: CGFloat = 16, lg: CGFloat = 20, xl: CGFloat = 28
    static let pill: CGFloat = 999
}

enum StillSize {
    static let hitMin: CGFloat = 44, buttonLg: CGFloat = 56, buttonMd: CGFloat = 48, buttonSm: CGFloat = 36
    static let iconButton: CGFloat = 44, fab: CGFloat = 56, icon: CGFloat = 24, iconSm: CGFloat = 20
    static let screenPadding: CGFloat = 20
}

enum StillMotion {
    static let fast = Animation.easeOut(duration: 0.15)
    static let base = Animation.easeOut(duration: 0.25)
    static let spring = Animation.spring(response: 0.35, dampingFraction: 0.85)
    static let pressScale: CGFloat = 0.97
}
