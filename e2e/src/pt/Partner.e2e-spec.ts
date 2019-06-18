import {PartnerPage} from './Partner.po';
import {browser, by, element, Key, protractor} from 'protractor';
import {TestUtils} from '../tests/protractor/common/testUtils';
import {TestUtilsNoUI} from '../tests/protractor/common/testUtilsNoUI';

const EC = protractor.ExpectedConditions;
const seleniumJsFlavours = require('../TestData');
const using = require('jasmine-data-provider');

let partnerPage: PartnerPage;
const testUtils: TestUtils = new TestUtils();
const testUtilsNoUI: TestUtilsNoUI = new TestUtilsNoUI();

describe('Partner Test Cases', () => {
  beforeAll(() => {
    testUtils.presenceSyncLogin();
    browser.wait(EC.browser.driver.sleep(5000));
    partnerPage = new PartnerPage();
  });
  afterAll(() => {
    testUtilsNoUI.deletePartner();
    testUtils.presencesynclogout();
  });

  it('should check if fields are present', function (testDone) {
     partnerPage.navigateToPartner();
    expect(partnerPage.clickPartnerElement());
    expect(partnerPage.isPartnerPagePresent()).toBeTruthy('The Partner page should be present');
    expect(partnerPage.clickOnboardPartnerButton());
    expect(partnerPage.isPartnerNameTextBoxPresent()).toBeTruthy('The partner name text box should appear');
    expect(partnerPage.isBuIdTextBoxPresent()).toBeTruthy('The BuId text box should appear');
    expect(partnerPage.isUsernameTextBoxPresent()).toBeTruthy('The username text box should appear');
    expect(partnerPage.isPartnerEmailTextBoxPresent()).toBeTruthy('The partner_email text box should appear');
    expect(partnerPage.isPasswordTextBoxPresent()).toBeTruthy('The password text box should appear');
    expect(partnerPage.clickSyncTitle());
    expect(browser.actions().sendKeys(protractor.Key.END).perform());
    expect(partnerPage.isClientSecretTextBoxPresent()).toBeTruthy('The client_secret text box should appear');
    expect(partnerPage.isBaseUriTextBoxPresent()).toBeTruthy('The base_uri text box should appear');
    testDone();
  });
  it('should check if Create&Activate button is disabled on landing ', function (testDone) {
    expect(partnerPage.getValidateRegisterButton().isEnabled()).toBe(false);
    testDone();
  });
  it('should check navigation on click on Cancel button', function (testDone) {
    partnerPage.navigateToPartner();
    expect(partnerPage.clickOnboardPartnerButton());
    expect(partnerPage.isPartnerCancelButtonPresent()).toBeTruthy('The cancel button should be present');
    expect(partnerPage.clickPartnerCancelButton());
    expect(partnerPage.isPartnerPagePresent()).toBeTruthy('The Partner page should be present');
    testDone();
  });
  it('should invalidate if fields are incorrect', function (testDone) {
    partnerPage.navigateToPartner();
    expect(partnerPage.clickOnboardPartnerButton());
    expect(partnerPage.enterPartnerName('Ring@Central'));
    expect(partnerPage.enterUsername(''));
    expect(partnerPage.enterEmail('com'));
    expect(partnerPage.enterPassword('RC'));
    expect(partnerPage.clickSyncTitle());
    expect(browser.actions().sendKeys(protractor.Key.END).perform());
    expect(partnerPage.enterbaseUri('www.url.com'));
    expect(partnerPage.enterClient('secret@'));
    expect(partnerPage.isValidateRegisterButtonPresent()).toBeFalsy(false);
    testDone();
  });
  using(seleniumJsFlavours.PartnerGoku, function (data) {
    it('should validate if password is incorrect, display error message pop-up', function (testDone) {
      partnerPage.navigateToPartner();
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit('101009'));
      expect(partnerPage.enterUsername(data.username));
      expect(partnerPage.enterPassword('123456789'));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterbaseUri(data.base_uri));
      expect(partnerPage.enterClient(data.client_secret));
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.isValidateRegisterButtonPresent()).toBeTruthy('The Create and Activate button should be present');
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalError());
      browser.wait(EC.browser.driver.sleep(1000));
      expect(partnerPage.getModalClose());
      testDone();
    });
    it('should validate if username is incorrect, display error message pop-up', function (testDone) {
      partnerPage.navigateToPartner();
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit('101009'));
      expect(partnerPage.enterUsername('123456767666'));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterbaseUri(data.base_uri));
      expect(partnerPage.enterClient(data.client_secret));
      expect(partnerPage.isValidateRegisterButtonPresent()).toBeTruthy('The Create and Activate button should be present');
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalError());
      expect(partnerPage.getModalClose());
      testDone();
    });
    it('should validate if Client Secret is incorrect, display error message pop-up', function (testDone) {
      partnerPage.navigateToPartner();
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit('101009'));
      expect(partnerPage.enterUsername(data.username));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterbaseUri(data.base_uri));
      expect(partnerPage.enterClient('RGp5d3V4b2ZkQUpWOWlValEtU0JDUFFFRWFlUVd3U='));
      expect(partnerPage.isValidateRegisterButtonPresent()).toBeTruthy('The Create and Activate button should be present');
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalError());
      browser.wait(EC.browser.driver.sleep(1000));
      expect(partnerPage.getModalClose());
      testDone();
    });
    it('should validate if Base URI is incorrect, display error message pop-up', function (testDone) {
      partnerPage.navigateToPartner();
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit('101009'));
      expect(partnerPage.enterUsername(data.username));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterbaseUri('www.test.com'));
      expect(partnerPage.enterClient(data.client_secret));
      expect(partnerPage.isValidateRegisterButtonPresent()).toBeTruthy('The Create and Activate button should be present');
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalError());
      browser.wait(EC.browser.driver.sleep(1000));
      expect(partnerPage.getModalClose());
      testDone();
    });
    it('should onboard partner, validate if fields are correct', function (testDone) {
       partnerPage.navigateToPartner();
       expect(partnerPage.clickOnboardPartnerButton());
       expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit('101009'));
       expect(partnerPage.enterUsername(data.username));
       expect(partnerPage.enterPassword(data.password));
       expect(partnerPage.enterEmail(data.email));
       expect(partnerPage.clickSyncTitle());
       expect(browser.actions().sendKeys(protractor.Key.END).perform());
       expect(partnerPage.enterbaseUri(data.base_uri));
       expect(partnerPage.enterClient(data.client_secret));
       expect(partnerPage.isValidateRegisterButtonPresent()).toBeTruthy('The CreatePartner Page should be present');
       expect(partnerPage.clickValidateRegisterButton());
       expect(partnerPage.isPartnerPagePresent());
       testDone();
     });
     it('should validate for duplicate entries', function (testDone) {
       expect(partnerPage.navigateToPartner());
       expect(partnerPage.clickOnboardPartnerButton());
       expect(partnerPage.enterPartnerName(data.name));
       expect(partnerPage.enterBusinessUnit('101009'));
       expect(partnerPage.enterUsername(data.username));
       expect(partnerPage.enterPassword(data.password));
       expect(partnerPage.enterEmail(data.email));
       expect(partnerPage.clickSyncTitle());
       expect(browser.actions().sendKeys(protractor.Key.END).perform());
       expect(partnerPage.enterbaseUri(data.base_uri));
       expect(partnerPage.enterClient(data.client_secret));
       expect(partnerPage.isValidateRegisterButtonPresent()).toBeTruthy('The CreatePartner Page should be present');
       expect(partnerPage.clickValidateRegisterButton());
       expect(partnerPage.GetRegisterPartnerError()).toEqual('Partner already registered');
       expect(partnerPage.clickPartnerCancelButton());
       browser.wait(EC.browser.driver.sleep(1000));
       testDone();
     });
   });
  });

