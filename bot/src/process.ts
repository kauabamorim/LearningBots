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

    await page.waitForNavigation();

    const html = await page.content();
    await page.waitForSelector("#paginacao");

    const root = parse(html);
    console.log(root.querySelector("#paginacao"));

    await browser.close();

  } catch (error) {
    console.log(error);
  }
};
