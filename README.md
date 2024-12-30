# Special_Wordle

In Wordle, you play with a 5x6 grid where you can type your guesses using an on-screen or physical keyboard. You'll get color-coded feedback for each letter—green for correct, yellow for the right letter in the wrong spot, and gray for incorrect letters. The game only lets you submit valid 5-letter words, and if you guess wrong, you'll be notified.  

The twist is: after each game, you'll see your score and streak, and if you lose, you'll lose your streak, starting from 0 again. The more games you win, the more points you'll receive from each winning game. Oh, and you can track your highest score as you continue playing.

## Required Features

The following functionality is completed:
- [X] User sees a pre-rendered 5x5 grid where they can input their guesses with both their keyboard or by clicking the on-screen keyboard
- [X] User receives color-coded feedback indicating correct letters (green), incorrect letters (gray), and letters in the wrong position (yellow)
- [X] User can only submit valid 5-letter words and are notified when they've submitted an incorrect word
- [X] User sees a a win or loss message and learns of the correct word if they lose
- [X] User sees their total score and current streak as they can continue playing the game
- [X] User sees their highest score and keep on playing to try and beat it

## How to run

1. Install the Live Server extension in VS Code.
2. Right-click your index.html file in the editor and select Open with Live Server.
3. Your site will open in the browser at a URL similar to: http://127.0.0.1:5500
4. Use the app!

## Notes

- I used two hardcoded text files for the words. The allowed.txt file denotes the allowed words a user can submit. For example, even if the word isn't the right word, it still is a proper submission/valid word if it is present in the allowed.txt file. The user will simply lose a guess for inputting the wrong word. The library.txt file is where we choose our words from.
- I used Local Storage to save the information such as highest score, current score, etc.
- For Next Steps, I can take care of this logic through a server. I can use an API to get my winning word. I can also check against the API to see if the word the user submitted is a valid word.

## License

    Copyright 2024 Samir Hassan

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
