# 🎮 Enhanced Hunger Games Simulator - User Guide

## 🚀 New Features

Your Hunger Games Simulator now includes several major enhancements for a better user experience!

---

## 📝 Feature Overview

### 1. **Character Input Screen**
- Enter 24 custom tributes with:
  - Name (required)
  - Gender (male/female/other)
  - Image URL (optional)
- Quick "Fill Mock Data" button for testing
- Visual organization by District and Tribute number

### 2. **One-by-One Event Display**
- Events are shown individually with a "Next" button
- Each event displays:
  - Event counter (e.g., "Event 5 of 12")
  - Tribute images for all participants
  - Event description
  - Death notifications
- Smooth progression through each phase

### 3. **Day/Night Summary Screens**
- After each Bloodbath, Day, and Night phase:
  - View all alive tributes sorted by kills
  - See fallen tributes with death day
  - Tribute images displayed
  - Kill counts prominently shown
- "Continue" button to proceed to next phase

### 4. **Automatic Special Events**
- **Feast**: Automatically triggers with 20% chance after Day 3
- **Arena Events**: Automatically trigger with 15-25% chance after Day 2
- No manual intervention needed

### 5. **Tribute Images in Events**
- Each event shows circular images of involved tributes
- Images displayed above event text
- Fallback to default avatar if no image provided
- Tribute names and districts shown below images

### 6. **Final Placement Screen**
- Complete rankings from 1st to 24th place
- Special styling for top 3:
  - 🥇 1st Place: Gold gradient
  - 🥈 2nd Place: Silver gradient
  - 🥉 3rd Place: Bronze gradient
- Each placement shows:
  - Rank number
  - Tribute image (grayscale for deceased)
  - Name and district
  - Total kill count
- Large victor banner at top

---

## 🎯 How to Use

### Step 1: Setup (Character Input)

1. **Enter 24 Tributes:**
   ```
   - Type names for all 24 tributes
   - Select gender for each
   - Optionally add image URLs
   ```

2. **Quick Test:**
   ```
   Click "Fill Mock Data" to auto-populate
   with Hunger Games characters
   ```

3. **Start:**
   ```
   Click "Start the Games" when ready
   ```

### Step 2: Simulation

1. **Begin Phase:**
   ```
   Click "Begin" to start the current phase
   ```

2. **Watch Events:**
   ```
   - Read each event
   - See tribute images
   - Note deaths (💀 indicator)
   - Click "Next Event" to continue
   ```

3. **Phase Progression:**
   ```
   Bloodbath → Day → Night → Day → Night...
   ```

### Step 3: Summary Screens

After each Night or Bloodbath:

1. **Review Status:**
   ```
   - Check who's alive (left column)
   - See fallen tributes (right column)
   - Note kill counts
   ```

2. **Continue:**
   ```
   Click "Continue to Next Phase"
   ```

### Step 4: Victory

When only 1 tribute remains:

1. **Winner Announcement:**
   ```
   Large banner with victor's:
   - Image
   - Name
   - District
   - Kill count
   ```

2. **View Placements:**
   ```
   Scroll to see full 1-24 rankings
   ```

3. **Start New Game:**
   ```
   Click "New Game" to play again
   ```

---

## 🖼️ Image Guidelines

### Supported Formats
- PNG, JPG, JPEG, GIF, WebP, SVG
- Direct image URLs work best

### Image URL Examples
```
✅ Good:
https://i.imgur.com/abc123.jpg
https://example.com/images/tribute.png
/local/image.jpg

❌ Won't Work:
Website page URLs (must be direct image link)
Local file paths (file:///C:/...)
```

### No Image?
- Leave URL field blank
- Default avatar (silhouette) will display
- Gray circular placeholder

### Tips for Best Results
- Use square images (1:1 ratio)
- Minimum 200x200px recommended
- Profile/headshot photos work best
- Images are displayed in circles

---

## ⚡ Special Events

### Feast Events
- **Trigger:** Day 3+
- **Chance:** 20% per eligible day
- **Cooldown:** 3 days minimum between feasts
- **Events:** High-stakes supply gathering
- **Automatic:** No user action needed

### Arena Events
- **Trigger:** Day 2+
- **Chance:** 15% (few alive) to 25% (many alive)
- **Cooldown:** 2 days minimum
- **Events:** Environmental hazards (fire, flood, etc.)
- **Automatic:** Triggered randomly when conditions met

---

## 📊 Statistics Tracking

### During Simulation
- **Alive Count:** Green counter
- **Fallen Count:** Red counter
- **Total Events:** Blue counter

### Summary Screens
- Tributes sorted by kill count
- District information
- Death day for fallen tributes

### Final Screen
- Official placements (1-24)
- Individual kill counts
- Visual distinction for top 3

---

## 🎨 Visual Enhancements

### Color Coding
- 🟢 **Green** = Alive tributes
- 🔴 **Red** = Deceased tributes
- 🟡 **Yellow/Gold** = Kill counts
- 🔵 **Blue** = Action buttons

### Special Styling
- **Winner:** Gold gradient with crown emoji
- **2nd Place:** Silver gradient
- **3rd Place:** Bronze gradient
- **Deceased:** Grayscale images, lower opacity

### Responsive Design
- Adapts to different screen sizes
- Mobile-friendly layout
- Scrollable sections for long lists

---

## 🔄 Game Flow

```
┌─────────────────┐
│  Setup Screen   │
│  (Enter 24)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Bloodbath     │
│  (Event by      │
│   Event)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Summary Screen │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Day Phase     │
│  (Event by      │
│   Event)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Night Phase    │
│  (Event by      │
│   Event)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Summary Screen │
└────────┬────────┘
         │
         ▼
    (Repeat Day/
     Night cycles
     with random
     special events)
         │
         ▼
┌─────────────────┐
│  Final Screen   │
│  (Winner &      │
│   Rankings)     │
└─────────────────┘
```

---

## 💡 Pro Tips

### 1. **Character Images**
- Use character portraits for immersion
- Keep names concise (display better)
- Mix genders for variety

### 2. **Watching Events**
- Take your time reading each event
- Watch kill counts rise
- Note alliances forming

### 3. **Summary Screens**
- Strategic pause points
- Good time to screenshot
- Track favorite tributes

### 4. **Final Analysis**
- Review full placement list
- See who got most kills
- Check which districts did best

---

## 🐛 Troubleshooting

### Images Not Loading?
- Check URL is a direct image link
- Try a different image host
- Leave blank for default avatar

### Game Not Starting?
- Ensure all 24 names are filled
- Check for error messages
- Try "Fill Mock Data" first

### Events Not Progressing?
- Click "Begin" to start phase
- Click "Next Event" for each event
- Click "Continue" on summaries

### Reset Not Working?
- Refresh page if needed
- "Reset Game" returns to setup
- All data will be cleared

---

## 📝 Notes

- **Save Feature:** Not currently available
  - Screenshot results to save
  - Take photos of placement screen
  
- **Event Pool:** 100+ unique events
  - Randomized each game
  - Different every playthrough
  
- **Kill Attribution:** Automatic
  - Deaths credited to killers
  - Environmental deaths tracked
  
- **Game Length:** Varies
  - Typically 5-8 in-game days
  - 40-60 total events

---

## 🎉 Have Fun!

Your Hunger Games Simulator is now fully featured with:
- ✅ Custom character input
- ✅ Step-by-step event viewing
- ✅ Summary screens
- ✅ Automatic special events
- ✅ Tribute images in events
- ✅ Complete placement rankings

**May the odds be ever in your favor!** 🏹🔥
