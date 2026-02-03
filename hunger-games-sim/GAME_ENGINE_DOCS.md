# Hunger Games Simulator - Game Engine Documentation

## Architecture Overview

This game engine is built with a **modular, step-based architecture** that separates data from logic for clean, maintainable code.

### Core Components

1. **Type Definitions** (`types.ts`)
2. **Event Data Pool** (`data/events.ts`)
3. **State Management** (`stores/gameStore.ts`)
4. **Text Utilities** (`utils/textReplacer.ts`)
5. **Simulation Engine** (`engine/simulator.ts`)
6. **Integration Hook** (`hooks/useGameSimulation.ts`)

---

## 📋 Type System

### Key Interfaces

```typescript
Tribute {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  imageUrl: string
  districtId: number
  isAlive: boolean
  kills: number
  deathDay?: number
  deathPhase?: GamePhase
  killedBy?: string
}

EventTemplate {
  id: string
  text: string // With placeholders: {Player1}, {Weapon}, etc.
  tributesInvolved: number
  deaths: number[] // Indices of tributes who die
  killer?: number // Index of killer (-1 for environmental)
}

GameEvent {
  id: string
  day: number
  phase: GamePhase
  text: string // Processed with actual names
  tributes: string[] // IDs
  deaths: string[] // IDs
  killer?: string // ID
  timestamp: Date
}
```

---

## 🎮 Game Flow

### Phase Progression

```
Setup → Bloodbath → Day 1 → Night 1 → Day 2 → Night 2 → ... → Finished
                      ↑                                    ↓
                      └────── Feast / Arena Event ────────┘
```

---

## 🔧 Usage Example

### 1. Initialize the Game

```typescript
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from './stores/gameStore';
import { Tribute, District } from './types';

// Create tributes
const tributes: Tribute[] = [
  {
    id: uuidv4(),
    name: 'Katniss Everdeen',
    gender: 'female',
    imageUrl: '/images/katniss.jpg',
    districtId: 12,
    isAlive: true,
    kills: 0,
  },
  {
    id: uuidv4(),
    name: 'Peeta Mellark',
    gender: 'male',
    imageUrl: '/images/peeta.jpg',
    districtId: 12,
    isAlive: true,
    kills: 0,
  },
  // ... 22 more tributes
];

// Create districts
const districts: District[] = [
  {
    id: 1,
    tribute1: tributes[0],
    tribute2: tributes[1],
  },
  // ... 11 more districts
];

// Initialize
const { initializeGame } = useGameStore();
initializeGame(tributes, districts);
```

### 2. Run Simulation Steps

```typescript
'use client';

import { useGameSimulation } from './hooks/useGameSimulation';
import { useGameStore } from './stores/gameStore';

export default function GameController() {
  const { runSimulationStep } = useGameSimulation();
  const { currentPhase, currentDay, eventLog, winner } = useGameStore();

  const handleNextStep = () => {
    runSimulationStep();
  };

  return (
    <div>
      <h2>Day {currentDay} - {currentPhase}</h2>
      <button onClick={handleNextStep}>Next Phase</button>
      
      {winner && <h1>Winner: {winner.name}!</h1>}
      
      <div className="event-log">
        {eventLog.map((event) => (
          <p key={event.id}>{event.text}</p>
        ))}
      </div>
    </div>
  );
}
```

### 3. Display Tribute Status

```typescript
const { tributes, getAliveTributes, getDeadTributes } = useGameStore();

const aliveTributes = getAliveTributes();
const deadTributes = getDeadTributes();

return (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <h3>Alive ({aliveTributes.length})</h3>
      {aliveTributes.map(tribute => (
        <div key={tribute.id} className="tribute-card">
          <img src={tribute.imageUrl} alt={tribute.name} />
          <p>{tribute.name}</p>
          <p>District {tribute.districtId}</p>
          <p>Kills: {tribute.kills}</p>
        </div>
      ))}
    </div>
    
    <div>
      <h3>Fallen ({deadTributes.length})</h3>
      {deadTributes.map(tribute => (
        <div key={tribute.id} className="tribute-card dead">
          <img src={tribute.imageUrl} alt={tribute.name} />
          <p>{tribute.name}</p>
          <p>Day {tribute.deathDay} - {tribute.deathPhase}</p>
        </div>
      ))}
    </div>
  </div>
);
```

---

## 🎯 Event System

### How Events Work

1. **Shuffling**: Alive tributes are shuffled randomly
2. **Event Selection**: Random event template picked from pool
3. **Matching**: Tributes assigned to event based on `tributesInvolved`
4. **Processing**: Placeholders replaced with actual names
5. **State Update**: Deaths recorded, kills incremented

### Event Template Example

```typescript
{
  id: 'day_006',
  text: '{Player1} stabs {Player2} in the back with a {Weapon}.',
  tributesInvolved: 2,
  deaths: [1], // Player2 (index 1) dies
  killer: 0, // Player1 (index 0) gets the kill
  requiresWeapon: true,
}
```

### Processed Output

```
"Katniss Everdeen stabs Cato in the back with a knife."
```

---

## 🎲 Special Events

### Feast

- Triggered after Day 3
- 20% chance per day
- High-stakes supply gathering

```typescript
const { triggerFeast } = useGameSimulation();
triggerFeast();
```

### Arena Events

- Triggered after Day 2
- 15-25% chance (based on alive count)
- Environmental hazards

```typescript
const { triggerArena } = useGameSimulation();
triggerArena();
```

---

## 📊 State Management (Zustand)

### Available Actions

```typescript
const store = useGameStore();

// Setup
store.initializeGame(tributes, districts);

// Queries
store.getAliveTributes();
store.getDeadTributes();
store.getTributeById(id);
store.getDistrictTributes(districtId);

// Updates
store.updateTributeStatus(id, false, 'killerName');
store.incrementKills(id);
store.addEvent(event);
store.advancePhase('night', 2);
store.setWinner(tribute);
store.resetGame();
```

---

## 🔍 Key Features

✅ **Modular Design**: Separate data, logic, and state  
✅ **Type Safety**: Full TypeScript coverage  
✅ **Step-Based**: UI controls progression via button clicks  
✅ **Dynamic Text**: Smart placeholder replacement  
✅ **Kill Tracking**: Automatic death/kill logging  
✅ **Special Events**: Feast and Arena event triggers  
✅ **Persistent State**: Zustand handles all game state  

---

## 🚀 Next Steps

1. **Add more events** to `data/events.ts`
2. **Build UI components** for tribute cards, event feed
3. **Implement setup screen** for inputting 24 tributes
4. **Add animations** for deaths and phase transitions
5. **Create statistics** page (kill leaderboard, timeline)
6. **Add save/load** functionality (localStorage or DB)

---

## 📝 Notes

- The engine is **deterministic within a session** but randomized per run
- Deaths are processed **immediately** after each phase
- Game ends when **≤ 1 tribute remains alive**
- All events are **logged with timestamps** for replay
- Text replacement supports **unlimited placeholders**

---

**Built with**: Next.js 14, TypeScript, Zustand, Tailwind CSS  
**Pattern**: Separation of Concerns, Event-Driven Architecture
