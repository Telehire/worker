export interface Staff {
  staffEmail: string
  staffMobile: string
  staffMobileCountry: string
  staffNationality: string
  staffWorkplaceCity: string
  staffWorkplaceCountry: string
  staffWorkplaceState: string
  staffWorkVisaCode: string
}

export interface ContractParams {
  action: string
  contractId: string
  orgId: string
  staff: Staff
  type: string
}

interface lngSupplierNameProps{
  lng: string
  rvalue: string
}

export interface listItem {
  supplierId: string;
  productNextPriceStr: string;
  productNextCurrency: string;
  productPriceMode: string;
  supplierIconUrl?: string,
  lngSupplierName: lngSupplierNameProps[],
  lngProductName: lngSupplierNameProps[],
  productId: string;
  [key: string]: any
}


export interface SalaryInfoType {
  name?: string;
  value?: string;
  desc?: any;
  click?: boolean;
  clickRender?: any
}

interface ChangeableSalaryType {
  title: string;
  data: SalaryInfoType[];
  isEmpty?: boolean;
  emptyDesc?: string
}

interface PreviewInfoMapItemType {
  title: string;
  data: SalaryInfoType[]
}

export interface PreviewInfoMapType {
  salaryInfo: PreviewInfoMapItemType
  changeableSalary: ChangeableSalaryType
  contractDetail: PreviewInfoMapItemType
  workScope: PreviewInfoMapItemType
  contractFinish: PreviewInfoMapItemType
  memberInfo: PreviewInfoMapItemType
}
