import {browser, by, element, ElementArrayFinder, ElementFinder, promise, protractor} from 'protractor';
import {first} from 'rxjs/internal/operators';
const EC = protractor.ExpectedConditions;

const ag_grid_utils = require('ag-grid-testing');

export class PartnerPage {

  navigateToPartner() {
    return browser.get('/partner');
  }

  getSidebarPartnerElement() {
    return element(by.css('#partner-sidebar-element'));
  }

  clickPartnerElement() {
    browser.wait(EC.elementToBeClickable(this.getSidebarPartnerElement()), 10000);
    return this.getSidebarPartnerElement().click();
  }

  getPartnerPage(): ElementFinder {
    return element(by.css('app-display-partner'));
  }

  isPartnerPagePresent(): promise.Promise<boolean> {
    return this.getPartnerPage().isPresent();
  }

  getPartnerTitle(): ElementFinder {
    return element(by.xpath('//a[contains(text(),\'Partners\')]'));
  }

  clickPartnerTitle() {
    return this.getPartnerTitle().click();
  }

  getOnboardPartnerButton(): ElementFinder {
    return element(by.css('#onboardPartner'));
  }

  isOnboardPartnerButtonPresent(): promise.Promise<boolean> {
    return this.getOnboardPartnerButton().isPresent();
  }

  clickOnboardPartnerButton() {
    return this.getOnboardPartnerButton().click();
  }

  getSelectFormatPage(): ElementFinder {
    return element(by.css('app-select-format'));
  }

  isSelectFormatPresent(): promise.Promise<boolean> {
    return this.getSelectFormatPage().isPresent();
  }

  getDropDownElement(): ElementFinder {
    return element(by.css('#dropdownMenu'));
  }
  isDropdownPresent(): promise.Promise<boolean> {
    return this.getDropDownElement().isPresent();
  }

  clickDropDown() {
    return this.getDropDownElement().click();
  }
  getFormat1Element() {
    return element(by.css('#format1'));
  }

  clickFormat1Element() {
    return this.getFormat1Element().click();
  }

  getCreatePartnerPage(): ElementFinder {
    return element(by.css('app-create-partner'));

  }
  isCreatePartnerPresent(): promise.Promise<boolean> {
    return this.getCreatePartnerPage().isPresent();
  }

  getPartnerNameTextBox(): ElementFinder {
    return element(by.css('#partner-name'));
  }

  getPartnerNameText(): promise.Promise<String> {
    return this.getPartnerNameTextBox().getAttribute('value');
  }

  isPartnerNameTextBoxPresent(): promise.Promise<boolean> {
    return this.getPartnerNameTextBox().isPresent();
  }

  getBuIdTextBox(): ElementFinder {
    return element(by.css('#business_unit'));
  }

  isBuIdTextBoxPresent(): promise.Promise<boolean> {
    return this.getBuIdTextBox().isPresent();
  }

  getAuthUriTextBox(): ElementFinder {
    return element(by.css('#auth_uri'));
  }

  getAuthUriText(): promise.Promise<String> {
    return this.getAuthUriTextBox().getAttribute('value');
  }

  isAuthUriTextBoxPresent(): promise.Promise<boolean> {
    return this.getAuthUriTextBox().isPresent();
  }

  getUsernameTextBox(): ElementFinder {
    return element(by.css('#username'));
  }

  isUsernameTextBoxPresent(): promise.Promise<boolean> {
    return this.getUsernameTextBox().isPresent();
  }

  getUsernameText(): promise.Promise<String> {
    return this.getUsernameTextBox().getAttribute('value');
  }

  getBaseUriTextBox(): ElementFinder {
    return element(by.css('#base_uri'));
  }

  getAppTokenTextBox(): ElementFinder {
    return element(by.css('#app_token'));
  }

  getBaseUriText(): promise.Promise<String> {
    return this.getBaseUriTextBox().getAttribute('value');
  }
  getAppToken(): promise.Promise<String> {
    return this.getAppTokenTextBox().getAttribute('value');
  }

  isBaseUriTextBoxPresent(): promise.Promise<boolean> {
    return this.getBaseUriTextBox().isPresent();
  }

  getPasswordTextBox(): ElementFinder {
    return element(by.css('#password'));
  }
  getPasswordText(): promise.Promise<string> {
    return this.getPasswordTextBox().getAttribute('value');
  }

  isPasswordTextBoxPresent(): promise.Promise<boolean> {
    return this.getPasswordTextBox().isPresent();
  }

