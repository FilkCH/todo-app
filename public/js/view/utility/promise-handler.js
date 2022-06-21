const parseJSON = (response) =>
  new Promise((resolve) => {
    response.json().then((json) =>
      resolve({
        status: response.status,
        ok: response.ok,
        json,
      })
    );
  });

export const request = (url, options) =>
  new Promise((resolve, reject) => {
    fetch(url, options)
      .then(parseJSON)
      .then((response) => {
        if (response.ok) {
          return resolve(response.json);
        }
        return reject(response.json);
      });
  });
