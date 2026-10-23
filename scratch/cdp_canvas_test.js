(async () => {
  const tabs = await fetch('http://localhost:9222/json/list').then(r => r.json());
  const target = tabs.find(t => t.url === 'http://localhost:5173/');
  if (!target) return console.log('Target not found');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 4,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const canvas = document.querySelector('.cursor-grid__canvas');
          if (!canvas) return 'No canvas';

          // Try 2D context
          const ctx2d = canvas.getContext('2d');
          if (ctx2d) return 'Has 2D context!';

          // Try WebGL2
          const gl = canvas.getContext('webgl2');
          if (!gl) return 'WebGL2 not available';

          const isLost = gl.isContextLost();
          const err = gl.getError();
          return {
            isContextLost: isLost,
            glError: err,
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
