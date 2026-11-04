# Still — iOS design system (React Native)

Spec for building UI with Claude Code. Tokens live in `tokens.ts` (RN), `tokens.json` (source of truth) and `Tokens.swift` (SwiftUI). Never hardcode a color, size or radius that exists as a token.

## Principles
1. **Dark first.** Design and test on `palette.dark`. Light mode mirrors it via `useTheme()`.
2. **Monochrome.** Hierarchy comes from gray steps, weight and size, not hue. No brand accent.
3. **Solid only.** No gradients anywhere: buttons, icons, illustrations, backgrounds, text, skeletons. No `expo-linear-gradient`, no `react-native-linear-gradient`. Use solid fills and borders.
4. **Calm density.** Generous padding, one primary action per screen, centered content on focused flows.
5. **Round.** Pills for buttons and choices, 28pt cards, circles for icon buttons.

## Color
Surfaces step up from black: `bg` → `surface` (cards, lists) → `surfaceRaised` (choice pills, inputs, chips) → `surfaceHigh` (pressed / selected rows).
- Text: `textPrimary` for content, `textSecondary` for supporting copy, `textTertiary` for placeholders and disabled labels only.
- `inverse` / `onInverse`: primary button fill and its label; selected choice; toasts.
- `danger`, `success`, `warning`: status only (destructive button label, error text, success check). Never decorative, never large fills.
- Borders: `border` for hairline separators (0.5pt), `borderStrong` for outlined buttons (1pt).

### Accent colors
None by default. If one is added later: one solid hue, used only for a single meaning (e.g. premium), never on more than one element per screen, and never combined with another accent.

## Typography
System font (SF Pro). Use `type.*` styles; don't set fontSize ad hoc.
- `display` / `title1`: screen and onboarding headlines.
- `prompt`: centered journaling prompts and quotes inside cards.
- `title3`: section headers ("Weekly theme"). `headline`: list titles, button labels.
- `body` / `subhead`: content. `footnote` / `caption`: meta (attribution, "Day 3 of 7").
- `overline`: sidebar / grouped list section labels.

**Voice.** Greetings and brand moments are lowercase with a period ("good afternoon."). Headlines are sentence case. Buttons are short Title Case verbs ("Reflect", "Write It Out", "Next"). Helper text is one calm sentence.

## Layout
- Screen padding 20. Gaps on a 4pt grid (`space`). Section gap 32. Card internal padding 24.
- Respect safe areas. Bottom CTA sits 16 above the home indicator.
- Hit targets ≥ 44×44.

## Icons
- Line icons, 1.5pt stroke, 24pt (20pt in dense rows). Recommended: `lucide-react-native` with `strokeWidth={1.5}`, or SF Symbols via `expo-symbols` on iOS.
- Color: `textPrimary` default, `textSecondary` inactive. Filled variant only for active tab or selected state.
- Illustrations: flat, solid grays from the palette only. No gradients or shadows.

## Components
All pressables: `Pressable` with scale `motion.pressScale` + opacity `opacity.pressed` on press; `opacity.disabled` when disabled; haptic `selection` on choice, `impactLight` on primary.

**Button**
- `primary`: `inverse` fill, `onInverse` label, pill, height 56 (lg) / 48 (md). Full width in bottom CTA area, hugging otherwise (min width 160).
- `secondary`: transparent, 1pt `borderStrong`, `textPrimary` label, pill, height 48 / 36 (sm). Used inside cards ("Reflect").
- `tonal`: `surfaceRaised` fill, `textPrimary` label.
- `text`: no container, `textSecondary` `headline` ("Skip").
- `destructive`: `secondary` shape with `danger` label.

**IconButton**: circle 44. Variants `filled` (`inverse` bg, `onInverse` glyph — back/next in flows), `outlined` (1pt `borderStrong`), `plain` (no container — nav bar). **FAB**: 56 circle, `inverse`.

**ChoicePill** (single/multi select): height 56, pill, `surface` fill, `headline` centered. Selected: `inverse` fill, `onInverse` label. Stack with 12 gap; 2 columns when labels are short.

**TextField**: height 52, radius `md`, `surfaceRaised` fill, no border; focused: 1pt `borderStrong`. Label `footnote` `textSecondary` above, error `footnote` `danger` below. **Editor**: borderless full screen, prompt in `title3` bold above, placeholder "Start writing..." in `textTertiary`.

**SearchField**: height 40, pill, `surfaceRaised`, leading search icon 20.

**List / Cell**: grouped in a `surface` container, radius `lg`, rows separated by 0.5pt `border` inset 16. Row: min height 56, padding 16, leading icon 24 or 32 thumb, title `headline`, subtitle `subhead` `textSecondary`, trailing chevron / switch / badge / value.

**Card**
- `PromptCard`: `surface`, radius `xl`, padding 24, centered: icon 40, `prompt` text, optional caption, `secondary` button. Overflow menu (44 circle, `surfaceRaised`) top-right.
- `ThemeCard`: `surface`, radius `xl`, title `title3` + lock icon, caption, preview text fading by opacity (not gradient — truncate with `numberOfLines`), `secondary` button.
- `Tile`: 160×200, `surface`, radius `xl`, 64 circle icon on `surfaceRaised`, `footnote` bold label.

**Badge / Chip**: height 28, pill, `surfaceRaised`, `footnote` semibold. Streak chip: icon + count.

**Timeline step**: 44 circle `surfaceRaised` with icon, 2pt `surfaceHigh` connector, title `headline`, body `subhead`. Completed: title strikethrough.

**NavBar**: height 44 + status bar. Leading/trailing `IconButton plain`, centered title `headline` (or lowercase greeting in `title3`). Large-title variant uses `display`. No background; on scroll, `bg` with 0.5pt bottom `border`.

**TabBar**: height 49 + safe area, `bg` with 0.5pt top `border`. 4–5 items, icon 24 + `caption` label. Active `textPrimary` (filled icon), inactive `textTertiary`.

**SegmentedControl**: height 40, pill track `surface`, selected segment `inverse` fill with `onInverse` label, 4 inset.

**Sheet**: bottom sheet, `surface`, top radius `xl`, grabber 36×5 `surfaceHigh` radius 3, padding 24, scrim `scrim`. Use for pickers and confirm flows. Full-screen modals use `bg` with an `X` plain icon button top-right.

**Alert**: centered, width 300, `surfaceRaised`, radius `lg`, padding 24, title `headline`, message `subhead` `textSecondary`, buttons stacked full width (primary then text). Prefer native `Alert.alert` for simple confirms.

**Toast**: bottom, 16 above tab bar, pill, `inverse` fill, `onInverse` `subhead` label, optional leading icon; auto-dismiss 3s; slide + fade `motion.base`.

**Progress**: 4pt track `surfaceRaised`, fill `inverse`, pill ends. Step dots: 6pt, active `inverse`, inactive `surfaceHigh`.

## Motion
Durations 150 / 250 / 400ms, ease-out. Screen transitions: native stack. Content fades up 8pt on enter. Respect Reduce Motion.

## Don'ts
- Gradients of any kind, including in icons and images.
- Hue accents for decoration, colored card backgrounds.
- Drop shadows on dark (elevation is expressed with surface steps).
- More than one primary button per screen.
- Text below 12pt, or `textTertiary` for readable content.
