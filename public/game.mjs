async function makeChoice(userChoice) {
  const userToken = sessionStorage.getItem('userToken');
  if (!userToken) {
    alert('User not logged in');
    return;
  }
  const choices = ["rock", "paper", "scissors", "sponge", "water", "fire", "air", "gun", "human"];
  console.log(`User choice: ${userChoice}`);
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
    rock: { beats: ['scissors', 'sponge', 'fire', 'human']},
    paper: { beats: ['rock', 'water', 'fire', 'gun']},
    scissors: { beats: ['paper', 'sponge', 'air', 'human'] },
    sponge: { beats: ['paper', 'water', 'air', 'gun']},
    water: { beats: ['scissors', 'rock', 'fire', 'gun']},
    air: { beats: ['fire', 'rock', 'water', 'gun']},
    fire: { beats: ['scissors', 'paper', 'sponge', 'human']},
    gun: { beats: ['scissors', 'fire', 'rock', 'human']},
    human: { beats: ['sponge', 'paper', 'water', 'air']}
  };
  let resultText;
  if (user === computer) {
    statChange = "draw";
    console.log(statChange)
    resultText = "It's a tie!"
    return { statChange, resultText };
  } else if (outcomes[user].beats.includes(computer)) {
    statChange = "win";
    console.log(statChange)
    resultText = `You win! ${user} beats ${computer}.`
    document.getElementById('result-text').innerText = resultText;
    return { statChange, resultText };
  } else {
    statChange = "loss";
    console.log(statChange)
    resultText = `You lose! ${computer} beats ${user}.`
    document.getElementById('result-text').innerText = resultText;
    return { statChange, resultText };
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
function resetUserStats() {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
      alert('User not logged in or user ID not found.');
      return;
  }
  
  // Add a confirmation dialog
  const confirmReset = confirm("Are you sure you want to reset your stats? This action cannot be undone.");
  if (!confirmReset) {
      // If the user clicks "Cancel", stop the function
      return;
  }

  // Proceed with resetting the stats if the user confirms
  fetch(`/stats/resetStats/${userId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to reset stats');
      }
      return response.json();
  })
  .then(data => {
      alert("Stats reset successfully.");
      // Optionally, refresh stats on the page if displayed
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Failed to reset stats.');
  });
}

function displayStats() {
  const userId = JSON.parse(sessionStorage.getItem('userId'));
  console.log(userId);
  fetch(`/stats/displayStats/${userId}`)
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
    const totalGames = data.wins + data.losses + data.draws;
    const winRate = totalGames === 0 ? 0 : (data.wins / totalGames) * 100;
    const statsHTML = `
      <table>
        <tr><td>User:</td><td>${userId}</td></tr>
        <tr><td>Wins:</td><td>${data.wins}</td></tr>
        <tr><td>Losses:</td><td>${data.losses}</td></tr>
        <tr><td>Draws:</td><td>${data.draws}</td></tr>
        <tr><td>Win Rate:</td><td>${winRate.toFixed(2)}%</td></tr>
      </table>
    `;
    document.getElementById('stats-display').innerHTML = statsHTML;
  })
  .catch(error => {
      console.error('Error displaying stats:', error);
  });
}
function displayLeaderboard() {
  fetch('/stats/leaderboard')
      .then(response => response.json())
      .then(data => {
          const leaderboardElement = document.getElementById('leaderboard');
          leaderboardElement.innerHTML = '<h3>Top Players</h3><ul>' + 
              data.map(user => {
                  const wins = user.wins;
                  const losses = user.losses;
                  const draws = user.draws;
                  const totalGames = wins + losses + draws;
                  const winRate = totalGames === 0 ? 0 : (wins / totalGames) * 100;

                  return `<li>Name: ${user.name} - Wins: ${wins}, Losses: ${losses}, Draws: ${draws}, Win Rate: ${winRate.toFixed(2)}%</li>`;
              })
              .join('') + '</ul>';
          document.getElementById('leaderboardSection');
      })
      .catch(error => {
          console.error('Error fetching leaderboard:', error);
      });
}
