export interface BillPropsType{
  id: string | number;
  name: string;
  jobTitle: string;
  billType: string;
  billPrice: string;
  billCurrency: string;
  billStatus: string;
  personImgUrl: string;
  [key: string]: any
}
export interface PayAccountType{
  id: string;
  corporateAccountsName: string;
  openingBank: string;
  corporateAccounts: string;
  openingAddress: string;
}

export interface PayInfoType{
  url: string;
  type: string;
  billNum: string;
  name: string;
  accountName: string;
  openingBank?: string;
  currency?: string;
  corporateAccounts?: string;
  openingAddress?: string;
  corporateAccountsName?: string;
}
