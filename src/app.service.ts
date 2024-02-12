import { Injectable, Logger } from "@nestjs/common";
import * as playwright from "playwright";
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return "Hello World!";
  }
  async startService(){
    const browser = await playwright['chromium'].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage(); //wait for the browser to create a new page by putting await
    await page.goto("https://share.parkanizer.com/refresh-session"); //opening Google page
    await page.waitForLoadState("load");
    await page.waitForTimeout(2000);
    const emailInput = await page.$("[id='signInName']");
    await emailInput.fill('extern.petrykowski_maciej@mondial-assistance.pl')
    const submitButton = await page.$("[id='continue']");
    await submitButton.click();
    await page.waitForTimeout(2000);
    const passwordInput = await page.$("[id='password']");
    await passwordInput.fill("Syryjski1");
    await page.waitForTimeout(2000);
    const nextButton = await page.$("[id='next']");
    await nextButton.click();
    await page.waitForTimeout(2000);
    const cookieButton = await page.$("[id='confirm-cookie-consent']");
    await cookieButton.click();
    const startTidaroButton = await page.getByText("Start using Tidaro");
    await page.waitForTimeout(1000);
    await startTidaroButton.click();
    await page.waitForTimeout(1000);
    const dialogOk = await page.$("[id='dialog-ok']");
    await dialogOk.click();
    await page.waitForTimeout(1000);
    await page.goto("https://share.parkanizer.com/marketplace");


  }
}


            

        