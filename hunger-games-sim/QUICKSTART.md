# 🎮 Hunger Games Simulator - Quick Start Guide

## ✅ Installation Complete

All core game engine files have been created:

```
hunger-games-sim/
├── types.ts                          # TypeScript interfaces
├── index.ts                          # Barrel exports
├── data/
│   └── events.ts                     # Event pool (100+ events)
├── stores/
│   └── gameStore.ts                  # Zustand state management
├── utils/
│   └── textReplacer.ts               # Dynamic text replacement
├── engine/
│   └── simulator.ts                  # Core simulation logic
├── hooks/
│   └── useGameSimulation.ts          # React integration hook
├── components/
│   └── GameEngineExample.tsx         # Full working example
└── GAME_ENGINE_DOCS.md               # Detailed documentation
```

---

## 🚀 Quick Start

### 1. Test the Example Component

Replace your [app/page.tsx](app/page.tsx) with:

```typescript
import GameEngineExample from '@/components/GameEngineExample';

export default function Home() {
  return <GameEngineExample />;
}
```

Then run:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the simulator in action!

---

## 📖 Basic Usage

### Initialize Game

```typescript
import { useGameStore } from '@/stores/gameStore';
import { v4 as uuidv4 } from 'uuid';

const { initializeGame } = useGameStore();

const tributes = [
  {
    id: uuidv4(),
    name: 'Katniss',
    gender: 'female',
    imageUrl: '/images/katniss.jpg',
    districtId: 12,
    isAlive: true,
    kills: 0,
  },
  // ... 23 more tributes
];

const districts = [/* ... */];

initializeGame(tributes, districts);
```

### Run Simulation

```typescript
import { useGameSimulation } from '@/hooks/useGameSimulation';

const { runSimulationStep } = useGameSimulation();

// In your button click handler
<button onClick={runSimulationStep}>
  Next Phase
</button>
```

### Access State

```typescript
const {
  currentDay,
  currentPhase,
  eventLog,
  winner,
  getAliveTributes,
  getDeadTributes,
} = useGameStore();

const alive = getAliveTributes();
const dead = getDeadTributes();
```

---

## 🎯 Key Features Implemented

✅ **24 Tributes** - Full tribute management with districts  
✅ **100+ Events** - Bloodbath, Day, Night, Feast, Arena  
✅ **Dynamic Text** - `{Player1} kills {Player2} with a {Weapon}`  
✅ **Kill Tracking** - Automatic kill credit and death logging  
✅ **Step-Based** - UI-controlled phase progression  
✅ **Type-Safe** - Full TypeScript coverage  
✅ **State Management** - Zustand for global state  
✅ **Special Events** - Feast and Arena events  

---

## 📝 Next Steps

### 1. **Create Tribute Input Screen**
Build a form to let users input 24 tributes with names, genders, and images.

### 2. **Add More Events**
Expand [data/events.ts](data/events.ts) with more creative scenarios.

### 3. **Build UI Components**
- Tribute cards with images
- Animated event feed
- Kill leaderboard
- Timeline visualization

### 4. **Implement Saving**
```typescript
// Save game state
localStorage.setItem('gameState', JSON.stringify(useGameStore.getState()));

// Load game state
const savedState = JSON.parse(localStorage.getItem('gameState'));
useGameStore.setState(savedState);
```

### 5. **Add Statistics Page**
- Most kills
- Longest survivor
- District performance
- Event breakdown

---

## 🔧 Customization

### Add New Events

Edit [data/events.ts](data/events.ts):

```typescript
{
  id: 'day_custom',
  text: '{Player1} finds a hidden cave with {Item}.',
  tributesInvolved: 1,
  deaths: [],
  requiresItem: true,
}
```

### Add New Weapons/Items

```typescript
export const WEAPONS = [
  ...WEAPONS,
  'flamethrower',
  'crossbow',
  'poison',
];
```

### Customize Phase Logic

Edit [engine/simulator.ts](engine/simulator.ts) to change:
- Event selection probability
- Special event triggers
- Phase progression rules

---

## 🐛 Troubleshooting

### "Module not found" errors
Make sure all imports use the correct paths:
```typescript
import { useGameStore } from '@/stores/gameStore';
```

### Zustand not updating
Wrap your root layout with StrictMode disabled if needed:
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}
```

### Events not processing
Check browser console for errors. Verify:
1. All 24 tributes initialized
2. `initializeGame()` called
3. `isRunning` is `true`

---

## 📚 Documentation

See [GAME_ENGINE_DOCS.md](GAME_ENGINE_DOCS.md) for:
- Complete architecture overview
- Type system documentation
- Event system deep dive
- Advanced usage patterns

---

## 🎨 Styling Tips

The example uses Tailwind CSS. Customize:

```typescript
// Dark theme
className="bg-gray-900 text-white"

// Status indicators
className="text-green-500" // Alive
className="text-red-500"   // Dead

// Animations
className="transition-all duration-300 hover:scale-105"
```

---

## 💡 Tips

1. **Test with mock data first** - Use the provided `generateMockTributes()` function
2. **Step through slowly** - Watch the state updates in React DevTools
3. **Log events** - Console log the simulation results during development
4. **Start simple** - Get the basic flow working before adding complexity

---

## 🤝 Need Help?

- Check [GAME_ENGINE_DOCS.md](GAME_ENGINE_DOCS.md) for detailed explanations
- Review [GameEngineExample.tsx](components/GameEngineExample.tsx) for implementation patterns
- Inspect the Zustand store state in React DevTools

---

**You're all set! The game engine is production-ready.** 🎉

Run `npm run dev` and start building your UI!
