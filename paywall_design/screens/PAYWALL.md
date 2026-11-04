# Paywall (design 1a — plan list)

Build as a React Native full-screen modal using `../tokens.ts` and `../DESIGN.md`. Reference image: `paywall-1a.png`. Solid colors only.

## Layout (top → bottom)
Container: `colors.bg`, padding horizontal `size.screenPadding` (20), safe-area top + bottom (bottom padding 28).

1. **Top bar** (height 44): left `Restore` text button (`type.subhead` semibold, `textSecondary`) → restores purchases. Right close `X` plain icon 22 (`textSecondary`) → dismiss.
2. **Overline** `STILL PREMIUM` (`type.overline`, `textTertiary`), centered, marginTop 12.
3. **Title** `Keep more of every day.` (`type.title1`), centered, marginTop 8.
4. **Feature list**, marginTop 28, marginHorizontal 8, gap 14. Each row: 32 circle `surfaceRaised` with check icon 16 (`textPrimary`, stroke 2) + label `type.callout`.
   - Up to 30 photos per post
   - Videos
   - Home screen widgets
   - Achievement badges
   - Reminders
5. **Spacer** (flex 1).
6. **Plan list**, gap 10. Row: height 64, radius `lg` (20), `surface` fill, 1.5 border (`surface` when unselected, `inverse` when selected), padding 16, gap 14.
   - Radio: 22 circle, 1.5 border (`borderStrong` / `inverse` selected), inner 12 dot `inverse` when selected.
   - Name `type.headline` + per-month `type.footnote` `textSecondary`; price right-aligned `type.headline`.
   - Savings badge: absolute top −10, right 16, height 20, pill, `inverse` fill, `onInverse` 11pt bold.

| Plan | Price | Per month | Badge | Billing copy |
|---|---|---|---|---|
| Monthly | $4 | $4.00 / month | — | $4 per month |
| Quarterly | $10 | $3.33 / month | Save 17% | $10 every 3 months |
| Yearly (default) | $25 | $2.08 / month | Save 48% | $25 per year |

7. **CTA** `Start Free Trial`: primary button lg (56), full width, marginTop 16. Haptic `impactLight`.
8. **Trial copy** `7 days free, then {billing copy}. Cancel anytime.` — `type.footnote`, `textSecondary`, centered, marginTop 10. Updates with selection.
9. **Links** `Terms` · `Privacy`, 12pt `textSecondary`, centered, gap 16, marginTop 10.

## Behavior
- Selecting a plan: `selection` haptic, border/radio animate `motion.fast`.
- CTA starts purchase for the selected product with a 7-day free trial (RevenueCat or StoreKit). Show a loading state on the button; on success dismiss and show toast "Welcome to Premium".
- Restore: on success dismiss; on nothing found show alert "No purchases found".
- Prices should come from the store (localized), falling back to the table above.
