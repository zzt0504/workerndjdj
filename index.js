addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });

  async function handleRequest(request) {
    const url = new URL(request.url);
    url.hostname = "localhost:54666";
    return fetch(url.toString(), request);
  }
