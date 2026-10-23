(async () => {
  const tabs = await fetch('http://localhost:9222/json/list').then(r => r.json());
  const target = tabs.find(t => t.url.includes('5173'));
  if (!target) return console.log('Target not found');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 30,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const contact = document.getElementById('contact');
          const techText = document.querySelector('.tech-text');
          const techCanvas = document.querySelector('.tech-text-canvas');
          return {
            url: window.location.href,
            hasContact: !!contact,
            contactHeight: contact ? contact.offsetHeight : null,
            hasTechText: !!techText,
            techCanvas: techCanvas ? { w: techCanvas.width, h: techCanvas.height } : null
          };
        })()`,
        returnByValue: true
      }
    }));
  };

  ws.onmessage = (msg) => {
    console.log(JSON.stringify(JSON.parse(msg.data), null, 2));
    process.exit(0);
  };
})();
