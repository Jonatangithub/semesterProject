
    function makeChoice(userChoice) {
        const choices = ["rock", "paper", "scissors", "sponge", "water", "fire", "air", "gun", "human"];
        
        const computerChoice = choices[Math.floor(Math.random() * 9)];

        document.getElementById('result-text').innerText = `You chose ${userChoice}.`;
        document.getElementById('computer-choice-text').innerText = `Computer chose ${computerChoice}.`;

        const result = getResult(userChoice, computerChoice);

        document.getElementById('result-text').innerText = result;
    }
    function getResult(user, computer) {
        const outcomes = {
            rock: { beats: ['scissors', 'sponge', 'fire', 'human'], losesTo: ['paper', 'water', 'air', 'gun'] },
            paper: { beats: ['rock', 'water', 'fire', 'gun'], losesTo: ['scissors', 'sponge', 'fire', 'human'] },
            scissors: { beats: ['paper', 'sponge', 'air', 'human'], losesTo: ['rock', 'water', 'fire', 'gun'] },
            sponge: { beats: ['paper', 'water', 'air', 'gun'], losesTo: ['rock', 'scissors','fire', 'human'] },
            water: { beats: ['scissors', 'rock', 'fire', 'gun'], losesTo: ['paper', 'sponge', 'air', 'human'] },
            air: { beats: ['fire', 'rock', 'water', 'gun'], losesTo: ['paper', 'scissors', 'sponge', 'human'] },
            fire: { beats: ['scissors', 'paper', 'sponge', 'human'], losesTo: ['air', 'water', 'rock', 'gun'] },
            gun: { beats: ['scissors', 'fire', 'rock', 'human'], losesTo: ['paper', 'air', 'sponge', 'water'] },
            human: { beats: ['sponge', 'paper', 'water', 'air'], losesTo: ['fire', 'scissors', 'rock', 'gun'] }
        };
    
        if (user === computer) {
            return "It's a tie!";
        } else if (outcomes[user].beats.includes(computer)) {
            return "You win!";
        } else {
            return "You lose!";
        }
    }
    