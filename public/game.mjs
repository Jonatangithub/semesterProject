


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
  
// Updated makeChoice function in game.mjs
function makeChoice(userChoice) {
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

  // Here we assume 'statChange' is a key in the result object returned by getResult indicating win (1), draw (0), or loss (-1)
/*   try {
      const response = await fetch('/user/updateStats', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify({
              statChange: result.statChange, // Assuming getResult returns an object with a 'statChange' property
          }),
      });

      if (response.ok) {
          const updateResult = await response.json();
          console.log('Stats updated successfully:', updateResult);
      } else {
          console.error('Failed to update stats:', response.statusText);
      }
  } catch (error) {
      console.error('Error updating stats:', error);
  }
} */
}
let statChange = 0;
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

  let resultText = "make a choice"; 
  if (user === computer) {
      statChange = 0; // It's a tie
      console.log( statChange, "tie")
      resultText =  "It's a tie!"
      return {statChange};
  } else if (outcomes[user].beats.includes(computer)) {
      statChange = 1; // You win
      console.log( statChange, "victory")
      resultText = `You win! ${user} beats ${computer}.`
      document.getElementById('result-text').innerText = resultText;
      return {statChange};
  } else {
      statChange = -1; // You lose
      console.log( statChange, "loss")
      resultText =  `You lose! ${computer} beats ${user}.` 
      document.getElementById('result-text').innerText = resultText;
      return {statChange};
  }
}
