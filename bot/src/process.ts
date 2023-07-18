import puppeteer from "puppeteer";
import parse from "node-html-parser";

export const runPuppeteer = async () => {
  try {
    // Inicializa
    // headless: faz com que abra o navegador
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();

    await page.goto("http://smt.derba.ba.gov.br:8180/smt/home.action");

    await page.waitForSelector("#renavam");

    await page.type("#renavam", "01153252543");
    await page.type("#placa", "PLA8614");

    await page.click("#acao");

    await page.waitForSelector("#paginacao");
    const html = await page.content();
    
    const root = parse(html);

    const infra = await page.waitForSelector('.descricaoAIT');
    const value = await page.evaluate((el) => el.textContent, infra);

    console.log(value)
    
    await browser.close();

  } catch (error) {
    console.log(error);
  }
};
