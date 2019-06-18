import {browser, by, element, ElementArrayFinder, ElementFinder, promise, protractor} from 'protractor';


const seleniumJsFlavours = require('../../../TestData');
const using = require('jasmine-data-provider');
const EC = protractor.ExpectedConditions;

  export class TestUtils {


     waitUntilVisible(elem) {
      const timeToWait = 10000;
      return browser.wait(EC.presenceOf(elem), timeToWait);
    }

     waitUntilDisplayed(elem) {
      const timeToWait = 10000;
      return browser.wait(function () {
        return elem.isDisplayed().then(function (isDisplayed) {
          return isDisplayed;
        });
      }, timeToWait);
    }

     waitForItemToBeClickable(elem) {
      const timeToWait = 10000;
      return browser.wait(EC.elementToBeClickable(elem), timeToWait);
    }


     waitforToastToBeShownAndHidden() {
      return this.closeAllBottomMessages();
    }

     closeAllBottomMessages() {
      const deferred = protractor.promise.defer();
      const elem = element.all(by.css('.toast-close-button'));
      elem.count().then(function (numOfToasters) {
        if (numOfToasters > 0) {
          browser.executeScript('$(".toast-close-button").click()').then(function () {
            deferred.fulfill(true);
          });
        } else {
          deferred.fulfill(true);
        }
      });
    }



     findRow (elements, matcher) {
      const  relevantRow = elements.filter(element => {
        return element.getText().then(text => {
          return text.includes(matcher);
        });
      })
        .first();
      return relevantRow;

    }

    presenceSyncLogin() {
       using(seleniumJsFlavours.Logininfo, function (data) {
         browser.driver.get('https://home-do65.dev.nice-incontact.com');
         browser.driver.findElement(by.id('ctl00_BaseContent_tbxUserName')).sendKeys(data.UN);
         browser.driver.findElement(by.id('ctl00_BaseContent_tbxPassword')).sendKeys(data.PW);
         browser.driver.findElement(by.id('ctl00_BaseContent_btnLogin')).click();
         console.log('logged in to d065 environment with Nice admin ');
         browser.driver.findElement(by.css('.icon-zero-picker')).click();
         browser.driver.findElement(by.css('#presencesync-icon')).click();

          const windowHandles = browser.getAllWindowHandles();
          let parentHandle, childHandle;

          windowHandles.then(function (handles) {
            parentHandle = handles[0];
            childHandle = handles[1];
            console.log('Total Handles : ' + handles.length);
            browser.switchTo().window(childHandle).then(() => {
              browser.driver.manage().window().setSize(1300, 800).then(() => { console.log('Window size set to 1300 X 800'); });
            });
          });

       });
    }

    presencesynclogout() {
      const windowHandles = browser.getAllWindowHandles();
      let parentHandle, childHandle;

      windowHandles.then(function (handles) {
        parentHandle = handles[0];
        childHandle = handles[1];
        console.log('Total Handles : ' + handles.length);
        browser.switchTo().window(childHandle);
        browser.driver.close();
        browser.switchTo().window(parentHandle);
        browser.driver.findElement(by.id('simple-dropdown')).click();
        browser.driver.findElement(by.id('Logout')).click();
        element(by.buttonText('Yes')).click();
       });
    }

    getSearchBoxForGrid(): ElementFinder {
      return element(by.css('#search-box'));
    }

    searchForGrid(searchParameter: string): promise.Promise<void> {
      browser.wait(EC.visibilityOf(this.getSearchBoxForGrid()), 10000);
      this.getSearchBoxForGrid().clear();
      return this.getSearchBoxForGrid().sendKeys(searchParameter);
    }

    allActionsDiv(idSelector: string): ElementArrayFinder {
      return element.all(by.css(idSelector));
    }

    selectActionsDiv(idSelector: string, index: number): promise.Promise<void> {
      return this.allActionsDiv(idSelector).get(index).click();
    }

    clickPopoverYesButton(): promise.Promise<void> {
      return element(by.buttonText('Yes')).click();
    }

    clickPopoverNoButton(): promise.Promise<void> {
      return element(by.buttonText('No')).click();
    }
  }
