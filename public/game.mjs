


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

  const computerChoice = choices[Math.floor(Math.random() * choices.length)];

  document.getElementById('user-choice-text').innerText = `You chose ${userChoice}.`;
  document.getElementById('computer-choice-text').innerText = `Computer chose ${computerChoice}.`;

  getResult(userChoice, computerChoice).then(result => {
    document.getElementById('result-text').innerText = result.resultText;
    updateStats(result.statChange);
  }).catch(error => {
    console.error('Error processing game result:', error);
  });
}


let statChange;
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
    statChange = "draw"; // It's a tie
    console.log(statChange, "tie")
    resultText = "It's a tie!"
    return { statChange };
  } else if (outcomes[user].beats.includes(computer)) {
    statChange = "win"; // You win
    console.log(statChange, "victory")
    resultText = `You win! ${user} beats ${computer}.`
    document.getElementById('result-text').innerText = resultText;
    return { statChange };
  } else {
    statChange = "loss"; // You lose
    console.log(statChange, "loss")
    resultText = `You lose! ${computer} beats ${user}.`
    document.getElementById('result-text').innerText = resultText;
    return { statChange };

  }

}

function updateStats(statChange) {
  const userId = JSON.parse(sessionStorage.getItem('userId'));
  console.log(userId)
  const payload = {
    userid: userId,
    result: statChange
  };

  fetch('/stats/updateStats', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Stats updated successfully:', data);
    })
    .catch(error => {
      console.error('Error updating stats:', error);
    });
}




