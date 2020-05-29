# Tarokka

[See this in action at tarokka.com!](https://tarokka.com)

This is randomized tarokka reading for your online Dungeons & Dragons game, implemented in TypeScript and React. Open the Dungeon Master's view with the button at the top right. Refresh the player view for a new reading.

The idea is that you can present the player view over your Google Meet or Zoom call while reading the auto-generated notes that are only visible to you, the Dungeon Master.

***Warning:*** *It goes without saying, but the data file and Dungeon Master's view contain ***massive spoilers*** for players. A warning modal is displayed before opening the Dungeon Master's view.*

## Features

- Artwork from three decks:
  - The original AD&D Forbidden Lore deck
  - The fifth edition Gale Force Nine deck
  - A colorized version of the Gale Force Nine deck
  - (The third edition Sword & Sorcery deck is coming soon!)
- Cards are revealed with a 3D effect
- Any card can be removed from the deck entirely, to prevent awkward pacing issues with your campaign
- Each card can be locked, to guarantee that card will always be the one revealed
- All changes are saved by your browser

## What is tarokka?

Tarokka is the tarot equivalent in Barovia, the kingdom ruled by the immortal vampire Strahd from his home in Castle Ravenloft. It's a nerd thing. See the Dungeons & Dragons fifth edition adventure [*Curse of Strahd*](https://smile.amazon.com/Curse-Strahd-Dungeons-Sourcebook-Supplement/dp/0786965983/) for more information.

<img src="./assets/screenshot1.png" alt="Screenshot 1" width="300" height="409" /> <img src="./assets/screenshot2.png" alt="Screenshot 2" width="300" height="409" /> <img src="./assets/screenshot3.png" alt="Screenshot 3" width="300" height="409" />

## Available scripts

In the project directory, you can run:

| Command      | Description                                             |
|--------------|---------------------------------------------------------|
| `yarn start` | Runs the app in the development mode.                   |
| `yarn test`  | Launches the test runner in the interactive watch mode. |
| `yarn build` | Builds the app for production to the `build` folder.    |

## Credits

Thanks to [@pvrs12](https://github.com/pvrs12/tarokka) for the initial version of the data file and [Nefermais](https://www.reddit.com/user/Nefermais) for the colorized Gale Force Nine deck!
