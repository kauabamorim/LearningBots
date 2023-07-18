import puppeteer from "puppeteer";

(async () => {
  // Inicializa // headless: faz com que abra o navegador
  const browser = await puppeteer.launch({ headless: false });

  // Abrir uma nova página
  const page = await browser.newPage();

  // Navegar para um URL
  await page.goto("http://smt.derba.ba.gov.br:8180/smt/home.action");


  // Esperando aparecer o id #renavam
  await page.waitForSelector('#renavam');

  // Selecionando id e informando o valor para inserir
  await page.type('#renavam', '01153252543');
  await page.type('#placa', 'PLA8614');

  await page.click('#acao');

  // Espera carregar
  await page.waitForNavigation();

  await page.waitForSelector('.Auto(s) de Infração');

  // Fechar o navegador
  // await browser.close();
})();
