(async () => {
  const tabs = await fetch('http://localhost:9222/json/list').then(r => r.json());
  const target = tabs.find(t => t.url === 'http://localhost:5173/');
  if (!target) return console.log('Target not found');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 3,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          // Let's inspect every element around the hero card and its computed background or images or pseudo elements
          const grid = document.querySelector('.cursor-grid');
          const hero = grid?.parentElement;
          
          function dumpEl(el) {
            if (!el) return null;
            const cs = window.getComputedStyle(el);
            const before = window.getComputedStyle(el, '::before');
            const after = window.getComputedStyle(el, '::after');
            return {
              tag: el.tagName,
              id: el.id,
              class: el.className,
              bg: cs.backgroundColor,
              bgImage: cs.backgroundImage,
              filter: cs.filter,
              beforeBg: before.backgroundColor,
              beforeBgImage: before.backgroundImage,
              afterBg: after.backgroundColor,
              afterBgImage: after.backgroundImage,
              rect: el.getBoundingClientRect()
            };
          }

          let chain = [];
          let cur = hero;
          while (cur && cur !== document.documentElement) {
            chain.push(dumpEl(cur));
            cur = cur.parentElement;
          }

          // Check if there are any svg or elements with absolute inset-0 or large dimensions
          const all = Array.from(document.querySelectorAll('*'));
          const overlayCandidates = all.filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 500 && r.height > 300 && r.top < 300;
          }).map(dumpEl);

          return { chain, overlayCandidates };
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
