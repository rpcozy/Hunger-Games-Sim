# 🏗️ Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (React Components)                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    useGameSimulation Hook                       │
│  ┌───────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ runSimulation │  │ triggerFeast │  │ triggerArenaEvent │   │
│  │     Step      │  │              │  │                   │   │
│  └───────────────┘  └──────────────┘  └───────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                                 ▼
┌─────────────────────┐          ┌─────────────────────┐
│   Zustand Store     │          │  Simulation Engine  │
│   (gameStore.ts)    │          │   (simulator.ts)    │
│                     │          │                     │
│ • Game State        │◄─────────┤ • simulatePhase()   │
│ • Tributes          │          │ • processEvent()    │
│ • Event Log         │          │ • shuffleArray()    │
│ • Actions           │          │                     │
└──────────┬──────────┘          └──────────┬──────────┘
           │                                │
           │                                ▼
           │                     ┌─────────────────────┐
           │                     │  Text Replacer      │
           │                     │ (textReplacer.ts)   │
           │                     │                     │
           │                     │ • Placeholder       │
           │                     │   replacement       │
           │                     │ • {Player1} →       │
           │                     │   "Katniss"         │
           │                     └──────────┬──────────┘
           │                                │
           ▼                                ▼
┌─────────────────────────────────────────────────────┐
│                   Data Layer                        │
│                  (events.ts)                        │
│                                                     │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Bloodbath   │  │   Day    │  │    Night     │  │
│  │   Events    │  │  Events  │  │   Events     │  │
│  └─────────────┘  └──────────┘  └──────────────┘  │
│                                                     │
│  ┌─────────────┐  ┌──────────┐                     │
│  │   Feast     │  │  Arena   │                     │
│  │   Events    │  │  Events  │                     │
│  └─────────────┘  └──────────┘                     │
│                                                     │
│  ┌─────────────┐  ┌──────────┐                     │
│  │  WEAPONS    │  │  ITEMS   │                     │
│  └─────────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Clicks "Next Phase"

```
UI Component
    │
    ▼
useGameSimulation.runSimulationStep()
    │
    ├──► Get alive tributes from Store
    │
    ▼
simulatePhase(tributes, phase, day)
    │
    ├──► Shuffle tributes
    ├──► Select random events
    ├──► Match tributes to events
    ├──► Process text placeholders
    │
    ▼
Return: SimulationStepResult
    │
    ▼
useGameSimulation
    │
    ├──► Update tribute status (deaths)
    ├──► Increment kill counts
    ├──► Add events to log
    ├──► Advance phase
    │
    ▼
Zustand Store Updated
    │
    ▼
React Re-renders UI
```

---

## Component Hierarchy

```
App
 └─ GameEngineExample
     ├─ Game Header
     │   ├─ Day/Phase Display
     │   └─ Reset Button
     │
     ├─ Winner Banner (conditional)
     │
     ├─ Control Panel
     │   ├─ Next Phase Button
     │   ├─ Trigger Feast Button
     │   └─ Trigger Arena Button
     │
     ├─ Statistics Cards
     │   ├─ Alive Count
     │   ├─ Dead Count
     │   └─ Event Count
     │
     ├─ Tributes Grid
     │   ├─ Alive Tributes List
     │   │   └─ Tribute Cards
     │   │
     │   └─ Dead Tributes List
     │       └─ Tribute Cards (faded)
     │
     └─ Event Log
         └─ Event Items (scrollable)
```

---

## State Structure

```typescript
GameState {
  // Metadata
  currentDay: number          // 0, 1, 2, ...
  currentPhase: GamePhase     // 'bloodbath', 'day', 'night', etc.
  isRunning: boolean          // true during active game
  
  // Entities
  tributes: Tribute[] {
    id: string
    name: string
    gender: 'male' | 'female' | 'other'
    imageUrl: string
    districtId: 1-12
    isAlive: boolean
    kills: number
    deathDay?: number
    deathPhase?: GamePhase
    killedBy?: string
  }
  
  districts: District[] {
    id: 1-12
    tribute1: Tribute
    tribute2: Tribute
  }
  
  // History
  eventLog: GameEvent[] {
    id: string
    day: number
    phase: GamePhase
    text: string              // "Katniss kills Cato"
    tributes: string[]        // IDs involved
    deaths: string[]          // IDs who died
    killer?: string           // ID of killer
    timestamp: Date
  }
  
  // Result
  winner?: Tribute
}
```