  getClientTextBox(): ElementFinder {
    return element(by.css('#client_secret'));
  }
  getClientText(): promise.Promise<String> {
    return this.getClientTextBox().getAttribute('value');
  }
  getWardenTextBox(): ElementFinder {
    return element(by.css('#warden_authURI'));
  }
  getWardenText(): promise.Promise<String> {
    return this.getWardenTextBox().getAttribute('value');
  }
  getContactiveTextBox(): ElementFinder {
    return element(by.css('#boss_api'));
  }
  getContactiveText(): promise.Promise<String> {
    return this. getContactiveTextBox().getAttribute('value');
  }
  isClientSecretTextBoxPresent(): promise.Promise<boolean> {
    return this.getClientTextBox().isPresent();
  }

  getPartnerEmailTextBox(): ElementFinder {
    return element(by.css('#email'));
  }

  getPartnerEmailText(): promise.Promise<String> {
    return this.getPartnerEmailTextBox().getAttribute('value');
  }

  isPartnerEmailTextBoxPresent(): promise.Promise<boolean> {
    return this.getPartnerEmailTextBox().isPresent();
  }

  enterPartnerName(partnerName) {
    browser.wait(EC.visibilityOf(this.getPartnerNameTextBox()), 1000);
    this.getPartnerNameTextBox().clear();
    return this.getPartnerNameTextBox().sendKeys(partnerName);
  }

  enterBusinessUnit(BUnit) {
    browser.wait(EC.visibilityOf(this.getBusinessUnitTextBox()), 1000);
    this.getBusinessUnitTextBox().clear();
    return this.getBusinessUnitTextBox().sendKeys(BUnit);
  }


  enterBuId(buid) {
    this.getBuIdTextBox().clear();
    return this.getBuIdTextBox().sendKeys(buid);
  }

  enterAuthUri(authUri) {
    browser.wait(EC.visibilityOf(this.getAuthUriTextBox()), 10000);
    this.getAuthUriTextBox().clear();
    return this.getAuthUriTextBox().sendKeys(authUri);
  }

  enterWardenAuthUri(wardenUri) {
    browser.wait(EC.visibilityOf(this.getWardenAuthUriTextBox()), 15000);
    this.getWardenAuthUriTextBox().clear();
    return this.getWardenAuthUriTextBox().sendKeys(wardenUri);
  }

  enterClient(clientSecret) {
    browser.wait(EC.visibilityOf(this.getClientTextBox()), 10000);
    this.getClientTextBox().clear();
    return this.getClientTextBox().sendKeys(clientSecret);
  }

  enterEmail(email) {
    browser.wait(EC.visibilityOf(this.getPartnerEmailTextBox()), 10000);
    this.getPartnerEmailTextBox().clear();
    return this.getPartnerEmailTextBox().sendKeys(email);
  }

  enterPassword(password) {
    browser.wait(EC.visibilityOf(this.getPasswordTextBox()), 10000);
    this.getPasswordTextBox().clear();
    return this.getPasswordTextBox().sendKeys(password);
  }

  enterUsername(username) {
    browser.wait(EC.visibilityOf(this.getUsernameTextBox()), 1000);
    this.getUsernameTextBox().clear();
    return this.getUsernameTextBox().sendKeys(username);
  }
  enterAppToken(apptoken) {
    browser.wait(EC.visibilityOf(this.getAppTokenTextBox()), 10000);
    this.getAppTokenTextBox().clear();
    return this.getAppTokenTextBox().sendKeys(apptoken);
  }

  enterbaseUri(baseUri) {
    browser.wait(EC.visibilityOf(this.getBaseUriTextBox()), 15000);
    this.getBaseUriTextBox().clear();
    return this.getBaseUriTextBox().sendKeys(baseUri);
  }

  enterContactiveApi(contactiveapi) {
    browser.wait(EC.visibilityOf(this.getContactiveApiTextBox()), 10000);
    this.getContactiveApiTextBox().clear();
    return this.getContactiveApiTextBox().sendKeys(contactiveapi);
  }
  getValidateRegisterButton(): ElementFinder {
    return element(by.css('#create-partner-create-btn-validate'));
  }

  isValidateRegisterButtonPresent(): promise.Promise<boolean> {
    return this.getValidateRegisterButton().isEnabled();
  }

  clickValidateRegisterButton() {
    return this.getValidateRegisterButton().click();
  }

  getPartnerCancelButton(): ElementFinder {
    return element(by.css('#create-partner-cancel-button'));
  }

  isPartnerCancelButtonPresent(): promise.Promise<boolean> {
    return this.getPartnerCancelButton().isPresent();
  }

  clickPartnerCancelButton() {
    return this.getPartnerCancelButton().click();
  }

  getModalClose() {
    return element(by.css('#clickOnOK'));
  }

  getModalError(): ElementFinder {
    browser.wait(element(by.id('myModalLabel')).isDisplayed, 5000);
    return element(by.css('#myModalLabel'));
  }