describe('Update partner test cases', () => {
  beforeAll(() => {
    browser.wait(EC.browser.driver.sleep(5000));
    testUtils.presenceSyncLogin();
    browser.wait(EC.browser.driver.sleep(5000));
    testUtilsNoUI.createPartner();
    partnerPage = new PartnerPage();
  });
  afterAll(() => {
    testUtilsNoUI.deletePartner();
    testUtils.presencesynclogout();
  });
    using(seleniumJsFlavours.PartnerGoku, function (data) {
      it('on update partner details page, check all fields are populated with entered partner details', function (testDone) {
        partnerPage.navigateToPartner();
        const rows = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow = testUtils.findRow(rows, data.BUID);
        expect(relrow.getText()).toContain(data.BUID);
        relrow.getText().click();
        expect(partnerPage.enterPassword(data.password));
        expect(partnerPage.getUsernameText().then(function (username) {
          expect(username).toEqual(data.username);
        }));
        expect(partnerPage.getPasswordText().then(function (password) {
          expect(password).toEqual(data.password);
        }));
        expect(partnerPage.getPartnerEmailText().then(function (partnerEmailName) {
          expect(partnerEmailName).toEqual(data.email);
        }));
        expect(partnerPage.clickSyncTitle());
        expect(browser.actions().sendKeys(protractor.Key.END).perform());
        expect(partnerPage.getBaseUriText().then(function (BaseUri) {
          expect(BaseUri).toEqual(data.base_uri);
        }));
        expect(partnerPage.getClientText().then(function (ClientText) {
          expect(ClientText).toEqual(data.client_secret);
        }));
        testDone();
      });
      it('on update partner details, if any of the field is empty then save button must be disabled ', function (testDone) {
        partnerPage.navigateToPartner();
        const rows1 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow1 = testUtils.findRow(rows1, data.BUID);
        expect(relrow1.getText()).toContain(data.BUID);
        relrow1.getText().click();
        expect(partnerPage.enterPassword(data.password));
        expect(partnerPage.getUsernameTextBox().click());
        expect(partnerPage.getUsernameTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
        browser.wait(EC.browser.driver.sleep(1000));
        expect(partnerPage.getValidateRegisterButton().isEnabled()).toBeFalsy('false');
        expect(partnerPage.enterUsername(data.username));
        expect(partnerPage.getUsernameText().then(function (username) {
        }));

        expect(partnerPage.getPasswordTextBox().click());
        expect(partnerPage.getPasswordTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
        browser.wait(EC.browser.driver.sleep(10000));
        expect(partnerPage.getValidateRegisterButton().isEnabled()).toBeFalsy('false');
        expect(partnerPage.enterPassword(data.password));
        expect(partnerPage.getPasswordText().then(function (password) {
        }));
        expect(partnerPage.getPartnerEmailTextBox().click());
        expect(partnerPage.getPartnerEmailTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
        browser.wait(EC.browser.driver.sleep(10000));
        expect(partnerPage.enterEmail(data.email));
        expect(partnerPage.getPartnerEmailText().then(function (partnerEmailName) {
          expect(partnerEmailName).toEqual(data.email);
        }));

        expect(partnerPage.clickSyncTitle());
        expect(browser.actions().sendKeys(protractor.Key.END).perform());
        expect(partnerPage.getBaseUriTextBox().click());
        expect(partnerPage.getBaseUriTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
        browser.wait(EC.browser.driver.sleep(10000));
        expect(partnerPage.getValidateRegisterButton().isEnabled()).toBeFalsy('false');
        expect(partnerPage.enterbaseUri(data.base_uri));
        expect(partnerPage.getBaseUriText().then(function (BaseUri) {
          expect(BaseUri).toEqual(data.base_uri);
        }));

        expect(partnerPage.getClientTextBox().click());
        expect(partnerPage.getClientTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
        browser.wait(EC.browser.driver.sleep(10000));
        expect(partnerPage.getValidateRegisterButton().isEnabled()).toBeFalsy('false');
        expect(partnerPage.enterClient(data.client_secret));
        expect(partnerPage.getClientText().then(function (ClientText) {
          expect(ClientText).toEqual(data.client_secret);
        }));
        testDone();
      });
      it('on update partner details, update the fields by incorrect value and check if its updated or not', function (testDone) {
        partnerPage.navigateToPartner();
        const rows2 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow2 = testUtils.findRow(rows2, data.BUID);
        expect(relrow2.getText()).toContain(data.BUID);
        relrow2.getText().click();
        expect(partnerPage.enterPassword(data.password));
        expect(partnerPage.getUsernameTextBox().clear());
        expect(partnerPage.getUsernameTextBox().sendKeys('15175795340'));
        expect(partnerPage.clickValidateRegisterButton());
        expect(partnerPage.getModalClose());
        expect(partnerPage.clickPartnerCancelButton());
        const rows3 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow3 = testUtils.findRow(rows3, data.BUID);
        expect(relrow3.getText()).toContain(data.BUID);
        relrow3.getText().click();
        expect(partnerPage.getUsernameText().then(function (username) {
          expect(username).toEqual(data.username);
        }));
        expect(partnerPage.enterPassword(data.password));
        expect(partnerPage.getPartnerEmailTextBox().clear());
        expect(partnerPage.getPartnerEmailTextBox().sendKeys('Divyata.Da@nice.com'));
        expect(partnerPage.clickValidateRegisterButton());
        const rows4 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow4 = testUtils.findRow(rows4, data.BUID);
        expect(relrow4.getText()).toContain(data.BUID);
        relrow4.getText().click();
        expect(partnerPage.getPartnerEmailText().then(function (partnerEmailName) {
          expect(partnerEmailName === data.email).toBe(false);
        }));
        expect(partnerPage.enterPassword(data.password));
        expect(partnerPage.getPasswordTextBox().sendKeys('19549069311'));
        expect(partnerPage.clickValidateRegisterButton());
        expect(partnerPage.getModalClose());
        expect(partnerPage.clickPartnerCancelButton());
        const rows5 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow5 = testUtils.findRow(rows5, data.BUID);
        expect(relrow5.getText()).toContain(data.BUID);
        relrow5.getText().click();
        expect(partnerPage.getPasswordText().then(function (password) {
          expect(password === data.password).toBe(false);
        }));

          expect(partnerPage.enterPassword(data.password));
        browser.actions().mouseMove(element(by.css('#base_uri'))).perform();
        console.log('++++++SCROLLED Down+++++');
          expect(partnerPage.getBaseUriTextBox().clear());
          expect(partnerPage.getBaseUriTextBox().sendKeys('uwiiwuwuiwwoow'));
          expect(partnerPage.clickValidateRegisterButton());
          expect(partnerPage.getModalClose());
          expect(partnerPage.clickPartnerCancelButton());
          expect(partnerPage.GetPartnerByBUID(2));
        browser.actions().mouseMove(element(by.css('#base_uri'))).perform();
          expect(partnerPage.getBaseUriText().then(function (BaseUri) {
            expect(BaseUri).toEqual(data.base_uri);
          }));

        expect(partnerPage.enterPassword(data.password));
        browser.actions().mouseMove(element(by.css('#base_uri'))).perform();
        expect(partnerPage.getClientTextBox().clear());
        expect(partnerPage.getClientTextBox().sendKeys('19549069311'));
        expect(partnerPage.clickValidateRegisterButton());
        expect(partnerPage.getModalClose());
        expect(partnerPage.clickPartnerCancelButton());
        const rows6 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow6 = testUtils.findRow(rows6, data.BUID);
        expect(relrow6.getText()).toContain(data.BUID);
        relrow6.getText().click();
        browser.actions().mouseMove(element(by.css('#base_uri'))).perform();
        expect(partnerPage.getClientText().then(function (ClientText) {
          expect(ClientText).toEqual(data.client_secret);
        }));
        testDone();
      });
      it('on update partner details page, check and click cancel button', function (testDone) {
        partnerPage.navigateToPartner();
        const rows7 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow7 = testUtils.findRow(rows7, data.BUID);
        expect(relrow7.getText()).toContain(data.BUID);
        relrow7.getText().click();
        expect(partnerPage.isPartnerCancelButtonPresent()).toBeTruthy('Cancel button is present and enabled');
        expect(partnerPage.clickPartnerCancelButton());
        expect(partnerPage.isPartnerPagePresent()).toBeTruthy('The Partner page should be present');
        testDone();
      });
      it('Validation on Password field', function (testDone) {
        partnerPage.navigateToPartner();
        const rows8 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow8 = testUtils.findRow(rows8, data.BUID);
        expect(relrow8.getText()).toContain(data.BUID);
        relrow8.getText().click();
        expect(partnerPage.enterPassword('RCt'));
        expect(partnerPage.getPartnerTitle().click());
        expect(partnerPage.getPasswordLengthError()).toEqual('Must be at least 6 characters.');
        testDone();
      });
      it('validations for Username', function (testDone) {
        partnerPage.navigateToPartner();
        const rows9 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow9 = testUtils.findRow(rows9, data.BUID);
        expect(relrow9.getText()).toContain(data.BUID);
        relrow9.getText().click();
        expect(partnerPage.getUsernameTextBox().click());
        expect(partnerPage.getUsernameTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
        expect(partnerPage.clickPartnerTitle());
        expect(partnerPage.getInlineErrorMessage()).toEqual('This field is required.');
        testDone();
      });
      it('validations for Partner Email name', function (testDone) {
        partnerPage.navigateToPartner();
        const rows10 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow10 = testUtils.findRow(rows10, data.BUID);
        expect(relrow10.getText()).toContain(data.BUID);
        relrow10.getText().click();
        expect(partnerPage.getPartnerEmailTextBox().click());
        expect(partnerPage.getPartnerEmailTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
        expect(partnerPage.clickPartnerTitle());
        expect(partnerPage.getValidateRegisterButton().isEnabled());
        expect(partnerPage.getPartnerEmailTextBox().sendKeys('         '));
        expect(partnerPage.getEmailErrorMesage()).toEqual('The email address you entered is not valid.');
        testDone();
      });
      it('validations for Client secret', function (testDone) {
        partnerPage.navigateToPartner();
        const rows11 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow11 = testUtils.findRow(rows11, data.BUID);
        expect(relrow11.getText()).toContain(data.BUID);
        relrow11.getText().click();
        expect(partnerPage.clickSyncTitle());
        expect(browser.actions().sendKeys(protractor.Key.END).perform());
        expect(partnerPage.getClientTextBox().clear());
        expect(partnerPage.getClientTextBox().sendKeys('!!!!!!!!!'));
        expect(partnerPage.getBaseUriTextBox().click());
        expect(partnerPage.getClientErrorMessage()).toEqual('This field should not contain special character.');
        testDone();
      });
      it('validations for Base Uri', function (testDone) {
        partnerPage.navigateToPartner();
        const rows12 = element.all(by.css('div.ag-body-container > [role="row"]'));
        const relrow12 = testUtils.findRow(rows12, data.BUID);
        expect(relrow12.getText()).toContain(data.BUID);
        relrow12.getText().click();
        expect(partnerPage.clickSyncTitle());
        expect(browser.actions().sendKeys(protractor.Key.END).perform());
        expect(partnerPage.getBaseUriTextBox().clear());
        expect(partnerPage.getBaseUriTextBox().sendKeys('!!!!!!!!!'));
        expect(partnerPage.getClientTextBox().click());
        expect(partnerPage.getBaseUrIErrorMessage()).toEqual('Specify Correct Url.');
        testDone();
      });
      xit('check status is Active and toggle switch is on', function (testDone) {
        partnerPage.navigateToPartner();
        expect(partnerPage.clickPartnerNametab());
        expect(partnerPage.getActiveStatus().isPresent()).toBeTruthy('must be active');
        testDone();
      });
      xit('Change the status of partner', function (testDone) {
        partnerPage.navigateToPartner();
        expect(partnerPage.getPartnerStatusActive()).toBeTruthy('Active');
        expect(partnerPage.clickPartnerNametab());
        expect(partnerPage.enterPassword(data.password));
        expect(partnerPage.getActiveTogge().click());
        browser.wait(EC.browser.driver.sleep(1000));
        expect(partnerPage.clickValidateRegisterButton());
        browser.wait(EC.browser.driver.sleep(1000));
        expect(partnerPage.clickPartnerElement());
        expect(partnerPage.getPartnerStatusInactive()).toBeTruthy('Inactive');
        testDone();
      });
    });
    xit('change the status to Inactive, get error message to delete tenants first, when tenants onboarded', function (testDone) {
      partnerPage.navigateToPartner();
      expect(partnerPage.clickPartnerNametab());
      expect(partnerPage.getActiveStatus().isPresent()).toBeTruthy('must be active');
      browser.wait(EC.browser.driver.sleep(1000));
      expect(partnerPage.getActiveStatus().click());
      browser.wait(EC.browser.driver.sleep(1000));
      expect(partnerPage.clickValidateRegisterButton());
      browser.wait(EC.browser.driver.sleep(1000));
      expect(partnerPage.getModalError()).toBeTruthy('Please delete child first');
      expect(partnerPage.getModalClose());
      testDone();
    });
  });



describe('Fuze Partner on boarding tes cases', () => {

  beforeAll(() => {
    testUtils.presenceSyncLogin();
    browser.wait(EC.browser.driver.sleep(5000));
    partnerPage = new PartnerPage();
  });
  afterAll(() => {
    testUtils.presencesynclogout();
  });
  it('on partner onboard page, select version for Fuze', function (testDone) {
    partnerPage.navigateToPartner();
    expect(partnerPage.clickPartnerElement());
    expect(partnerPage.clickOnboardPartnerButton());
    expect(partnerPage.isVersionButtonPresent()).toBeTruthy('select version for partners button peresnt');
    expect(partnerPage.clickVersionDropDown());
    expect(partnerPage.clickVersionFuzeButton());
    testDone();
  });
  it('should check if fields are present', function (testDone) {
    partnerPage.navigateToPartner();
    expect(partnerPage.clickPartnerElement());
    expect(partnerPage.isPartnerPagePresent()).toBeTruthy('The Partner page should be present');
    expect(partnerPage.clickOnboardPartnerButton());
    expect(partnerPage.clickVersionDropDown());
    expect(partnerPage.clickVersionFuzeButton());
    expect(partnerPage.isPartnerNameTextBoxPresent()).toBeTruthy('The partner name text box should appear');
    expect(partnerPage.isBuIdTextBoxPresent()).toBeTruthy('The BuId text box should appear');
    expect(partnerPage.isUsernameTextBoxPresent()).toBeTruthy('The username text box should appear');
    expect(partnerPage.isPartnerEmailTextBoxPresent()).toBeTruthy('The partner_email text box should appear');
    expect(partnerPage.isPasswordTextBoxPresent()).toBeTruthy('The password text box should appear');
    expect(partnerPage.clickSyncTitle());
    expect(browser.actions().sendKeys(protractor.Key.END).perform());
    expect(partnerPage.isAppTokenTextBoxPresent()).toBeTruthy('The App token text box should appear');
    expect(partnerPage.isWardenAuthUriTextPresent()).toBeTruthy('The warden Auth text box should appear');
    expect(partnerPage.isContactiveApiTextBoxPresent()).toBeTruthy('The Contactive API text box should appear');
    testDone();
  });
  it('should check if Create&Activate button is disabled on landing ', function (testDone) {
    expect(partnerPage.getValidateRegisterButton().isEnabled()).toBe(false);
    testDone();
  });
  it('should check navigation on click on Cancel button and then again navigate back to On-board fuze', function (testDone) {
    partnerPage.navigateToPartner();
    expect(partnerPage.clickOnboardPartnerButton());
    expect(partnerPage.isPartnerCancelButtonPresent()).toBeTruthy('The cancel button should be present');
    expect(partnerPage.clickPartnerCancelButton());
    expect(partnerPage.isPartnerPagePresent()).toBeTruthy('The Partner page should be present');
    expect(partnerPage.clickOnboardPartnerButton());
    expect(partnerPage.isVersionButtonPresent()).toBeTruthy('select version for partners button peresnt');
    expect(partnerPage.clickVersionDropDown());
    expect(partnerPage.clickVersionFuzeButton());
    testDone();
  });
  it('should invalidate if fields are incorrect', function (testDone) {
    partnerPage.navigateToPartner();
    expect(partnerPage.clickOnboardPartnerButton());
    expect(partnerPage.clickVersionDropDown());
    expect(partnerPage.clickVersionFuzeButton());
    expect(partnerPage.enterPartnerName('Ring@Central'));
    expect(partnerPage.enterBuId('12'));
    expect(partnerPage.enterUsername('11'));
    expect(partnerPage.enterEmail('com'));
    expect(partnerPage.enterPassword('RC'));
    expect(partnerPage.clickSyncTitle());
    expect(browser.actions().sendKeys(protractor.Key.END).perform());
    expect(partnerPage.enterAppToken('www.url.com'));
    expect(partnerPage.enterWardenAuthUri('secret@'));
    expect(partnerPage.enterContactiveApi('secret@'));
    expect(partnerPage.isValidateRegisterButtonPresent()).toBeFalsy(false);
    testDone();
  });
  using(seleniumJsFlavours.PartnerFuze, function (data) {
    it('should validate if password is incorrect, display error message pop-up', function (testDone) {
      partnerPage.navigateToPartner();
      browser.wait(EC.browser.driver.sleep(3000));
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.clickVersionDropDown());
      expect(partnerPage.clickVersionFuzeButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit(data.BUID));
      expect(partnerPage.enterUsername(data.username));
      expect(partnerPage.enterPassword('123456789'));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterAppToken(data.app_token));
      expect(partnerPage.enterWardenAuthUri(data.warden_auth_uri));
      expect(partnerPage.enterContactiveApi(data.contactive_api));
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalError());
      expect(partnerPage.getModalClose().click());
      testDone();
    });
    it('should validate if username is incorrect, display error message pop-up', function (testDone) {
      partnerPage.navigateToPartner();
      browser.wait(EC.browser.driver.sleep(3000));
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.clickVersionDropDown());
      expect(partnerPage.clickVersionFuzeButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit(data.BUID));
      expect(partnerPage.enterUsername('123112122'));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterAppToken(data.app_token));
      expect(partnerPage.enterWardenAuthUri(data.warden_auth_uri));
      expect(partnerPage.enterContactiveApi(data.contactive_api));
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalError());
      expect(partnerPage.getModalClose().click());
      testDone();

    });
    it('should validate if App token is incorrect, display error message pop-up', function (testDone) {
      partnerPage.navigateToPartner();
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.clickVersionDropDown());
      expect(partnerPage.clickVersionFuzeButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit(data.BUID));
      expect(partnerPage.enterUsername(data.username));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterAppToken('hdkwjdiwjdqjklml'));
      expect(partnerPage.enterWardenAuthUri(data.warden_auth_uri));
      expect(partnerPage.enterContactiveApi(data.contactive_api));
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalError());
      expect(partnerPage.getModalClose().click());
      testDone();

    });
    it('should validate if warden auth URI is incorrect, display error message pop-up', function (testDone) {
      partnerPage.navigateToPartner();
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.clickVersionDropDown());
      expect(partnerPage.clickVersionFuzeButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit(data.BUID));
      expect(partnerPage.enterUsername(data.username));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterAppToken(data.app_token));
      expect(partnerPage.enterWardenAuthUri('wdedjekn\nkjnxkn'));
      expect(partnerPage.enterContactiveApi(data.contactive_api));
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalError());
      expect(partnerPage.getModalClose().click());
      testDone();

    });
    it('should onboard partner, validate if fields are correct', function (testDone) {
      partnerPage.navigateToPartner();
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.clickVersionDropDown());
      expect(partnerPage.clickVersionFuzeButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit(data.BUID));
      expect(partnerPage.enterUsername(data.username));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterAppToken(data.app_token));
      expect(partnerPage.enterWardenAuthUri(data.warden_auth_uri));
      expect(partnerPage.enterContactiveApi(data.contactive_api));
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.isPartnerPagePresent());
      testDone();
    });
    it('should validate for duplicate entries', function (testDone) {
      partnerPage.navigateToPartner();
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickOnboardPartnerButton());
      expect(partnerPage.clickVersionDropDown());
      expect(partnerPage.clickVersionFuzeButton());
      expect(partnerPage.enterPartnerName(data.name));
      expect(partnerPage.enterBusinessUnit(data.BUID));
      expect(partnerPage.enterUsername(data.username));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.clickSyncTitle());
      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.enterAppToken(data.app_token));
      expect(partnerPage.enterWardenAuthUri(data.warden_auth_uri));
      expect(partnerPage.enterContactiveApi(data.contactive_api));
      browser.wait(EC.browser.driver.sleep(2000));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getDuplicateErrorMessage()).toEqual('Partner already registered');
      testDone();
    });
  });

});

