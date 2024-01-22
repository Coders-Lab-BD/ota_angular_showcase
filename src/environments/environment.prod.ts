function safeAccess(obj: Record<string, any>, path: string, defaultValue: any = undefined): any {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
}
export const environment = {
  production: true,
  projectName: 'lab',
  apiUrl: '/api/',
  checkoutUrl: "http://localhost:4200/",
  logo: '',
  //adminUrl : "http://b2b.travel-ion.com:8080/",
  adminUrl : safeAccess(window, 'env.adminUrl'),
  // Developer Information
  company: '',
  website: '',
  mailAddress: '',
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
