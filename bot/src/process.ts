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

      if (await page.waitForSelector("#paginacao").catch(() => false)) {
        await page.waitForSelector("#paginacao");
      const html = await page.content();

      const root = parse(html);
      const tableElement = root.querySelector(".descricaoAIT table");

      if (tableElement) {
        const cells = tableElement.querySelectorAll("td");
        const numeroInfracao = root.querySelector('.numeroAIT')?.textContent?.trim() || '';
        const dataHora = cells[1].textContent.trim();
        const municipio = cells[5].textContent.trim();
        const infracao = cells[7].textContent.trim();
        const situacao = cells[9].textContent.trim();

        console.log("Número da infração:", numeroInfracao);
        console.log("Data e Hora:", dataHora);
        console.log("Município:", municipio);
        console.log("Infração:", infracao);
        console.log("Situação:", situacao);
      }

      } 
      else {
        const tituloNadaConstaElement = await page.waitForSelector(".tituloNadaConsta");
        if (tituloNadaConstaElement) {
          const html = await page.content();

          const root = parse(html);

          const tableElement = root.querySelector(".tituloNadaConsta")?.textContent.trim();

          console.log(tableElement);

        } 
        else {
          console.log("Seletor não encontrado");
        }
      }

      await browser.close();

    }
  } catch (error) {
    console.log(error);
  }
};
