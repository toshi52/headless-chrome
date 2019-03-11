const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const topUrl = 'http://35.201.4.158';
const loginUrl = 'http://35.201.4.158/index.php/login/';
const high = 9999999;
const low  = 1000000;
const emailId = Math.random()*(high-low)+low;
const email = emailId+'@gmail.com';

const schedule = require('node-schedule');

const myJob = schedule.scheduleJob('*/60 * * * * *', (fireDate) => {
	(async function(){
	    const browser = await puppeteer.launch();
	    const page = await browser.newPage();
	    
	    // chose device if you need it
	    const iPhone = devices['iPhone X'];
	    await page.emulate(iPhone);

	    await topPageHandling(page, topUrl);
		await moveToCartPage(page, topUrl);	
		await loginWithEmail(page, loginUrl, email);

	    await browser.close();
	})();  
});

// top page 
async function topPageHandling(page, topUrl) {
	await page.goto(topUrl);

	// take screenshot for a element
	const element = await page.$('h1');
	await element.screenshot({path: 'screenshot_h1.png'});

	// evaluate js
	await page.evaluate(() => {
	    const h1 = document.querySelector('h1');
	    h1.textContent = 'H1 Changed';
	});
	await page.screenshot({path: 'h1_changed.png'});

	// DOM rendoring tree
	const bodyHandle = await page.$('body');
	const html = await page.evaluate(body => body.innerHTML, bodyHandle);
	console.log(html);
}

// move to cart page
async function moveToCartPage(page, topUrl) {
    await page.goto(topUrl);

	await page.waitFor('.fasc-button');
	const buttons = await  page.$$('.fasc-button');
	await buttons[0].click();
	await page.waitForNavigation();
	await page.screenshot({path: 'page_moved.png'});
}

// Login with email
async function loginWithEmail(page, loginUrl, email) {
	await page.goto(loginUrl);

	await page.waitFor('input[name=email]');
	await page.type('input[name=email]', email);
	const login = await page.$('#login'); 
	await page.screenshot({path: 'login.png'});	
	await login.click();
}
