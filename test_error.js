import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message, error.stack));
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
    
    // Type password
    await page.type('input[type="password"]', 'The-Bad-Boy');
    await page.click('button[type="submit"]');
    
    // Wait for something in the dashboard
    await new Promise(resolve => setTimeout(resolve, 5000));
    
  } catch (e) {
    console.log('Navigation/Execution error:', e.message);
  }
  
  await browser.close();
})();