  getPasswordLengthError(): promise.Promise<string> {
    return element(by.css('#passwordErrorMinLength')).getText();
  }

  getPartnerNameTab(): ElementFinder {
    return element(by.css('.ag-body div[role="row"] div[col-id="name"]'));
  }

  clickPartnerNametab(): promise.Promise<void> {
    return this.getPartnerNameTab().click();
  }

  getUpdatePartnerPage(): ElementFinder {
    return element(by.xpath('//h1[@class=\'page-title\']'));
  }

  isUpdatePartnerPagePresent(): promise.Promise<boolean> {
    return this.getUpdatePartnerPage().isPresent();
  }

  getInlineErrorMessage(): promise.Promise<string> {
    return element(by.xpath('//div[@class=\'error-message\']')).getText();
  }
  getClientErrorMessage(): promise.Promise<string>  {
    return element(by.css('#specailcharerror')).getText();
  }
  getEmailErrorMesage(): promise.Promise<string>  {
    return element(by.css('#emailErrorMessage')).getText();
  }
  getPartnerNameErrorMessage(): promise.Promise<string>  {
    return element(by.css('#partnerError')).getText();
  }
  getAuthUrIErrorMessage(): promise.Promise<string>  {
    return element(by.css('#authUrlError')).getText();
  }
  getBaseUrIErrorMessage(): promise.Promise<string>  {
    return element(by.css('#baseUrlError')).getText();
  }
  getActiveStatus(): ElementFinder  {
    return element(by.xpath('//span[@class=\'text-to-display\']'));
  }
  getActiveTogge(): ElementFinder  {
    return element(by.xpath('//div[@class=\'slider round\']'));
  }
  getPartnerStatusInactive(): promise.Promise<string>  {
    return element(by.xpath('//div[contains(text(),\'Inactive\')]')).getText();
  }
  getPartnerStatusActive(): promise.Promise<string>  {
    return element(by.xpath('//div[contains(text(),\'Active\')]')).getText();
  }

  getDropdown(): ElementFinder {
    return element(by.xpath('//span[@class=\'selected-text\']'));
  }
  clickDropdown() {
    this.getDropdown().click();
  }
  getFormatRc(): ElementFinder {
    return element(by.css('#format1'));
  }
  clickFormatRc() {
    this.getFormatRc().click();
  }
  getSyncTitle(): ElementFinder {
    return element(by.css('.btn.btn-default.dropdown-toggle.big'));

  }
  clickSyncTitle(): promise.Promise<void> {
    return this.getSyncTitle().click();
  }

  getBusinessUnitTextBox(): ElementFinder {
    return element(by.id('business_unit'));
  }

  GetPartnerByBUID(rownumber): promise.Promise<void> {

    const CellLocator = ag_grid_utils.getLocatorForCell(rownumber, 'buId');
    const Locator = JSON.stringify(CellLocator);
    const Plocator = JSON.parse(Locator).value;
    return element(by.css(Plocator)).click();
  }

  GetRegisterPartnerError(): promise.Promise<string> {
    return element(by.css('.error-message')).getText();
  }


  getAppTokenText(): promise.Promise<String> {
    return this.getAppTokenTextBox().getAttribute('value');
  }

  isAppTokenTextBoxPresent(): promise.Promise<boolean> {
    return this.getAppTokenTextBox().isPresent();
  }
  getWardenAuthUriTextBox(): ElementFinder {
    return element(by.css('#warden_authURI'));
  }

  getWardenAuthUriText(): promise.Promise<String> {
    return this.getWardenAuthUriTextBox().getAttribute('value');
  }

  isWardenAuthUriTextPresent(): promise.Promise<boolean> {
    return this.getWardenAuthUriTextBox().isPresent();
  }
  getContactiveApiTextBox(): ElementFinder {
    return element(by.css('#boss_api'));
  }

  getContactiveApiText(): promise.Promise<String> {
    return this.getContactiveApiTextBox().getAttribute('value');
  }

  isContactiveApiTextBoxPresent(): promise.Promise<boolean> {
    return this.getContactiveApiTextBox().isPresent();
  }
  getVersionButton(): ElementFinder {
    return element(by.xpath('//span[@class=\'selected-text\']'));
  }
  isVersionButtonPresent(): promise.Promise<boolean> {
    return this.getVersionButton().isPresent();
  }
  clickVersionDropDown() {
    this.getVersionButton().click();
  }
  clickVersionFuzeButton() {
    return element(by.xpath('//a[contains(text(),\'Version 2\')]')).click();
  }
  getDuplicateErrorMessage(): promise.Promise<string>  {
    return element(by.xpath('//div[@class=\'error-message\']')).getText();
  }
}
