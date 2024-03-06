class ServerFetch {
  constructor(requestType, serverEndpoint, data = {}) {
    this.requestType = requestType.toUpperCase();
    this.serverEndpoint = serverEndpoint;
    this.data = data;
    this.status;
  }

  fetchData(onOk, onError) {
    const headers = {
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: this.requestType,
      headers: headers,
    };

    // Exclude body for GET and HEAD requests
    if (["GET", "HEAD"].indexOf(this.requestType) === -1) {
      requestOptions.body = JSON.stringify(this.data);
    }

    fetch(this.serverEndpoint, requestOptions)
      .then((response) => {
        this.status = response.status;
        if (this.status >= 200 && this.status < 300) {
          response
            .json()
            .then((data) => {
              console.log("Response:", data);
              this.data = data;
              onOk(data);
            })
            .catch((error) => {
              console.error("Error:", error);
              if (onError) {
                onError(error);
              }
            });
        } else {
          if (onError) {
            onError(new Error(`HTTP Error: ${this.status}`));
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (onError) {
          onError(error);
        }
    });
  }
}
