// 当前支持国家及iso2
// 中国大陆：CN
// 泰国:TH
// 迪拜（阿拉伯联合酋长国）：AE
// 新加坡：SG
// 美国：US
// 日本：JP
// 韩国：KR
// 香港地区：HK
// 台湾地区：TW
export const filterCountrySupported = (countries: any) => {
  const filterIso2s = ['CN', 'TH', 'AE', 'SG', 'US', 'JP', 'KR', 'HK', 'TW']
  return countries.filter((c: { iso2: string }) => filterIso2s.includes(c.iso2))
}
