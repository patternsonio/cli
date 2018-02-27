'use strict';

const fetch = require('node-fetch');

function addSlash(thing) {
  return thing.match(/\/$/) ? thing : `${thing}/`;
}

module.exports = function getUploadUrl(config) {
  const url = `${addSlash(config.registryUrl)}get-upload-url/${config.name}/${
    config.version
  }`;

  return fetch(url, {
    headers: { Authorization: `Bearer ${config.authToken}` },
  })
    .then((res) => {
      if (res.status === 401) {
        return Promise.reject(new Error('Missing authToken'));
      } else if (res.status === 403) {
        return Promise.reject(new Error('Forbidden'));
      } else if (res.status !== 200) {
        return res.text().then((data) => {
          try {
            return Promise.reject(
              new Error(`[${res.status}] ${JSON.parse(data).Message}`)
            );
          } catch (e) {
            return Promise.reject(new Error(`[${res.status}] ${data}`));
          }
        });
      }

      return res.json();
    })
    .then((data) => data.url);
};
