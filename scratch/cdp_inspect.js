const wsUrl = 'ws://localhost:9222/devtools/page/C28DA354E65E16665C7262A580B40FE2';
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const grid = document.querySelector('.cursor-grid');
        const hero = grid?.parentElement;
        const canvas = document.querySelector('.cursor-grid__canvas');
        const body = document.body;
        
        // Let's also inspect elementFromPoint in the middle of the hero card!
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + 50;
        const centerY = rect.top + 50;
        const hitEl = document.elementFromPoint(centerX, centerY);

        return {
          heroBg: hero ? window.getComputedStyle(hero).backgroundColor : null,
          gridBg: grid ? window.getComputedStyle(grid).backgroundColor : null,
          bodyBg: window.getComputedStyle(body).backgroundColor,
          canvasBg: canvas ? window.getComputedStyle(canvas).backgroundColor : null,
          canvasDims: canvas ? { w: canvas.width, h: canvas.height, styleW: canvas.style.width, styleH: canvas.style.height } : null,
          hitElement: hitEl ? { tag: hitEl.tagName, className: hitEl.className, bg: window.getComputedStyle(hitEl).backgroundColor } : null
        };
      })()`,
      returnByValue: true
    }
  }));
};

ws.onmessage = (event) => {
  console.log('Result:', JSON.stringify(JSON.parse(event.data), null, 2));
  process.exit(0);
};

ws.onerror = (err) => {
  console.error('Error:', err);
  process.exit(1);
};
