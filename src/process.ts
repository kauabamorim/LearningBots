import puppeteer from "puppeteer";
import parse from "node-html-parser";
import axios from "axios";
import { PDFExtract, PDFExtractOptions } from "pdf.js-extract";
import fs from "fs/promises";

let document: any;

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

      // Abre uma nova guia
      const page = await browser.newPage();

      // Vai para a URL
      await page.goto("http://smt.derba.ba.gov.br:8180/smt/home.action");

      // Espera o id aparecer
      await page.waitForSelector("#renavam");

      await page.type("#renavam", renavams[index]);
      await page.type("#placa", plates[index]);

      await page.click("#acao");

      if (await page.waitForSelector("#paginacao").catch(() => false)) {
        await page.waitForSelector("#paginacao");

        const html = await page.content();
        const root = parse(html);

        const paginacao = root.querySelector(".descricaoAIT table");

        let numberInfraction,
          datetime,
          county,
          infringement,
          situation = "";

        if (paginacao) {
          const cells = paginacao.querySelectorAll("td");
          numberInfraction =
            root.querySelector(".numeroAIT")?.textContent?.trim() || "";
          datetime = cells[1].textContent.trim();
          county = cells[5].textContent.trim();
          infringement = cells[7].innerText.split("\n");
          situation = cells[9].textContent.trim();
        }

        const paginacaoPDF = root.querySelector(".botoesAIT ul li a");

        // Injetando Script (F12 Browser)
        if (paginacaoPDF) {
          await page.evaluate(() => {
            const paginacao = document.querySelector(".botoesAIT ul li a");
            paginacao.removeAttribute("target");
          });
        }

        await page.click('.botoesAIT a[title="Imprimir 2a Via"]');

        const cookies = await page.cookies();

        cookies.forEach((cookie) => {
          const { name, value } = cookie;
          console.log(`${name}=${value};`);
        });

        const pdfExtract = new PDFExtract();

        try {
          const response = await axios.get(
            "http://smt.derba.ba.gov.br:8180/smt/notificacao.action?autoInfracao.nuSeqAutoInfracao=6344950&autoInfracao.cdTipoNotificacao=1&acao=imprimir",
            {
              // responseType: 'arraybuffer',
              headers: {
                // 'Cookie': cookies,
              },
            }
          );
          const fileData = Buffer.from(response.data, "binary");
          await fs.writeFile("./file.pdf", fileData);
          console.log("PDF file saved!");
        } catch (err) {
          console.error(err);
        }

        console.log("========== Consulta 0" + [index + 1] + " ==========");
        console.log("Multa - ", numberInfraction + " - " + infringement);
        console.log("Data e Hora:", datetime);
        console.log("Município:", county);
        console.log("Situacao: ", situation);
      } else {
        const tituloNadaConstaElement = await page.waitForSelector(
          ".tituloNadaConsta"
        );
        if (tituloNadaConstaElement) {
          const html = await page.content();

          const document = parse(html);

          const element = document
            .querySelector(".tituloNadaConsta")
            ?.textContent.trim();

          console.log("========== Consulta 0" + [index + 1] + " ==========");
          console.log(element);
        } else {
          console.log("Seletor não encontrado");
        }
      }

      // await browser.close();
    }
  } catch (error) {
    console.log(error);
  }
};
