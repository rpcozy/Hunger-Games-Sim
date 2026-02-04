# Fatal Event Configuration Guide

## Overview

The simulator uses configurable percentages to control how often fatal events trigger during each game phase. This allows you to balance game pacing and duration without modifying event pools.

## Configuration Location

**File:** `data/events.ts`

```typescript
export const FATAL_EVENT_CHANCES: Record<string, number> = {
  bloodbath: 55,        // Opening phase
  day: 50,              // Mid-day events
  night: 45,            // Nighttime events
  feast: 65,            // Feast phase
  'arena-event': 55,    // Arena game maker interventions
};
```

## How It Works

1. **Event Selection Process:**
   - When the simulator needs to select an event during a phase, it first determines whether to choose a fatal or non-fatal event
   - It uses the configured percentage to make this decision
   - Example: If `day: 50`, there's a 50% chance a fatal event will be selected, 50% chance for non-fatal

2. **Fatal vs Non-Fatal:**
   - **Fatal events:** Any event template with at least one death (has entries in the `deaths` array)
   - **Non-fatal events:** Events where no tributes die

3. **Current Event Distribution:**
   - **Bloodbath:** 28 non-fatal, 52 fatal (65% fatal) → configured to 55%
   - **Day:** 47 non-fatal, 74 fatal (61% fatal) → configured to 50%
   - **Night:** 46 non-fatal, 72 fatal (61% fatal) → configured to 45%
   - **Feast:** 11 non-fatal, 57 fatal (84% fatal) → configured to 65%
   - **Arena:** Mixed scenarios → configured to 55%

## Adjusting Percentages

### Game Too Short (Too Many Deaths)
Decrease the percentages to allow more survival events:

```typescript
export const FATAL_EVENT_CHANCES: Record<string, number> = {
  bloodbath: 45,        // ↓ reduced from 55
  day: 40,              // ↓ reduced from 50
  night: 35,            // ↓ reduced from 45
  feast: 55,            // ↓ reduced from 65
  'arena-event': 45,    // ↓ reduced from 55
};
```

### Game Too Long (Too Few Deaths)
Increase the percentages to trigger more fatal events:

```typescript
export const FATAL_EVENT_CHANCES: Record<string, number> = {
  bloodbath: 70,        // ↑ increased from 55
  day: 65,              // ↑ increased from 50
  night: 60,            // ↑ increased from 45
  feast: 80,            // ↑ increased from 65
  'arena-event': 70,    // ↑ increased from 55
};
```

## Recommended Ranges

| Phase | Min | Default | Max | Notes |
|-------|-----|---------|-----|-------|
| **bloodbath** | 40 | 55 | 80 | Opening excitement; balance spectacle with survival |
| **day** | 35 | 50 | 75 | Mid-game balance; avoid either extreme |
| **night** | 30 | 45 | 70 | Quieter phase; can be less deadly for pacing |
| **feast** | 50 | 65 | 85 | High-stakes event; naturally more deadly |
| **arena-event** | 40 | 55 | 75 | Game maker intervention; impactful but fair |

## Fine-Tuning Strategy

1. **Run test simulations** with your current settings
2. **Monitor average game length** - aim for 10-14 days with ~20 deaths
3. **Adjust by small increments** (5% at a time) to avoid drastic changes
4. **Consider phase flow:**
   - Bloodbath should establish early leaders
   - Day/Night cycle should maintain tension
   - Feast creates a spike in action
   - Arena events provide climactic moments

## Technical Implementation

The system works through:

```typescript
// Helper function in data/events.ts
export const shouldSelectFatalEvent = (phase: string): boolean => {
  const fatalChance = FATAL_EVENT_CHANCES[phase] ?? 50;
  return Math.random() * 100 < fatalChance;
};
```

And in the simulator's event selection:

```typescript
const selectFatal = shouldSelectFatalEvent(phase);
const selectedPool = selectFatal ? fatalEvents : nonFatalEvents;
const eventTemplate = selectedPool[Math.floor(Math.random() * selectedPool.length)];
```

## Version History

- **v1.0:** Initial implementation with configurable fatal event chances
  - 5 configurable game phases
  - Separate fatal/non-fatal event pools
  - Default percentages based on original event distribution analysis

## Questions & Troubleshooting

**Q: Why doesn't every event get selected with equal probability?**
A: Because events are weighted by the fatal chance percentage, not individual event probability. This means non-fatal events can appear multiple times even at high fatal percentages.

**Q: Can I set a percentage to 0 or 100?**
A: Yes! 0 = only non-fatal events, 100 = only fatal events. However, the simulator will fall back to any available event if only one type exists.

**Q: How does this affect arena events?**
A: Arena events use the same system. Since arena events aren't explicitly separated into fatal/non-fatal by category, the distribution depends on the individual scenarios (e.g., "Wolf mutts... survives" vs "Wolf mutts... is eaten").
