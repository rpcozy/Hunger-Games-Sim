# 🔧 Placement Logic Fix

## Issue Identified

The final placement screen was showing **duplicate placement numbers** (multiple tributes at 6th place, 9th place, etc.) instead of unique sequential rankings from 1st to 24th.

## Root Cause

The original logic attempted to calculate placements by counting how many tributes died after each tribute:

```typescript
// ❌ ORIGINAL (BUGGY)
placement: tribute.isAlive ? 1 : (24 - getDeadTributes().filter(t => 
  t.deathDay! > tribute.deathDay! || 
  (t.deathDay === tribute.deathDay && t.deathPhase! > tribute.deathPhase!)
).length)
```

**Problems:**
1. Phase comparison was imprecise (comparing strings directly)
2. Tie-breaking logic was flawed
3. Could produce duplicate placements when multiple tributes died in the same phase

## Solution

Rewrote the placement logic to properly **sort all tributes** and assign **sequential placements**:

```typescript
// ✅ FIXED
const getFinalPlacements = () => {
  // Define phase order within a day
  const phaseOrder: Record<string, number> = {
    'bloodbath': 0,
    'day': 1,
    'feast': 2,
    'arena-event': 3,
    'night': 4,
  };

  return tributes
    .slice() // Don't mutate original
    .sort((a, b) => {
      // 1. Alive tribute always ranks first
      if (a.isAlive && !b.isAlive) return -1;
      if (!a.isAlive && b.isAlive) return 1;
      
      // 2. Both dead: later death = better placement
      if (a.deathDay !== b.deathDay) {
        return (b.deathDay || 0) - (a.deathDay || 0);
      }
      
      // 3. Same day: later phase = better placement
      const aPhaseOrder = phaseOrder[a.deathPhase || 'day'] || 0;
      const bPhaseOrder = phaseOrder[b.deathPhase || 'day'] || 0;
      return bPhaseOrder - aPhaseOrder;
    })
    .map((tribute, index) => ({
      ...tribute,
      placement: index + 1, // Sequential: 1, 2, 3, ...
    }));
};
```

## How It Works

### Step 1: Sort Tributes
1. **Alive tribute** → Comes first (1st place)
2. **Dead tributes** sorted by survival time:
   - Later death day → Better placement
   - Same day: later phase → Better placement

### Step 2: Assign Sequential Placements
- Use array index + 1
- Guaranteed unique placements: 1, 2, 3, 4, ... 24
- No duplicates possible

### Phase Order (within same day)
```
bloodbath (0) → day (1) → feast (2) → arena-event (3) → night (4)
```

Later phase = survived longer that day = better placement

## Example

Given these deaths:
- **Tribute A:** Day 3, Night
- **Tribute B:** Day 3, Day
- **Tribute C:** Day 1, Bloodbath
- **Tribute D:** Alive (Winner)

**Sorted order:**
1. Tribute D (alive) → 1st place
2. Tribute A (Day 3, Night - survived longest) → 2nd place
3. Tribute B (Day 3, Day - died earlier same day) → 3rd place
4. Tribute C (Day 1 - died first) → 4th place

## Result

✅ **1st place:** Winner (correct)  
✅ **2nd-24th place:** Unique, sequential, properly ranked by death order  
✅ **No duplicates:** Every tribute has a unique placement number

## Testing

To verify the fix:
1. Run a complete game to completion
2. Check the final placement screen
3. Verify placements go 1, 2, 3, 4, ... 24 with no duplicates
4. Confirm later deaths have better placements

---

**Status:** ✅ FIXED - Placements now correctly rank from 1st (winner) to 24th (first death) with no duplicates.
