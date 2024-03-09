import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import * as playwright from "playwright";
import { HistoryItem } from "../interfaces/history.interface";

@Injectable()
export class BotService {
  browser: playwright.Browser;
  page: playwright.Page;
  history: HistoryItem[] = [];

  async tryBookPlaces() {
    await this.page.goto("https://share.parkanizer.com/marketplace");
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
    try {
      if (!(await this.isMarketplacePage(this.page))) {
        await this.login(this.page);
        await this.page.waitForTimeout(2000);
      }

      this.history = [];
      // days iterate
      for (let index = 15; index >= 0; index--) {
        let day = moment(new Date())
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .add(index, "day");
        // book places
        let buttonId = "take-" + day.format("DD-MM");
        console.log(buttonId);

        let button = await this.page.$(`[id=${buttonId}]`);
        if (button) {
          console.log("clicked button: " + buttonId);

          await button.click();
          await this.page.waitForTimeout(500);
        }

        // save history
        let dayElement = await this.page.$(
          `[id=day-to-take-${day.format("DD-MM")}]`
        );
        if (dayElement) {
          let parkInfo = await dayElement.waitForSelector(
            `.list__item-col.text-right`
          );
          const regex = /Car park \/ (.*) is yours/;

          const regexResult = regex.exec(await parkInfo.innerText());

          if (regexResult?.length >= 1) {
            this.history.push({
              day: day.toDate().toISOString(),
              place: regexResult[1],
            });
          } else {
            this.history.push({
              day: day.toDate().toISOString(),
              place: null,
            });
          }
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
    await this.page.close();
    await this.browser.close();
    this.page = null;
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
    const nextButton = await page?.waitForSelector("[id='next']");
    await nextButton?.click();
    await page.waitForTimeout(2000);
    const cookieButton = await page.waitForSelector(
      "[id='confirm-cookie-consent']"
    );
    await cookieButton?.click();
    const startTidaroButton = await page.getByText(/Start using Tidaro/);
    await startTidaroButton.click();
    const dialogOk = await page.waitForSelector("[id='dialog-ok']");
    await dialogOk.click();
    await page.waitForTimeout(1000);
    await page.goto("https://share.parkanizer.com/marketplace");
  }
}
