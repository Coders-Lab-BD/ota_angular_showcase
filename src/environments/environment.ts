// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
function safeAccess(obj: Record<string, any>, path: string, defaultValue: any = undefined): any {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
}
export const environment = {
  production: false,
  projectName: '',
  // saveMessage: 'data save successfully.',
  // updateMessage: 'data updated successfully.',
  // savefailedMessage: 'data saved failed, Please Input required data to save.',
  // deletefailedMessage: 'data failed to delete.',
  // deleteMessage: 'data deleted successfully.',
  apiUrl: "http://localhost:5100/api/",
  checkoutUrl: "http://localhost:4200/",
  logo: '',
  //adminUrl : "http://b2b.travel-ion.com:8080/",
  adminUrl : safeAccess(window, 'env.adminUrl'),
  // Developer Information
  company: '',
  website: '',
  mailAddress: 'info@appsby.net',
  copyright: 'Copyright © 2020 <b><a href=\'#\' target=\'_blank\'>#</a></b> - All Rights Reserved.',
  socialFacebook: '',
  SocialTwitter: '',
  Galileo: 'Galileo',
  Sabre: 'Sabre',
  Refundable: 'Refundable',
  NonRefundable: 'Non Refundable',
  BankDepositId: 'a1e3502a-71f8-414e-b28c-f86a0057f070',
  // NagadId: '8AFD02C2-CF27-4EA8-99EE-F96CAA9223C5',
  NagadId: '5626856a-f176-458f-a436-c21b6e12fa85',
  Morning:'Before 12PM',
  Afternoon:'After 12PM - Before 6PM',
  Night:'After 6PM',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
