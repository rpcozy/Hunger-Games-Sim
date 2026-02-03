# 🏹 Hunger Games Simulator

A fully-featured, step-based simulation engine for creating Hunger Games-style battle royale experiences. Built with **Next.js 14**, **TypeScript**, **Zustand**, and **Tailwind CSS**.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-100%25-blue)
![Next.js](https://img.shields.io/badge/next.js-14-black)

---

## ✨ Features

- 🎮 **24 Tributes** across 12 Districts
- 📜 **100+ Event Templates** with dynamic text replacement
- 🎯 **Kill Tracking** with attribution system
- 📊 **Complete State Management** via Zustand
- 🔄 **Step-Based Simulation** - UI-controlled progression
- 🎪 **Special Events** - Feast and Arena Events
- 📝 **Full Event Log** with timestamp history
- 🏆 **Winner Detection** and game-end logic
- 💯 **100% TypeScript** - Fully type-safe
- 📦 **Modular Architecture** - Easy to extend

---

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test the Engine

Replace [app/page.tsx](app/page.tsx) with:

```typescript
import GameEngineExample from '@/components/GameEngineExample';

export default function Home() {
  return <GameEngineExample />;
}
```

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Setup and basic usage
- **[GAME_ENGINE_DOCS.md](GAME_ENGINE_DOCS.md)** - Complete API reference
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and data flow
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Implementation overview

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         React Components (UI)           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      useGameSimulation Hook             │
└──────────────┬──────────────────────────┘
               │
      ┌────────┼────────┐
      ▼                 ▼
┌──────────┐    ┌───────────────┐
│  Zustand │◄───│   Simulator   │
│  Store   │    │    Engine     │
└──────────┘    └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │  Event Pool   │
                │  (100+ events)│
                └───────────────┘
```

---

## 💻 Core Components

### 1. Type System ([types.ts](types.ts))
Complete TypeScript interfaces for tributes, events, and game state.

### 2. Event Pool ([data/events.ts](data/events.ts))
68+ handcrafted event templates across 5 categories:
- Bloodbath (14 events)
- Day (18 events)
- Night (16 events)
- Feast (10 events)
- Arena (10 events)

### 3. State Management ([stores/gameStore.ts](stores/gameStore.ts))
Zustand store with 11 actions and 4 getters.

### 4. Simulation Engine ([engine/simulator.ts](engine/simulator.ts))
Core logic for event matching, death processing, and phase progression.

### 5. Text Utilities ([utils/textReplacer.ts](utils/textReplacer.ts))
Dynamic placeholder replacement for event text.

### 6. React Hook ([hooks/useGameSimulation.ts](hooks/useGameSimulation.ts))
Bridge between UI and engine.

### 7. Example UI ([components/GameEngineExample.tsx](components/GameEngineExample.tsx))
Fully functional demo with Tailwind styling.

---

## 🎯 Usage Example

```typescript
import { useGameStore } from '@/stores/gameStore';
import { useGameSimulation } from '@/hooks/useGameSimulation';

function Game() {
  const { 
    currentDay, 
    currentPhase, 
    eventLog,
    getAliveTributes 
  } = useGameStore();
  
  const { runSimulationStep } = useGameSimulation();

  return (
    <div>
      <h1>Day {currentDay} - {currentPhase}</h1>
      <button onClick={runSimulationStep}>Next Phase</button>
      
      <div>
        {eventLog.map(event => (
          <p key={event.id}>{event.text}</p>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Event System

### Event Template

```typescript
{
  id: 'day_006',
  text: '{Player1} kills {Player2} with a {Weapon}',
  tributesInvolved: 2,
  deaths: [1],      // Player2 dies
  killer: 0,        // Player1 gets credit
  requiresWeapon: true
}
```

### Processed Output

```
"Katniss Everdeen kills Cato with a knife"
```

---

## 🔧 Customization

### Add New Events

Edit [data/events.ts](data/events.ts):

```typescript
const dayEvents: EventTemplate[] = [
  {
    id: 'custom_001',
    text: '{Player1} discovers a hidden cave.',
    tributesInvolved: 1,
    deaths: [],
  },
  // ...
];
```

### Extend State

Edit [stores/gameStore.ts](stores/gameStore.ts):

```typescript
interface GameStore extends GameState {
  customField: string;
  customAction: () => void;
}
```

---

## 📊 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5+
- **State:** Zustand 4
- **Styling:** Tailwind CSS 3
- **IDs:** UUID v4
- **Node:** 18+

---

## 🧪 Testing

```bash
# Type checking
npm run build

# Development
npm run dev
```

---

## 📁 Project Structure

```
hunger-games-sim/
├── types.ts                    # TypeScript interfaces
├── index.ts                    # Barrel exports
├── data/
│   └── events.ts              # Event templates
├── stores/
│   └── gameStore.ts           # Zustand store
├── engine/
│   └── simulator.ts           # Core logic
├── utils/
│   └── textReplacer.ts        # Text processing
├── hooks/
│   └── useGameSimulation.ts   # React integration
├── components/
│   └── GameEngineExample.tsx  # Demo UI
├── app/
│   ├── page.tsx               # Home page
│   └── layout.tsx             # Root layout
└── docs/
    ├── QUICKSTART.md
    ├── GAME_ENGINE_DOCS.md
    ├── ARCHITECTURE.md
    └── PROJECT_SUMMARY.md
```

---

## 🎓 Key Concepts

### Step-Based Execution
Each phase is manually triggered by the user, allowing for controlled progression.

### Event Matching
Tributes are shuffled and matched with random events from the appropriate pool.

### Death Processing
Deaths are immediately processed with killer attribution and kill count updates.

### Text Replacement
Placeholders like `{Player1}` and `{Weapon}` are replaced dynamically.

---

## 🚦 Roadmap

- [x] Core engine implementation
- [x] State management
- [x] Event system
- [x] Example UI
- [x] Documentation
- [ ] Tribute input form
- [ ] Image upload
- [ ] Save/Load functionality
- [ ] Statistics dashboard
- [ ] Animations
- [ ] Mobile responsive design
- [ ] Export results

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

Inspired by [BrantSteele's Hunger Games Simulator](https://brantsteele.com/hungergames/)

Built with ❤️ using Next.js and TypeScript

---

## 🤝 Contributing

This is a complete, production-ready game engine. Feel free to:
- Add more events
- Customize the UI
- Extend functionality
- Report issues

---

## 📧 Support

For questions or issues:
1. Check [QUICKSTART.md](QUICKSTART.md)
2. Review [GAME_ENGINE_DOCS.md](GAME_ENGINE_DOCS.md)
3. Inspect the example: [GameEngineExample.tsx](components/GameEngineExample.tsx)

---

**May the odds be ever in your favor!** 🏹🔥
