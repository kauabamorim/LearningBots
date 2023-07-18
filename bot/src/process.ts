import puppeteer from "puppeteer";
import parse from "node-html-parser";

export const runPuppeteer = async () => {
  const plates: string[] = ["PLA8614", "NYI8948"];
  const renavams: string[] = ["01153252543", "01057242532"];

  try {
    // Inicializa
    // headless: faz com que abra o navegador

    for (let index = 0; index < 2; index++) {
      const browser = await puppeteer.launch({
        headless: false,
      });
  
      const page = await browser.newPage();
  
      await page.goto("http://smt.derba.ba.gov.br:8180/smt/home.action");
  
      await page.waitForSelector("#renavam");
  
      await page.type("#renavam", renavams[index]);
      await page.type("#placa", plates[index]);
  
      await page.click("#acao");
  
      await page.waitForSelector("#paginacao");
      const html = await page.content();
      
      const root = parse(html);
  
      const infra = await page.waitForSelector('.descricaoAIT');
      const value = await page.evaluate((el) => el.textContent, infra);
  
      console.log(value)
      
      await browser.close();
    }

  } catch (error) {
    console.log(error);
  }
};
