import puppeteer from 'puppeteer';

export const runPuppeteer = async () => {
  try {
    // Inicializa 
    // headless: faz com que abra o navegador
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();

    await page.goto('http://smt.derba.ba.gov.br:8180/smt/home.action');
    
    await page.waitForSelector('#renavam');
    await page.type('#renavam', '01153252543');

    await page.type('#placa', 'PLA8614');
    await page.click('#acao');
    
    await page.waitForNavigation();

    const codInfra = await page.waitForSelector('.numeroAIT');
    const value = await page.evaluate((el) => el.textContent, codInfra);

    console.log('Código da Infração:', value);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};
