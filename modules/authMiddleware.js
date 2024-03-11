
export function checkAuth(req, res, next) {
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
          req.user = userData; 
          next();
        })
        .catch(error => {
          console.error('Error fetching user information:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        });
    }
  }
  
  