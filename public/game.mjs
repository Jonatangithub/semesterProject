


async function checkAuth(req, res, next) {
    const userToken = sessionStorage.getItem('userToken');
  
    if (!userToken) {
      res.status(401).json({ message: 'not logged in' });
    } else {

      req.userToken = userToken;
  
      fetch('/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(userData => {
          req.user = userData; // Attach the user information to the request object
          next(); // Proceed to the next middleware or route handler
        })
        .catch(error => {
          console.error('Error fetching user information:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        });
    }
  }
  
  async function makeChoice(userChoice) {
    const userToken = sessionStorage.getItem('userToken');

    if (!userToken) {
        alert('User not logged in');
        return;
    }

    const choices = ["rock", "paper", "scissors", "sponge", "water", "fire", "air", "gun", "human"];
    console.log(`User chose: ${userChoice}`);

    const computerChoice = choices[Math.floor(Math.random() * 9)];

    document.getElementById('user-choice-text').innerText = `You chose ${userChoice}.`;
    document.getElementById('computer-choice-text').innerText = `Computer chose ${computerChoice}.`;

    const result = getResult(userChoice, computerChoice);
    document.getElementById('result-text').innerText = result;


    try {
        const response = await fetch('user/updateStats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify({
                statChange: result.statChange, // Use the statChange value from the game result
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            console.log(statChange);
        } else {
            console.error('Failed to update stats:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}



async function getResult(user, computer) {
  const outcomes = {
      rock: { beats: ['scissors', 'sponge', 'fire', 'human'], losesTo: ['paper', 'water', 'air', 'gun'] },
      paper: { beats: ['rock', 'water', 'fire', 'gun'], losesTo: ['scissors', 'sponge', 'fire', 'human'] },
      scissors: { beats: ['paper', 'sponge', 'air', 'human'], losesTo: ['rock', 'water', 'fire', 'gun'] },
      sponge: { beats: ['paper', 'water', 'air', 'gun'], losesTo: ['rock', 'scissors', 'fire', 'human'] },
      water: { beats: ['scissors', 'rock', 'fire', 'gun'], losesTo: ['paper', 'sponge', 'air', 'human'] },
      air: { beats: ['fire', 'rock', 'water', 'gun'], losesTo: ['paper', 'scissors', 'sponge', 'human'] },
      fire: { beats: ['scissors', 'paper', 'sponge', 'human'], losesTo: ['air', 'water', 'rock', 'gun'] },
      gun: { beats: ['scissors', 'fire', 'rock', 'human'], losesTo: ['paper', 'air', 'sponge', 'water'] },
      human: { beats: ['sponge', 'paper', 'water', 'air'], losesTo: ['fire', 'scissors', 'rock', 'gun'] }
  };

  let statChange;

  if (user === computer) {
      statChange = 0; // It's a tie
      return { statChange, resultText: "It's a tie!" };
  } else if (outcomes[user].beats.includes(computer)) {
      statChange = 1; // You win
      return { statChange, resultText: `You win! ${user} beats ${computer}.` };
  } else {
      statChange = -1; // You lose
      return { statChange, resultText: `You lose! ${computer} beats ${user}.` };
  }
}
