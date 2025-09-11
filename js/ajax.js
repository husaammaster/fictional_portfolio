"use strict ";

export function loadJSON(path, processFunction) {
  const xhr = new XMLHttpRequest();
  xhr.open("get", path);
  xhr.addEventListener("load", (evnt) => {
    if (xhr.status == 200) {
      console.log(`Request successful: get on ${path}`);
      const payload = JSON.parse(xhr.response);
      processFunction(payload);
    } else {
      console.warn(
        `Request was not successfull: ${xhr.responseURL} returned status ${xhr.statusText}`
      );
    }
  });
  xhr.send();
}
