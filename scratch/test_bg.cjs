const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

  const info = await page.evaluate(() => {
    function getDetails(el) {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        className: el.className,
        bg: s.backgroundColor,
        backgroundImage: s.backgroundImage,
        color: s.color,
        w: el.offsetWidth,
        h: el.offsetHeight,
        rect: el.getBoundingClientRect()
      };
    }

    const grid = document.querySelector('.cursor-grid');
    const heroCard = grid?.parentElement;
    const canvas = document.querySelector('.cursor-grid__canvas');
    const content = document.querySelector('.cursor-grid__content');

    // Find any element whose computed background is white (rgb(255, 255, 255))
    const all = Array.from(document.querySelectorAll('*'));
    const whiteElements = all.filter(el => {
      const bg = window.getComputedStyle(el).backgroundColor;
      return bg === 'rgb(255, 255, 255)' || bg === '#ffffff' || bg === 'white';
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect()
    }));

    return {
      heroCard: getDetails(heroCard),
      grid: getDetails(grid),
      canvas: getDetails(canvas),
      content: getDetails(content),
      whiteElements: whiteElements.slice(0, 10)
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