describe('Update partner test cases for Fuze', () => {
  beforeAll(() => {
    testUtils.presenceSyncLogin();
    browser.wait(EC.browser.driver.sleep(5000));
    partnerPage = new PartnerPage();
  });
  afterAll(() => {
    testUtils.presencesynclogout();
  });
  using(seleniumJsFlavours.PartnerFuze, function (data) {

    const rows = element.all(by.css('div.ag-body-container > [role="row"]'));
    const relrow = testUtils.findRow(rows, data.BUID);

    it('on update partner details page, check all fields are populated with entered partner details', function (testDone) {

      partnerPage.navigateToPartner();
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.getUsernameText().then(function (username) {
        expect(username).toEqual(data.username);
      }));
      expect(partnerPage.getPasswordText().then(function (password) {
        expect(password).toEqual(data.password);
      }));
      expect(partnerPage.getPartnerEmailText().then(function (partnerEmailName) {
        expect(partnerEmailName).toEqual(data.email);
      }));
      expect(partnerPage.clickSyncTitle());

      expect(browser.actions().sendKeys(protractor.Key.END).perform());
      expect(partnerPage.getAppToken().then(function (appToken) {
        expect(appToken).toEqual(data.app_token);
      }));
      expect(partnerPage.getWardenText().then(function (wardenAuthUri) {
        expect(wardenAuthUri).toEqual(data.warden_auth_uri);
      }));
      expect(partnerPage.getContactiveText().then(function (contactiveAuthUri) {
        expect(contactiveAuthUri).toEqual(data.contactive_api);
      }));
      testDone();
    });
    it('on update partner details, if any of the field is empty then save button must be disabled ', function (testDone) {

      partnerPage.navigateToPartner();
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.getUsernameTextBox().click());
      expect(partnerPage.getUsernameTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
      browser.wait(EC.browser.driver.sleep(1000));
      expect(partnerPage.getValidateRegisterButton().isEnabled()).toBeFalsy('false');
      expect(partnerPage.enterUsername(data.username));
      expect(partnerPage.getUsernameText().then(function (username) {
      }));

      expect(partnerPage.getPasswordTextBox().click());
      expect(partnerPage.getPasswordTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
      browser.wait(EC.browser.driver.sleep(10000));
      expect(partnerPage.getValidateRegisterButton().isEnabled()).toBeFalsy('false');
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.getPasswordText().then(function (password) {
      }));
      expect(partnerPage.getPartnerEmailTextBox().click());
      expect(partnerPage.getPartnerEmailTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
      browser.wait(EC.browser.driver.sleep(10000));
      expect(partnerPage.enterEmail(data.email));
      expect(partnerPage.getPartnerEmailText().then(function (partnerEmailName) {
        expect(partnerEmailName).toEqual(data.email);
      }));

      testDone();
    });
    it('on update partner details, update the fields by incorrect value and check if its updated or not', function (testDone) {

      partnerPage.navigateToPartner();
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.getUsernameTextBox().clear());
      expect(partnerPage.getUsernameTextBox().sendKeys('15175795340'));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalClose());
      expect(partnerPage.clickPartnerCancelButton());
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.getUsernameText().then(function (username) {
        expect(username).toEqual(data.username);
      }));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.getPartnerEmailTextBox().clear());
      expect(partnerPage.getPartnerEmailTextBox().sendKeys('Divyata.Da@nice.com'));
      expect(partnerPage.clickValidateRegisterButton());
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.getPartnerEmailText().then(function (partnerEmailName) {
        expect(partnerEmailName === data.email).toBe(false);
      }));
      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.getPasswordTextBox().sendKeys('19549069311'));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalClose());
      expect(partnerPage.clickPartnerCancelButton());
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.getPasswordText().then(function (password) {
        expect(password === data.password).toBe(false);
      }));

      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.getAppTokenTextBox().clear());
      expect(partnerPage.getAppTokenTextBox().sendKeys('uwiiwuwuiwwoow'));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalClose());
      expect(partnerPage.clickPartnerCancelButton());
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.getAppTokenText().then(function (AppToken) {
        expect(AppToken).toEqual(data.app_token);
      }));

      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.getWardenTextBox().clear());
      expect(partnerPage.getWardenTextBox().sendKeys('uwiiwuwuiwwoow'));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalClose());
      expect(partnerPage.clickPartnerCancelButton());
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.getWardenAuthUriText().then(function (WardenAuthUri) {
        expect(WardenAuthUri).toEqual(data.warden_auth_uri);
      }));

      expect(partnerPage.enterPassword(data.password));
      expect(partnerPage.getContactiveApiTextBox().clear());
      expect(partnerPage.getContactiveApiTextBox().sendKeys('uwiiwuwuiwwoow'));
      expect(partnerPage.clickValidateRegisterButton());
      expect(partnerPage.getModalClose());
      expect(partnerPage.clickPartnerCancelButton());
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.getContactiveText().then(function (contactiveApi) {
        expect(contactiveApi).toEqual(data.contactive_api);
      }));
      testDone();
    });
    it('on update partner details page, check and click cancel button', function (testDone) {

      partnerPage.navigateToPartner();
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.isPartnerCancelButtonPresent()).toBeTruthy('Cancel button is present and enabled');
      expect(partnerPage.clickPartnerCancelButton());
      expect(partnerPage.isPartnerPagePresent()).toBeTruthy('The Partner page should be present');
      testDone();
    });
    it('Validation on Password field', function (testDone) {
      partnerPage.navigateToPartner();
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.enterPassword('RCt'));
      expect(partnerPage.getPartnerTitle().click());
      expect(partnerPage.getPasswordLengthError()).toEqual('Must be at least 6 characters.');
      testDone();
    });
    it('validations for Username', function (testDone) {

      partnerPage.navigateToPartner();
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.getUsernameTextBox().click());
      expect(partnerPage.getUsernameTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
      expect(partnerPage.clickPartnerTitle());
      expect(partnerPage.getInlineErrorMessage()).toEqual('This field is required.');
      testDone();
    });
    it('validations for Partner Email name', function (testDone) {

      partnerPage.navigateToPartner();
      expect(relrow.getText()).toContain(data.BUID);
      relrow.getText().click();
      expect(partnerPage.getPartnerEmailTextBox().click());
      expect(partnerPage.getPartnerEmailTextBox().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a', Key.BACK_SPACE)));
      expect(partnerPage.clickPartnerTitle());
      expect(partnerPage.getValidateRegisterButton().isEnabled());
      expect(partnerPage.getPartnerEmailTextBox().sendKeys('         '));
      expect(partnerPage.getEmailErrorMesage()).toEqual('The email address you entered is not valid.');
      testDone();
    });
  });

});