---

## Event Processing Pipeline

```
1. EVENT TEMPLATE (Static Data)
   ┌──────────────────────────────────────────┐
   │ {                                        │
   │   text: "{Player1} kills {Player2}"      │
   │   tributesInvolved: 2                    │
   │   deaths: [1]                            │
   │   killer: 0                              │
   │ }                                        │
   └──────────────────────────────────────────┘
                      │
                      ▼
2. TRIBUTE MATCHING
   ┌──────────────────────────────────────────┐
   │ Shuffle alive tributes                   │
   │ Take first 2:                            │
   │   [Katniss, Cato]                        │
   └──────────────────────────────────────────┘
                      │
                      ▼
3. TEXT REPLACEMENT
   ┌──────────────────────────────────────────┐
   │ Replace placeholders:                    │
   │   {Player1} → "Katniss"                  │
   │   {Player2} → "Cato"                     │
   └──────────────────────────────────────────┘
                      │
                      ▼
4. GAME EVENT (Runtime Data)
   ┌──────────────────────────────────────────┐
   │ {                                        │
   │   text: "Katniss kills Cato"             │
   │   tributes: [uuid1, uuid2]               │
   │   deaths: [uuid2]                        │
   │   killer: uuid1                          │
   │   day: 2                                 │
   │   phase: "day"                           │
   │ }                                        │
   └──────────────────────────────────────────┘
                      │
                      ▼
5. STATE UPDATE
   ┌──────────────────────────────────────────┐
   │ • Cato.isAlive = false                   │
   │ • Cato.killedBy = "Katniss"              │
   │ • Katniss.kills++                        │
   │ • eventLog.push(event)                   │
   └──────────────────────────────────────────┘
```

---

## File Dependency Graph

```
types.ts
   │
   ├──► events.ts (uses EventTemplate)
   │
   ├──► gameStore.ts (uses Tribute, GameState)
   │       │
   │       └──► useGameSimulation.ts
   │                  │
   │                  └──► GameEngineExample.tsx
   │
   ├──► simulator.ts (uses all types)
   │       │
   │       └──► useGameSimulation.ts
   │
   └──► textReplacer.ts (uses Tribute)
           │
           └──► simulator.ts
```

---

## Phase Progression Logic

```
            ┌─────────────┐
            │    SETUP    │
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
            │  BLOODBATH  │  (Day 0)
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
       ┌────┤     DAY     │  (Day 1+)
       │    └──────┬──────┘
       │           │
       │           ▼
       │    ┌─────────────┐
       │    │    NIGHT    │
       │    └──────┬──────┘
       │           │
       │           ▼
       │    ┌─────────────┐
       │    │  Next Day   │
       │    └──────┬──────┘
       │           │
       └───────────┘
              │
              │ (Random Triggers)
              │
              ├──► FEAST (20% after day 3)
              │
              └──► ARENA EVENT (15-25% after day 2)
                   
                   │
                   ▼
            ┌─────────────┐
            │  ≤1 ALIVE?  │
            └──────┬──────┘
                   │
                   ▼
            ┌─────────────┐
            │  FINISHED   │
            └─────────────┘
```

---

## Key Design Patterns

### 1. **Separation of Concerns**
- Data (events.ts) ≠ Logic (simulator.ts) ≠ State (gameStore.ts)

### 2. **Factory Pattern**
- EventTemplate → GameEvent conversion

### 3. **Observer Pattern**
- Zustand store notifies React components

### 4. **Strategy Pattern**
- Different event pools for different phases

### 5. **Immutability**
- State updates create new objects

---

## Performance Considerations

```
✅ Efficient Shuffling: O(n) Fisher-Yates
✅ No Nested Loops: Linear event processing
✅ Immutable Updates: React optimization
✅ Memoization Ready: Pure functions in engine
✅ Lazy Evaluation: Events processed on-demand
```

---

## Testing Strategy

### Unit Tests
- `simulator.ts`: Event matching logic
- `textReplacer.ts`: Placeholder replacement
- `gameStore.ts`: State mutations

### Integration Tests
- `useGameSimulation.ts`: Hook behavior
- Event flow: Template → Process → State

### E2E Tests
- Complete game simulation
- Winner determination
- Phase progression

---

**This architecture ensures:**
- ✅ Maintainability
- ✅ Scalability
- ✅ Testability
- ✅ Type Safety
- ✅ Performance
