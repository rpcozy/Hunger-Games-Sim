/**
 * Enhanced Game Engine with User Input and Step-by-Step Events
 */

'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from '../stores/gameStore';
import { useGameSimulation } from '../hooks/useGameSimulation';
import { Tribute, District, GameEvent } from '../types';
import { shouldTriggerFeast, shouldTriggerArenaEvent } from '../engine/simulator';

type GameScreen = 'setup' | 'simulation' | 'summary' | 'final';

interface TributeInput {
  name: string;
  gender: 'male' | 'female' | 'other';
  imageUrl: string;
}


export default function GameEngineExample() {
  const {
    currentDay,
    currentPhase,
    isRunning,
    eventLog,
    winner,
    tributes,
    initializeGame,
    resetGame,
    getAliveTributes,
    getDeadTributes,
    getTributeById,
  } = useGameStore();

  const { runSimulationStep, triggerFeast, triggerArena, applyEventDeaths } = useGameSimulation();

  // UI State
  const [screen, setScreen] = useState<GameScreen>('setup');
  const [tributeInputs, setTributeInputs] = useState<TributeInput[]>(
    Array.from({ length: 24 }, () => ({
      name: '',
      gender: 'male' as const,
      imageUrl: '',
    }))
  );
  
  // Event display state
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [phaseEvents, setPhaseEvents] = useState<GameEvent[]>([]);
  const [lastProcessedEventCount, setLastProcessedEventCount] = useState(0);
  const [lastFeastDay, setLastFeastDay] = useState<number | undefined>();
  const [lastArenaDay, setLastArenaDay] = useState<number | undefined>();

  // Update events when new ones are added
  useEffect(() => {
    if (eventLog.length > lastProcessedEventCount) {
      const newEvents = eventLog.slice(lastProcessedEventCount);
      setPhaseEvents(prev => [...prev, ...newEvents]);
      setLastProcessedEventCount(eventLog.length);
    }
  }, [eventLog.length, lastProcessedEventCount]);

  // Check for winner
  useEffect(() => {
    if (winner) {
      setScreen('final');
    }
  }, [winner]);


  const handleTributeInputChange = (index: number, field: keyof TributeInput, value: string) => {
    const newInputs = [...tributeInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setTributeInputs(newInputs);
  };

  const handleStartGame = () => {
    // Validate inputs
    const validTributes = tributeInputs.filter(t => t.name.trim() !== '');
    if (validTributes.length !== 24) {
      alert('Please enter exactly 24 tribute names!');
      return;
    }

    // Create tributes
    const tributes: Tribute[] = validTributes.map((input, index) => ({
      id: uuidv4(),
      name: input.name.trim(),
      gender: input.gender,
      imageUrl: input.imageUrl.trim() || '/images/default-tribute.svg',
      districtId: Math.floor(index / 2) + 1,
      isAlive: true,
      kills: 0,
    }));

    // Create districts
    const districts: District[] = [];
    for (let i = 0; i < 12; i++) {
      districts.push({
        id: i + 1,
        tribute1: tributes[i * 2],
        tribute2: tributes[i * 2 + 1],
      });
    }

    initializeGame(tributes, districts);
    setScreen('simulation');
    setLastProcessedEventCount(0);
    setPhaseEvents([]);
    setCurrentEventIndex(0);
  };

  const handleNextEvent = () => {
    // Apply deaths for the current event BEFORE moving to next
    if (currentEventIndex < phaseEvents.length) {
      const currentEvent = phaseEvents[currentEventIndex];
      if (currentEvent && currentEvent.deaths.length > 0) {
        applyEventDeaths(currentEvent);
      }
    }

    if (currentEventIndex < phaseEvents.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    } else {
      // Check if we should show summary (after night or bloodbath)
      if (currentPhase === 'night' || currentPhase === 'bloodbath') {
        setScreen('summary');
      } else {
        // Continue to next phase
        proceedToNextPhase();
      }
    }
  };

  const proceedToNextPhase = () => {
    const aliveTributes = getAliveTributes();
    
    // Check if game is over
    if (aliveTributes.length <= 1) {
      return;
    }

    // Check for special events (automatic now)
    const shouldFeast = shouldTriggerFeast(currentDay, lastFeastDay);
    const shouldArena = shouldTriggerArenaEvent(currentDay, aliveTributes.length, lastArenaDay);

    if (shouldFeast && currentPhase === 'day') {
      setLastFeastDay(currentDay);
      triggerFeast();
    } else if (shouldArena && currentPhase === 'day') {
      setLastArenaDay(currentDay);
      triggerArena();
    } else {
      runSimulationStep();
    }

    setPhaseEvents([]);
    setCurrentEventIndex(0);
  };

  const handleContinueFromSummary = () => {
    setScreen('simulation');
    proceedToNextPhase();
  };

  const handleReset = () => {
    resetGame();
    setScreen('setup');
    setCurrentEventIndex(0);
    setPhaseEvents([]);
    setLastProcessedEventCount(0);
    setLastFeastDay(undefined);
    setLastArenaDay(undefined);
  };

  const fillMockData = () => {
    const mockNames = [
      'Katniss Everdeen', 'Peeta Mellark', 'Gale Hawthorne', 'Primrose Everdeen',
      'Finnick Odair', 'Johanna Mason', 'Rue', 'Thresh',
      'Cato', 'Clove', 'Marvel', 'Glimmer',
      'Foxface', 'Beetee', 'Wiress', 'Mags',
      'Annie Cresta', 'Haymitch Abernathy', 'Effie Trinket', 'Caesar Flickerman',
      'Seneca Crane', 'Snow', 'Coin', 'Boggs',
    ];

    const mockGenders: Array<'male' | 'female'> = [
      'female', 'male', 'male', 'female',
      'male', 'female', 'female', 'male',
      'male', 'female', 'male', 'female',
      'female', 'male', 'female', 'female',
      'female', 'male', 'female', 'male',
      'male', 'male', 'female', 'male',
    ];

    setTributeInputs(
      mockNames.map((name, index) => ({
        name,
        gender: mockGenders[index],
        imageUrl: '',
      }))
    );
  };

  // Get tributes involved in current event
  const getCurrentEventTributes = () => {
    if (currentEventIndex >= phaseEvents.length) return [];
    const event = phaseEvents[currentEventIndex];
    return event.tributes.map(id => getTributeById(id)).filter(Boolean) as Tribute[];
  };

  // Calculate placements (for final screen)
  const getFinalPlacements = () => {
    // Define phase order within a day for proper sorting
    const phaseOrder: Record<string, number> = {
      'bloodbath': 0,
      'day': 1,
      'feast': 2,
      'arena-event': 3,
      'night': 4,
    };

    return tributes
      .slice() // Create a copy to avoid mutating original array
      .sort((a, b) => {
        // Winner (alive) always comes first
        if (a.isAlive && !b.isAlive) return -1;
        if (!a.isAlive && b.isAlive) return 1;
        if (a.isAlive && b.isAlive) return 0;
        
        // Both dead - sort by death time (later deaths = better placement)
        // Compare death days first
        if (a.deathDay !== b.deathDay) {
          return (b.deathDay || 0) - (a.deathDay || 0); // Later day = comes first (better placement)
        }
        
        // Same death day - compare by phase
        const aPhaseOrder = phaseOrder[a.deathPhase || 'day'] || 0;
        const bPhaseOrder = phaseOrder[b.deathPhase || 'day'] || 0;
        return bPhaseOrder - aPhaseOrder; // Later phase in day = comes first (better placement)
      })
      .map((tribute, index) => ({
        ...tribute,
        placement: index + 1, // Sequential placement: 1st, 2nd, 3rd, etc.
      }));
  };


  // SETUP SCREEN
  if (screen === 'setup') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">Hunger Games Simulator</h1>
          <p className="text-gray-400 text-center mb-8">Enter 24 tributes to begin the games</p>
          
          <div className="mb-4 flex gap-4 justify-center">
            <button
              onClick={fillMockData}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
            >
              Fill Mock Data
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {tributeInputs.map((input, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-bold mb-2 text-gray-400">
                  District {Math.floor(index / 2) + 1} - Tribute {(index % 2) + 1}
                </h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={input.name}
                  onChange={(e) => handleTributeInputChange(index, 'name', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
                />
                <select
                  value={input.gender}
                  onChange={(e) => handleTributeInputChange(index, 'gender', e.target.value as any)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  value={input.imageUrl}
                  onChange={(e) => handleTributeInputChange(index, 'imageUrl', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleStartGame}
              className="bg-red-600 hover:bg-red-700 px-12 py-4 rounded-lg font-bold text-xl"
            >
              Start the Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SIMULATION SCREEN (showing events one by one)
  if (screen === 'simulation') {
    const currentEvent = phaseEvents[currentEventIndex];
    const eventTributes = getCurrentEventTributes();
    const hasMoreEvents = currentEventIndex < phaseEvents.length - 1;
    const isWaitingForEvents = phaseEvents.length === 0;

    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">The Hunger Games</h1>
              <p className="text-gray-400">
                Day {currentDay} - {currentPhase.toUpperCase()}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
            >
              Reset Game
            </button>
          </div>

          {/* Statistics Bar */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Alive</p>
              <p className="text-3xl font-bold text-green-500">{getAliveTributes().length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Fallen</p>
              <p className="text-3xl font-bold text-red-500">{getDeadTributes().length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Events</p>
              <p className="text-3xl font-bold text-blue-500">{eventLog.length}</p>
            </div>
          </div>

          {/* Event Display */}
          {isWaitingForEvents ? (
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <p className="text-gray-400 mb-4">Starting {currentPhase}...</p>
              <button
                onClick={proceedToNextPhase}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold"
              >
                Begin
              </button>
            </div>
          ) : currentEvent ? (
            <div className="bg-gray-800 p-8 rounded-lg">
              {/* Event Counter */}
              <div className="text-center mb-6">
                <span className="text-gray-400">
                  Event {currentEventIndex + 1} of {phaseEvents.length}
                </span>
              </div>

              {/* Tribute Images */}
              {eventTributes.length > 0 && (
                <div className="flex justify-center gap-4 mb-6">
                  {eventTributes.map((tribute) => (
                    <div key={tribute.id} className="text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-2 mx-auto">
                        <img
                          src={tribute.imageUrl}
                          alt={tribute.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/default-tribute.svg';
                          }}
                        />
                      </div>
                      <p className="text-sm font-bold">{tribute.name}</p>
                      <p className="text-xs text-gray-400">District {tribute.districtId}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Event Text */}
              <div className="text-center mb-6">
                <p className="text-xl leading-relaxed">{currentEvent.text}</p>
              </div>

              {/* Death Indicator */}
              {currentEvent.deaths.length > 0 && (
                <div className="text-center mb-6">
                  <p className="text-red-500 font-bold">
                    💀 {currentEvent.deaths.length} tribute{currentEvent.deaths.length > 1 ? 's' : ''} died
                  </p>
                </div>
              )}

              {/* Next Button */}
              <div className="text-center">
                <button
                  onClick={handleNextEvent}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold"
                >
                  {hasMoreEvents ? 'Next Event' : 'Continue'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // SUMMARY SCREEN (after each day/night cycle)
  if (screen === 'summary') {
    const aliveTributes = getAliveTributes().sort((a, b) => b.kills - a.kills);
    const deadTributes = getDeadTributes();

    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">
            End of {currentPhase === 'bloodbath' ? 'Bloodbath' : `Day ${currentDay}`}
          </h1>
          <p className="text-gray-400 text-center mb-8">Status Update</p>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Alive Tributes */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-green-500">
                Alive ({aliveTributes.length})
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {aliveTributes.map((tribute) => (
                  <div
                    key={tribute.id}
                    className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                        <img
                          src={tribute.imageUrl}
                          alt={tribute.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/default-tribute.svg';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-bold">{tribute.name}</p>
                        <p className="text-sm text-gray-400">District {tribute.districtId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-500 font-bold">💀 {tribute.kills} kills</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dead Tributes */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-red-500">
                Fallen ({deadTributes.length})
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {deadTributes.map((tribute) => (
                  <div
                    key={tribute.id}
                    className="bg-gray-800 p-4 rounded-lg flex items-center opacity-60"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                        <img
                          src={tribute.imageUrl}
                          alt={tribute.name}
                          className="w-full h-full object-cover grayscale"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/default-tribute.svg';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-bold line-through">{tribute.name}</p>
                        <p className="text-sm text-gray-400">
                          District {tribute.districtId} • Day {tribute.deathDay}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleContinueFromSummary}
              className="bg-blue-600 hover:bg-blue-700 px-12 py-4 rounded-lg font-bold text-xl"
            >
              Continue to Next Phase
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FINAL SCREEN (winner and placements)
  if (screen === 'final') {
    const placements = getFinalPlacements();
    const winnerWithCorrectKills = placements.find(t => t.isAlive); // Find winner if exists

    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Winner Banner */}
          {winnerWithCorrectKills ? (
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black p-12 rounded-lg mb-8 text-center">
              <h2 className="text-5xl font-bold mb-4">🏆 VICTOR 🏆</h2>
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-4 border-yellow-300">
                  <img
                    src={winnerWithCorrectKills.imageUrl}
                    alt={winnerWithCorrectKills.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/default-tribute.svg';
                    }}
                  />
                </div>
              </div>
              <p className="text-4xl font-bold mb-2">{winnerWithCorrectKills.name}</p>
              <p className="text-2xl mb-2">District {winnerWithCorrectKills.districtId}</p>
              <p className="text-xl">💀 {winnerWithCorrectKills.kills} Kills</p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white p-12 rounded-lg mb-8 text-center">
              <h2 className="text-5xl font-bold mb-4">💀 NO VICTOR 💀</h2>
              <p className="text-2xl">All tributes have fallen. There is no winner.</p>
            </div>
          )}

          {/* Final Placements */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Final Placements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placements.map((tribute, index) => (
                <div
                  key={tribute.id}
                  className={`p-4 rounded-lg flex items-center gap-4 ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-black'
                      : index === 2
                      ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white'
                      : 'bg-gray-800'
                  }`}
                >
                  <div className="text-3xl font-bold w-12 text-center">
                    {tribute.placement}
                  </div>
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                    <img
                      src={tribute.imageUrl}
                      alt={tribute.name}
                      className={`w-full h-full object-cover ${!tribute.isAlive ? 'grayscale' : ''}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default-tribute.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{tribute.name}</p>
                    <p className="text-sm opacity-75">District {tribute.districtId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">💀 {tribute.kills}</p>
                    <p className="text-sm opacity-75">kills</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 px-12 py-4 rounded-lg font-bold text-xl"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
