(async () => {
  const tabs = await fetch('http://localhost:9222/json/list').then(r => r.json());
  const target = tabs.find(t => t.url === 'http://localhost:5173/');
  if (!target) return console.log('Target not found');
  console.log('Target ws:', target.webSocketDebuggerUrl);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const grid = document.querySelector('.cursor-grid');
          const hero = grid?.parentElement;
          const canvas = document.querySelector('.cursor-grid__canvas');
          
          let canvasPixel = null;
          if (canvas) {
            try {
              const gl = canvas.getContext('webgl2');
              if (gl) {
                const pixels = new Uint8Array(4);
                gl.readPixels(10, 10, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                canvasPixel = Array.from(pixels);
              }
            } catch(e) {
              canvasPixel = e.message;
            }
          }

          // Let's find what is covering or causing the white background
          const rect = hero ? hero.getBoundingClientRect() : null;
          const elAtCenter = rect ? document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2) : null;

          return {
            heroTag: hero?.tagName,
            heroClass: hero?.className,
            heroComputedBg: hero ? window.getComputedStyle(hero).backgroundColor : null,
            gridComputedBg: grid ? window.getComputedStyle(grid).backgroundColor : null,
            canvasComputedBg: canvas ? window.getComputedStyle(canvas).backgroundColor : null,
            canvasDimensions: canvas ? { width: canvas.width, height: canvas.height, clientWidth: canvas.clientWidth, clientHeight: canvas.clientHeight } : null,
            canvasPixel: canvasPixel,
            elAtCenter: elAtCenter ? { tag: elAtCenter.tagName, class: elAtCenter.className, bg: window.getComputedStyle(elAtCenter).backgroundColor } : null
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
