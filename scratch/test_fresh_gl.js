(async () => {
  const tabs = await fetch('http://localhost:9222/json/list').then(r => r.json());
  const target = tabs.find(t => t.url === 'http://localhost:5173/');
  if (!target) return console.log('Target not found');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 5,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          // Let's create an offscreen canvas and test getContext('webgl2')
          const testCanvas = document.createElement('canvas');
          testCanvas.width = 100;
          testCanvas.height = 100;
          const gl = testCanvas.getContext('webgl2');
          if (!gl) return { error: 'Could not get webgl2 context on fresh canvas' };

          return {
            renderer: gl.getParameter(gl.RENDERER),
            vendor: gl.getParameter(gl.VENDOR),
            version: gl.getParameter(gl.VERSION),
            shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
          };
        })()`,
        returnByValue: true
      }
    }));
  };

  ws.onmessage = (msg) => {
    console.log('Result:', JSON.stringify(JSON.parse(msg.data), null, 2));
    process.exit(0);
  };
})();
