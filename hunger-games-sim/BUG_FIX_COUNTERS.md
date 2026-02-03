# Bug Fix: Incremental Counter Updates - February 2, 2026

## ✅ Bug Fixed!

Fixed the Alive and Fallen counters to update incrementally as each event is shown, rather than showing the final results immediately.

---

## 🐛 The Bug

**Issue:** When the bloodbath (or any phase) started, the Alive and Fallen counters immediately showed the final state after all events (e.g., Alive: 19, Fallen: 5), before the user had viewed any events. The counters should start at 24/0 and update incrementally as each death event is shown.

**Example of Problem:**
```
Start Bloodbath
Counters show: Alive 19, Fallen 5 ← WRONG (shows end result)
User clicks Next Event
Event 1: "Tribute A kills Tribute B"
Counters still show: Alive 19, Fallen 5 ← Already at final state
```

**Expected Behavior:**
```
Start Bloodbath
Counters show: Alive 24, Fallen 0 ← CORRECT (initial state)
User clicks Next Event
Event 1: "Tribute A kills Tribute B"
Counters now show: Alive 23, Fallen 1 ← Updates incrementally
```

---

## 🔍 Root Cause

The issue was in the event processing flow:

1. **Phase starts** → `runSimulationStep()` is called
2. **Events generated** → All events for the phase created at once
3. **Deaths applied immediately** → All deaths processed right away
4. **Store updated** → Tribute statuses changed to dead
5. **Counters query store** → Show updated counts (final state)
6. **User views events** → But deaths already applied, so counters don't change

The problem was that deaths were applied in batch when the phase started, not incrementally as events were viewed.

---

## 🔧 Solution

Changed the event processing to delay death application until each event is viewed:

### Before (Batch Processing):
```typescript
// In useGameSimulation.ts - runSimulationStep()
const result = simulatePhase(aliveTributes, currentPhase, currentDay);
addMultipleEvents(result.events);

// Apply ALL deaths immediately
result.deaths.forEach((deadTributeId) => {
  updateTributeStatus(deadTributeId, false, killedBy);
  if (event?.killer) {
    incrementKills(event.killer);
  }
});
```

### After (Incremental Processing):
```typescript
// In useGameSimulation.ts - runSimulationStep()
const result = simulatePhase(aliveTributes, currentPhase, currentDay);
addMultipleEvents(result.events);
// NOTE: Deaths NOT applied here!

// New function to apply deaths for one event
const applyEventDeaths = (event: GameEvent) => {
  event.deaths.forEach((deadTributeId) => {
    updateTributeStatus(deadTributeId, false, killedBy);
    if (event.killer) {
      incrementKills(event.killer);
    }
  });
};

// In GameEngineExample.tsx - handleNextEvent()
const handleNextEvent = () => {
  // Apply deaths for CURRENT event before moving to next
  if (currentEventIndex < phaseEvents.length) {
    const currentEvent = phaseEvents[currentEventIndex];
    if (currentEvent && currentEvent.deaths.length > 0) {
      applyEventDeaths(currentEvent);
    }
  }
  
  // Then advance to next event
  setCurrentEventIndex(currentEventIndex + 1);
};
```

---

## 📁 Files Modified

```
hunger-games-sim/
├── hooks/
│   └── useGameSimulation.ts     ✏️ MODIFIED
└── components/
    └── GameEngineExample.tsx    ✏️ MODIFIED
```

---

## 🔄 New Flow

### Phase Initialization:
1. User clicks "Begin" or phase auto-starts
2. `runSimulationStep()` generates all events
3. Events stored in `phaseEvents` array
4. **Deaths NOT applied yet**
5. Counters show: Alive 24, Fallen 0 ✅

### Event-by-Event Display:
1. User views Event 1 (on screen)
2. User clicks "Next Event"
3. `handleNextEvent()` called:
   - **Apply deaths from Event 1** ← NEW STEP
   - Move to Event 2
   - Counters update: Alive 23, Fallen 1 ✅
4. User views Event 2 (on screen)
5. User clicks "Next Event"
6. `handleNextEvent()` called:
   - **Apply deaths from Event 2** ← NEW STEP
   - Move to Event 3
   - Counters update: Alive 22, Fallen 2 ✅
