(async () => {
  const tabs = await fetch('http://localhost:9222/json/list').then(r => r.json());
  const target = tabs.find(t => t.url === 'http://localhost:5173/');
  if (!target) return console.log('Target not found');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 2,
      method: 'Page.captureScreenshot',
      params: { format: 'png' }
    }));
  };

  ws.onmessage = async (msg) => {
    const data = JSON.parse(msg.data);
    if (data.result && data.result.data) {
      const fs = await import('fs');
      fs.writeFileSync('scratch/live_screenshot_cdp.png', Buffer.from(data.result.data, 'base64'));
      console.log('Saved scratch/live_screenshot_cdp.png');
      process.exit(0);
    }
  };
})();
