# Quick Reference: Fatal Event Percentages

## Current Configuration
Located in: `data/events.ts`

```typescript
export const FATAL_EVENT_CHANCES: Record<string, number> = {
  bloodbath: 55,        // Opening phase
  day: 50,              // Mid-day events  
  night: 45,            // Night events
  feast: 65,            // Feast phase
  'arena-event': 55,    // Arena interventions
};
```

## Adjustment Guide

### Increase This If...
- Games feel too short
- Deaths happen too fast
- Want more intense action

**Solution:** Increase the percentage value
```typescript
day: 50 → day: 60  // More fatal events
```

### Decrease This If...
- Games drag on too long
- Want more survival chances
- Need better pacing

**Solution:** Decrease the percentage value
```typescript
feast: 65 → feast: 50  // Fewer fatal events
```

## Quick Presets

### Balance (Default - Recommended)
```typescript
bloodbath: 55,
day: 50,
night: 45,
feast: 65,
'arena-event': 55,
```
**Expected:** ~10-14 day games, ~20 deaths

### Aggressive (Shorter Games)
```typescript
bloodbath: 70,
day: 65,
night: 60,
feast: 80,
'arena-event': 70,
```
**Expected:** ~7-10 day games, ~25+ deaths

### Conservative (Longer Games)
```typescript
bloodbath: 40,
day: 40,
night: 30,
feast: 50,
'arena-event': 40,
```
**Expected:** ~15-20 day games, ~15 deaths

## What Each Percentage Means

| Value | Meaning |
|-------|---------|
| 0% | **Only non-fatal events** for this phase |
| 25% | **Mostly survival**, occasional deaths |
| 50% | **Balanced** between fatal and non-fatal |
| 75% | **Mostly deadly**, occasional survival |
| 100% | **Only fatal events** for this phase |

## Example: Adjusting for Balance

1. **Play a test game** with default settings
2. **Observe:** Did it feel too short/long?
3. **Adjust:** Change one value by 5-10%
4. **Test:** Run 3-5 simulations
5. **Repeat** until satisfied

### Example Adjustment
- Current: `day: 50` (balanced)
- Game too short → Change to `day: 40` (less deadly)
- Test 5 games → Still short → Change to `day: 30`
- Test again → Good balance? Keep it!

## Technical Note

The system works by:
1. Splitting each event pool into fatal and non-fatal events
2. For each event selection, probability determines which pool to use
3. Then randomly picks from that pool

**Result:** Natural distribution that respects event variety while maintaining target fatality rate.

## Where to Change
**File:** `c:\Users\cosilry\Documents\HG\hunger-games-sim\data\events.ts`

**Lines:** 17-23

```typescript
export const FATAL_EVENT_CHANCES: Record<string, number> = {
  bloodbath: 55,   // ← Change this number
  day: 50,         // ← or this
  night: 45,       // ← or this
  feast: 65,       // ← or this
  'arena-event': 55,// ← or this
};
```

## Phase Names
Use these exact strings when checking configuration:
- `'bloodbath'` - Opening phase
- `'day'` - Daytime events
- `'night'` - Nighttime events  
- `'feast'` - Feast event
- `'arena-event'` - Arena game maker interventions

---

**Need more details?** See `FATAL_EVENT_CONFIG.md` for comprehensive documentation.
