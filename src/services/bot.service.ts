import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import * as playwright from "playwright";

@Injectable()
export class BotService {
  browser: playwright.Browser;
  page: playwright.Page;

  async tryBookPlaces() {
    await this.page.goto("https://share.parkanizer.com/marketplace");
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
    try {
      if (!(await this.isMarketplacePage(this.page))) {
        await this.login(this.page);
        await this.page.waitForTimeout(2000);
      }

      for (const buttonId of this.createDaysButtonNames()) {
        let button = await this.page.$(`[id=${buttonId}]`);
        if (button) {
          await button.click();
          await this.page.waitForTimeout(500);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async initBot() {
    this.browser = await playwright["chromium"].launch({ headless: true });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    await this.page.goto("https://share.parkanizer.com/marketplace");
    await this.page.waitForLoadState("load");
  }

  async closeBot() {
    this.page.close();
    this.browser.close();
    this.page = null;
  }

  // execute ones per day at 00:00
  async tryBookOnes() {
    try {
      // init
      const browser = await playwright["chromium"].launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto("https://share.parkanizer.com/marketplace");
      await page.waitForLoadState("load");
      await page.waitForTimeout(2000);

      // login
      if (!(await this.isMarketplacePage(page))) {
        await this.login(page);
        await page.waitForTimeout(2000);
      }

      // book places
      for (const buttonId of this.createDaysButtonNames()) {
        let button = await page.$(`[id=${buttonId}]`);
        if (button) {
          await button.click();
          await page.waitForTimeout(500);
        }
      }

      // close
      page.close();
      browser.close();
    } catch (err) {
      console.log(err);
    }
  }

  private async isMarketplacePage(page: playwright.Page): Promise<boolean> {
    await page.waitForTimeout(2000);
    const isLoggedInElement = await page.$("[id='marketplace']");
    return !!isLoggedInElement;
  }

  private async login(page: playwright.Page) {
    const emailInput = await page.waitForSelector("[id='signInName']");
    await emailInput.fill("extern.petrykowski_maciej@mondial-assistance.pl");
    const submitButton = await page.waitForSelector("[id='continue']");
    await submitButton.click();
    await page.waitForTimeout(2000);
    const passwordInput = await page.waitForSelector("[id='password']");
    await passwordInput.fill("Syryjski1");
    await page.waitForTimeout(2000);
    const nextButton = await page.waitForSelector("[id='next']");
    await nextButton.click();
    await page.waitForTimeout(2000);
    const cookieButton = await page.waitForSelector("[id='confirm-cookie-consent']");
    await cookieButton.click();
    const startTidaroButton = await page.getByText(/Start using Tidaro/);
    await page.waitForTimeout(1000);
    await startTidaroButton.click();
    await page.waitForTimeout(1000);
    const dialogOk = await page.waitForSelector("[id='dialog-ok']");
    await dialogOk.click();
    await page.waitForTimeout(1000);
    await page.goto("https://share.parkanizer.com/marketplace");
  }

  private createDaysButtonNames(): string[] {
    let buttonIds = [];

    for (let index = 0; index < 15; index++) {
      let buttonId = "take-" + moment().add(index, "day").format("DD-MM");
      buttonIds.push(buttonId);
    }

    return buttonIds;
  }
}