7. Repeat until all events shown

---

## 🎯 Key Changes

### 1. Modified `runSimulationStep()` (useGameSimulation.ts)
- **Removed:** Death processing loop
- **Kept:** Event generation and phase advancement
- **Added:** Comment noting deaths applied elsewhere

### 2. Modified `triggerFeast()` (useGameSimulation.ts)
- **Removed:** Death processing loop
- **Kept:** Event generation and phase advancement

### 3. Modified `triggerArena()` (useGameSimulation.ts)
- **Removed:** Death processing loop
- **Kept:** Event generation and phase advancement

### 4. Added `applyEventDeaths()` (useGameSimulation.ts)
- **New function** to process deaths for a single event
- Takes a `GameEvent` parameter
- Updates tribute status for each death
- Increments killer's kill count
- Checks for winner after deaths applied

### 5. Modified `handleNextEvent()` (GameEngineExample.tsx)
- **Added:** Call to `applyEventDeaths()` before advancing index
- **Timing:** Applies deaths for current event, then moves to next
- **Result:** Counters update after user sees each death event

---

## 🧪 Testing

### Test Case 1: Bloodbath
```
✅ Start: Alive 24, Fallen 0
✅ Event 1 (death): Alive 23, Fallen 1
✅ Event 2 (no death): Alive 23, Fallen 1
✅ Event 3 (death): Alive 22, Fallen 2
✅ Final: Correct final counts
```

### Test Case 2: Multiple Deaths in One Event
```
✅ Event: "Tribute A, B, and C work together to kill D"
✅ Before Next: Shows pre-death counts
✅ After Next: Updates by 1 (only D dies)
✅ Correct behavior
```

### Test Case 3: Day/Night Cycles
```
✅ Each phase starts with current counts
✅ Counts update as events shown
✅ Summary shows correct counts
✅ Next phase continues from last count
```

---

## 💡 Technical Details

### Event Death Data Structure
Each `GameEvent` contains:
```typescript
{
  id: string,
  text: string,
  tributes: string[],      // IDs of tributes involved
  deaths: string[],         // IDs of tributes who died
  killer: string | undefined, // ID of killer if applicable
  // ... other fields
}
```

### Timing Sequence
```
User Action          System Action              Counter State
───────────────────────────────────────────────────────────────
[View Event 1]       Display event text         Alive 24, Fallen 0
[Click Next]    →    Apply Event 1 deaths   →   Alive 23, Fallen 1
[View Event 2]       Display event text         Alive 23, Fallen 1
[Click Next]    →    Apply Event 2 deaths   →   Alive 22, Fallen 2
[View Event 3]       Display event text         Alive 22, Fallen 2
...
```

### Store Update Pattern
```typescript
// Event displayed (no changes)
getAliveTributes().length  // Returns current state

// User clicks Next
applyEventDeaths(currentEvent)
  ├─ updateTributeStatus(id, false) // Mark dead
  ├─ incrementKills(killerId)       // Add kill
  └─ Store triggers re-render

// Component re-renders
getAliveTributes().length  // Returns updated state
getDeadTributes().length   // Returns updated state
```

---

## 📊 Impact

### Before Fix:
- ❌ Counters showed final state immediately
- ❌ No feedback on death count per event
- ❌ Felt like deaths already happened
- ❌ Less dramatic/engaging

### After Fix:
- ✅ Counters start at initial state (24/0)
- ✅ Update incrementally with each death
- ✅ User sees impact of each event
- ✅ More dramatic and engaging
- ✅ Better game flow and feedback

---

## 🎉 Summary

The Alive and Fallen counters now update correctly as each event is shown:

1. **Phase Start:** Counters show current state (e.g., 24 alive, 0 fallen)
2. **Event Displayed:** User sees event text, counters unchanged
3. **User Clicks Next:** Deaths applied, counters update
4. **Next Event Displayed:** User sees new event, updated counters
5. **Repeat:** Process continues until all events shown

This provides better user feedback and makes the game progression feel more natural and dramatic.

**The counter bug is now fixed!** 🎯

---

**Last Updated:** February 2, 2026
