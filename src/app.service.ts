import { Injectable, Logger } from "@nestjs/common";
import { log } from "console";
import * as playwright from 'playwright';


@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  page: playwright.Page;
  isBotWorking = false;
 
  stopBot(){
    this.isBotWorking = false;
    this.page.close();
  } 
  

  async startBot(){
try{
    this.isBotWorking = true;
    const browser = await playwright['chromium'].launch({ headless: false });
    const context = await browser.newContext();
     this.page = await context.newPage();
     await this.page.goto("https://share.parkanizer.com/marketplace");
     await this.page.waitForLoadState("load");
   
     while(this.isBotWorking){
      if(await this.isMarketplacePage()){
        await this.page.goto("https://share.parkanizer.com/marketplace");
        await this.page.waitForLoadState("load");

        await this.page.waitForTimeout(2000);
        const bookAnys = await this.page.getByText(/book any/).all();
        await bookAnys.forEach(async (bookAny)=>
        {
          this.logger.debug(bookAny)
          await this.page.waitForTimeout(5000);
          await bookAny.click();
        })
        
        
        await this.page.waitForTimeout(300000);
        
      }else{
        await this.login();
      }
    } 
  }catch(err){
    console.log(err);
  
  }

  }

  private async isMarketplacePage(): Promise<boolean>{
    await this.page.waitForTimeout(2000);
    const isLoggedInElement = await this.page.$("[id='marketplace']");
    return !!isLoggedInElement;
  }

  private async login(){
    await this.page.waitForTimeout(2000);
    const emailInput = await this.page.$("[id='signInName']");
    await emailInput.fill('extern.petrykowski_maciej@mondial-assistance.pl')
    const submitButton = await this.page.$("[id='continue']");
    await submitButton.click();
    await this.page.waitForTimeout(2000);
    const passwordInput = await this.page.$("[id='password']");
    await passwordInput.fill("Syryjski1");
    await this.page.waitForTimeout(2000);
    const nextButton = await this.page.$("[id='next']");
    await nextButton.click();
    await this.page.waitForTimeout(2000);
    const cookieButton = await this.page.$("[id='confirm-cookie-consent']");
    await cookieButton.click();
    const startTidaroButton = await this.page.getByText(/Start using Tidaro/);
    await this.page.waitForTimeout(1000);
    await startTidaroButton.click();
    await this.page.waitForTimeout(1000);
    const dialogOk = await this.page.$("[id='dialog-ok']");
    await dialogOk.click();
    await this.page.waitForTimeout(1000);
    await this.page.goto("https://share.parkanizer.com/marketplace");
  }
}



            
 
        