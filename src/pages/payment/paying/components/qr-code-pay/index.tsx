import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Icon from 'src/@core/components/icon'
import Button from "@mui/material/Button";
import { PayInfoType } from "@/types/biz/bill";

// ** React Imports
import { useEffect, useState } from 'react'

interface IProps{
  waitPayMoney: number;
  onCancel: any;
  onSure: any;
  payInfo: PayInfoType,
  payWay: string,
  finalInvoice?: any
}
const currencyMap: {[key: string]: any} = {
  'CNY': {
    name: '人民币',
    icon: '¥',
  },
  'USD': {
    name: '美元',
    icon: '$'
  }
}


const ChoosePayWay = (props: IProps) => {
  const { onCancel, onSure, payInfo, payWay, finalInvoice, waitPayMoney } = props;
  console.log('props', props)
  const handleDownload = (key: string) => {
    if(key === 'CSV') {
      window.open(`/api/pay/receipt/download-detail?receiptId=${finalInvoice.id}`)
    }
  }
  console.log(finalInvoice);
  return (
    <Grid container md={12}>
      <Grid item xs={12} sx={{backgroundColor: '#fff', borderRadius: '8px', padding: '24px', mb: 6}}>
        <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4}}>
          <Typography sx={{fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE'}}>待支付总额</Typography>
          <Grid sx={{textAlign: 'right'}}>
            <Typography sx={{fontSize: 24, fontWeight: 500, color: '#3A3541'}}>{`${currencyMap[finalInvoice.receiptCurrency]?.icon} ${(Number(finalInvoice.invoiceValue || waitPayMoney) / 1000).toFixed(2)}`}</Typography>
            <Typography sx={{fontSize: 12, fontWeight: 400, color: '#3A354199', display: 'flex', alignItems: 'center'}}>
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{display: 'flex',alignItems: 'center', justifyContent: 'space-round'}}>
          <Button sx={{fontSize: '12px',color: '#0E71A3', width: 55, height: '30px', flex: 1,mr: 5, border: '1px solid #0E71A3'}} onClick={() => {handleDownload('CSV')}}>下载CSV <Icon icon="material-symbols:download-rounded" style={{width: '18px',height: '18px'}} /></Button>
          <Button sx={{fontSize: '12px',color: '#0E71A3', width: 55, height: '30px', flex: 1, border: '1px solid #0E71A3'}}>下载PDF <Icon icon="material-symbols:download-rounded" style={{width: '18px',height: '18px'}} /></Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{backgroundColor: '#fff', borderRadius: '8px', padding: '24px'}}>
        {
          payWay !== 'BANK' && payWay !== 'VIRTUALCOIN' && <Grid item xs={12} >
            <Grid item xs={12} sx={{display: 'flex', alignItems: 'center',mb: 4, justifyContent: 'center'}}>
              <Box component="img" src={payInfo.url} sx={{width: '220px', height: '296px', mb: 6}} />
            </Grid>
            <Typography sx={{fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', color: '#3A3541DE', mb: 1}}>
              确认转账
            </Typography>
            <Typography sx={{fontSize: 12, fontWeight: 400, display: 'flex', alignItems: 'center', color: '#3A354199', mb: 3}}>
              请将账款转到TeleHire特聘以下账户，并附上发票ID编码
            </Typography>
            <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '9px 16px', mb: 3}}>
              <Grid item sx={{width: '105px',mr: 5}}>
                <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199', mb: 1}}>
                  转账备注信息
                </Typography>
                <Typography sx={{fontSize: 14, fontWeight: 400, display: 'flex', alignItems: 'center', color: '#3A3541DE'}}>
                  发票ID编码
                </Typography>
              </Grid>
              <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>
                  {payInfo.billNum}
                </Typography>
                <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
              <Grid item sx={{width: '105px',mr: 5}}>
                <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                  {payWay === 'WECHAT' ? '微信账号名称': '支付宝账号名称'}
                </Typography>
              </Grid>
              <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE'}}>
                  {payInfo.name}
                </Typography>
                <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
              <Grid item sx={{width: '105px', mr: 5}}>
                <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                  {payWay === 'WECHAT' ? '微信账号' : '支付宝账号'}
                </Typography>
              </Grid>
              <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE'}}>
                  {payInfo.billNum}
                </Typography>
                <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
              </Grid>
            </Grid>
          </Grid>
        }
        {
          payWay === 'BANK' && (
            <Grid item xs={12} >
              <svg width='155' height='20' viewBox='0 0 155 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M16.6761 1.18726H0V5.2107H6.06163V19.7162H10.6145V5.2107H16.6761V1.18726Z' fill='#7C4DFF' />
                <path d='M31.0417 19.7164H35.3261V0.525635L31.0417 1.18738V19.7164Z' fill='#7C4DFF' />
                <path
                  d='M48.2926 6.4812C47.1976 5.80049 45.929 5.45116 44.6398 5.47535C43.6787 5.45282 42.723 5.62462 41.8299 5.98046C40.9368 6.33629 40.1248 6.86883 39.4426 7.54613C38.7603 8.22342 38.2219 9.03153 37.8596 9.92199C37.4973 10.8124 37.3185 11.7669 37.3341 12.7281C37.317 14.0247 37.6656 15.2999 38.3399 16.4074C39.0091 17.5002 39.948 18.4025 41.0663 19.028C42.2614 19.6709 43.6005 19.9988 44.9574 19.9809C46.02 19.9974 47.0772 19.8272 48.0809 19.478C49.0785 19.1061 50.0017 18.5593 50.8073 17.8633L47.975 15.3486C47.6266 15.6925 47.2125 15.9626 46.7574 16.1427C46.248 16.3249 45.7101 16.4146 45.1692 16.4074C44.663 16.4117 44.1603 16.3219 43.6869 16.1427C43.242 15.9579 42.8374 15.6882 42.4957 15.3486C42.1784 15.0069 41.9225 14.6129 41.7394 14.184H51.7186V13.1252C51.745 11.7537 51.4264 10.3975 50.7922 9.18115C50.2227 8.06878 49.3579 7.13466 48.2926 6.4812ZM41.6487 11.1929C41.7681 10.7584 41.9753 10.353 42.2575 10.0017C42.5319 9.67747 42.8756 9.41902 43.2633 9.24543C43.6716 9.06475 44.114 8.97445 44.5604 8.98073C45.0009 8.97655 45.4362 9.07631 45.8309 9.2719C46.2186 9.44548 46.5624 9.70394 46.8368 10.0282C47.1448 10.3598 47.3714 10.7585 47.4985 11.1929H41.6487Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M25.6192 6.4812C24.5241 5.80049 23.2555 5.45116 21.9663 5.47535C21.0052 5.45282 20.0495 5.62462 19.1564 5.98046C18.2634 6.33629 17.4514 6.86883 16.7691 7.54613C16.0869 8.22342 15.5485 9.03153 15.1861 9.92199C14.8238 10.8124 14.6451 11.7669 14.6606 12.7281C14.6436 14.0247 14.9922 15.2999 15.6665 16.4074C16.3357 17.5002 17.2745 18.4025 18.3929 19.028C19.5879 19.6709 20.9271 19.9988 22.284 19.9809C23.3516 19.9992 24.4141 19.8289 25.4226 19.478C26.4201 19.1061 27.3434 18.5593 28.149 17.8633L25.3167 15.3486C24.9683 15.6925 24.5542 15.9626 24.0991 16.1427C23.5897 16.3249 23.0518 16.4146 22.5109 16.4074C22.0046 16.4116 21.502 16.3218 21.0285 16.1427C20.5836 15.958 20.179 15.6883 19.8374 15.3486C19.52 15.0069 19.2642 14.6129 19.0811 14.184H29.0603V13.1252C29.0868 11.7536 28.7682 10.3974 28.1338 9.18115C27.5602 8.06682 26.69 7.1325 25.6192 6.4812ZM18.9941 11.1929C19.1135 10.7584 19.3207 10.353 19.6029 10.0017C19.8773 9.67747 20.2211 9.41902 20.6088 9.24543C21.017 9.06475 21.4595 8.97445 21.9058 8.98073C22.3463 8.97655 22.7816 9.07631 23.1764 9.2719C23.5641 9.44548 23.9078 9.70394 24.1822 10.0282C24.4902 10.3598 24.7168 10.7585 24.844 11.1929H18.9941Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M66.0994 1.93221V8.30769H58.4761V1.22508L53.9232 1.94355V19.7162H58.4761V12.4635H66.0994V19.7162H70.6523V1.20996L66.0994 1.93221Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M101.807 6.48139C100.712 5.80067 99.4437 5.45135 98.1546 5.47553C97.1928 5.45197 96.2363 5.623 95.3423 5.97837C94.4484 6.33375 93.6355 6.86612 92.9524 7.54352C92.2694 8.22092 91.7302 9.02939 91.3675 9.92036C91.0047 10.8113 90.8257 11.7664 90.8413 12.7283C90.8242 14.0249 91.1728 15.3 91.8471 16.4076C92.5163 17.5003 93.4552 18.4027 94.5735 19.0282C95.7686 19.6711 97.1077 19.999 98.4646 19.9811C99.5272 19.9976 100.584 19.8274 101.588 19.4781C102.586 19.1063 103.509 18.5595 104.315 17.8635L101.482 15.3488C101.134 15.6927 100.72 15.9628 100.265 16.1429C99.7552 16.3251 99.2173 16.4148 98.6764 16.4076C98.1702 16.4119 97.6675 16.3221 97.1941 16.1429C96.7492 15.9581 96.3446 15.6884 96.0029 15.3488C95.6856 15.0071 95.4297 14.6131 95.2466 14.1841H105.211V13.1254C105.237 11.7538 104.918 10.3977 104.284 9.18133C103.721 8.07188 102.864 7.13806 101.807 6.48139ZM95.1634 11.193C95.2829 10.7586 95.4901 10.3532 95.7723 10.0019C96.0467 9.67765 96.3904 9.4192 96.7781 9.24561C97.1863 9.06493 97.6288 8.97463 98.0751 8.98091C98.5157 8.97673 98.951 9.07649 99.3457 9.27208C99.7334 9.44566 100.077 9.70412 100.352 10.0284C100.66 10.36 100.886 10.7587 101.013 11.193H95.1634Z'
                  fill='#7C4DFF'
                />
                <path d='M77.7991 5.71387H73.511V19.7165H77.7991V5.71387Z' fill='#7C4DFF' />
                <path
                  d='M109.858 16.1505C109.673 15.9501 109.449 15.7907 109.199 15.6826C108.949 15.5745 108.678 15.52 108.406 15.5228C108.13 15.5212 107.857 15.5761 107.604 15.6841C107.35 15.792 107.121 15.9508 106.931 16.1505C106.737 16.3384 106.583 16.5642 106.478 16.8139C106.374 17.0637 106.323 17.3321 106.326 17.6026C106.324 17.8764 106.376 18.148 106.479 18.4015C106.583 18.6549 106.736 18.8852 106.93 19.0788C107.123 19.2725 107.354 19.4256 107.607 19.5292C107.861 19.6328 108.132 19.6849 108.406 19.6824C108.677 19.686 108.945 19.6342 109.195 19.5301C109.444 19.4261 109.67 19.272 109.858 19.0773C110.058 18.8874 110.217 18.6586 110.325 18.4049C110.432 18.1513 110.487 17.8782 110.486 17.6026C110.489 17.3301 110.434 17.0601 110.326 16.8099C110.218 16.5598 110.058 16.3352 109.858 16.1505Z'
                  fill='#FFC736'
                />
                <path
                  d='M86.3414 5.84623C85.7115 6.13803 85.1585 6.57314 84.7267 7.11679V5.76682L80.4386 6.44748V19.7203H84.7267V10.8226C85.0613 10.2749 85.5366 9.82705 86.1032 9.52556C86.6823 9.20775 87.3333 9.04371 87.9939 9.0491C88.3583 9.0485 88.7218 9.08396 89.0792 9.15498C89.4095 9.21801 89.73 9.32484 90.0321 9.47262V5.74036C89.5335 5.48551 88.9766 5.36681 88.4174 5.39624C87.7 5.38451 86.9896 5.5385 86.3414 5.84623Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M75.6559 4.15955C75.175 4.15817 74.7094 3.9902 74.3385 3.68421C73.9675 3.37823 73.714 2.95314 73.6212 2.48129C73.5283 2.00945 73.6019 1.52002 73.8293 1.09629C74.0567 0.672567 74.4239 0.34074 74.8684 0.157286C75.3129 -0.0261669 75.8073 -0.0499095 76.2673 0.0901015C76.7274 0.230113 77.1247 0.525222 77.3917 0.925204C77.6587 1.32519 77.7788 1.80532 77.7316 2.28389C77.6844 2.76246 77.4728 3.20988 77.1328 3.55001C76.9414 3.74721 76.7116 3.90305 76.4575 4.00789C76.2035 4.11273 75.9307 4.16434 75.6559 4.15955Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M133.452 7.37382V9.89903L121.891 9.9199L122.099 11.1095L122.329 12.4869C122.231 12.5147 122.058 12.5773 121.807 12.6747C121.557 12.7582 121.251 12.8555 120.889 12.9669V19.9373H118.426V13.8434C118.064 13.9686 117.717 14.0938 117.383 14.219C117.049 14.3303 116.743 14.4416 116.464 14.5529C116.2 14.6503 115.971 14.7408 115.776 14.8242C115.581 14.8938 115.442 14.9425 115.358 14.9703L114.711 12.2364C114.823 12.2086 115.004 12.1599 115.254 12.0903C115.504 12.0069 115.797 11.9164 116.131 11.819C116.464 11.7077 116.826 11.5895 117.216 11.4642C117.619 11.339 118.023 11.2069 118.426 11.0677V7.45729H117.362C117.278 8.05555 117.195 8.62599 117.111 9.16859C117.028 9.69729 116.938 10.1773 116.84 10.6086L114.732 10.1286C114.969 9.15468 115.178 8.05555 115.358 6.83121C115.539 5.59295 115.678 4.31991 115.776 3.01208L117.863 3.22078C117.835 3.52687 117.8 3.83991 117.758 4.15991C117.731 4.47991 117.696 4.80686 117.654 5.14078H118.426V1.46774L120.889 1.57209V5.14078H122.496V7.39468H126.336V5.91295H122.955V3.42947H126.336V1.36339L128.778 1.46774V3.42947H132.367V5.91295H128.778V7.37382H133.452ZM120.889 10.2121C121.111 10.1425 121.306 10.0799 121.473 10.0242C121.64 9.95468 121.772 9.89903 121.87 9.85729V7.45729H120.889V10.2121ZM131.115 11.3599H132.972V13.8225H131.115V17.1408C131.115 17.6555 131.073 18.0729 130.99 18.3929C130.906 18.7268 130.753 18.9912 130.531 19.186C130.322 19.3947 130.037 19.5408 129.675 19.6242C129.313 19.7216 128.861 19.7981 128.318 19.8538L126.837 19.9999L126.148 17.6208L127.609 17.4747C128.04 17.4329 128.318 17.3355 128.444 17.1825C128.583 17.0295 128.652 16.7303 128.652 16.2851V13.8225H125.271C125.55 14.1286 125.842 14.4486 126.148 14.7825C126.454 15.1164 126.718 15.4225 126.941 15.7008L125.251 17.6208C125.084 17.3842 124.889 17.1268 124.666 16.8486C124.444 16.5564 124.214 16.2782 123.978 16.0138C123.741 15.7355 123.511 15.4782 123.289 15.2416C123.08 15.0051 122.899 14.8103 122.746 14.6573L123.602 13.8225H122.538V11.3599H128.652V10.2538L131.115 10.3582V11.3599Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M153.349 10.3999H143.77V2.67817H147.505V1.30078L149.613 1.40513V2.67817H153.349V10.3999ZM143.874 16.4938C143.735 16.5077 143.561 16.5286 143.352 16.5564C143.144 16.5842 142.9 16.6121 142.622 16.6399V19.6451H140.389V16.9112C139.916 16.9808 139.443 17.0503 138.97 17.1199C138.511 17.1755 138.072 17.2312 137.655 17.2868C137.251 17.3425 136.89 17.3912 136.57 17.4329C136.264 17.4747 136.027 17.5095 135.86 17.5373L135.631 15.1373C135.742 15.1095 135.895 15.0886 136.09 15.0747C136.284 15.0468 136.507 15.019 136.758 14.9912V4.41034H136.194V2.03121H143.352V4.41034H142.622V14.1564C142.858 14.1286 143.06 14.1077 143.227 14.0938C143.394 14.066 143.533 14.0382 143.644 14.0103L143.749 15.3042L143.874 16.4938ZM139.032 4.41034V6.2886H140.389V4.41034H139.032ZM145.898 4.72338V5.5373H147.505V4.72338H145.898ZM149.613 4.72338V5.5373H151.199V4.72338H149.613ZM145.898 8.45903H147.505V7.60338H145.898V8.45903ZM151.199 8.45903V7.60338H149.613V8.45903H151.199ZM139.032 10.3999H140.389V8.58425H139.032V10.3999ZM147.171 13.0712L147.067 13.7599H152.911C152.911 13.8295 152.897 14.0312 152.869 14.3651C152.841 14.6851 152.806 15.0399 152.764 15.4295C152.737 15.819 152.702 16.1947 152.66 16.5564C152.632 16.9042 152.611 17.1408 152.598 17.266C152.556 17.7808 152.472 18.1912 152.347 18.4973C152.222 18.8173 152.041 19.0677 151.804 19.2486C151.568 19.4434 151.255 19.5825 150.865 19.666C150.476 19.7494 149.989 19.819 149.404 19.8747L147.985 19.9999L147.297 17.7042L148.966 17.579C149.231 17.5651 149.453 17.5442 149.634 17.5164C149.815 17.4747 149.961 17.426 150.072 17.3703C150.184 17.3008 150.267 17.2103 150.323 17.099C150.392 16.9877 150.441 16.8347 150.469 16.6399C150.497 16.5008 150.518 16.3686 150.531 16.2434C150.545 16.1042 150.566 15.9581 150.594 15.8051H144.458L144.876 13.0712H143.269V11.1095H154.225V13.0712H147.171ZM140.389 14.4903V12.6955H139.032V14.6782L140.389 14.4903Z'
                  fill='#7C4DFF'
                />
              </svg>
              <Typography sx={{fontSize: 12, fontWeight: 400, display: 'flex', alignItems: 'center', color: '#3A354199', mb: 3}}>
                请将你的款项汇入 TeleHire 账户：
              </Typography>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '9px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199', mb: 1}}>
                    转账备注信息
                  </Typography>
                  <Typography sx={{fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', color: '#3A3541DE'}}>
                    发票ID编码
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE'}}>
                    {finalInvoice.receiptCode}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    货币
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>
                    {`${finalInvoice.receiptCurrency} - ${currencyMap[finalInvoice.receiptCurrency]?.name}`}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    转入账户名称
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 599, color: '#3A3541DE'}}>
                    {finalInvoice.toAccountName}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    转入开户行
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>
                    {finalInvoice.toBankName}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    转入账号
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>
                    {finalInvoice.toAccountNo}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    开户行地址
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>
                    {finalInvoice.toBankAddress}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
            </Grid>)
        }
        {
          payWay === 'VIRTUALCOIN' && (
            <Grid item xs={12} >
              <svg width='155' height='20' viewBox='0 0 155 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M16.6761 1.18726H0V5.2107H6.06163V19.7162H10.6145V5.2107H16.6761V1.18726Z' fill='#7C4DFF' />
                <path d='M31.0417 19.7164H35.3261V0.525635L31.0417 1.18738V19.7164Z' fill='#7C4DFF' />
                <path
                  d='M48.2926 6.4812C47.1976 5.80049 45.929 5.45116 44.6398 5.47535C43.6787 5.45282 42.723 5.62462 41.8299 5.98046C40.9368 6.33629 40.1248 6.86883 39.4426 7.54613C38.7603 8.22342 38.2219 9.03153 37.8596 9.92199C37.4973 10.8124 37.3185 11.7669 37.3341 12.7281C37.317 14.0247 37.6656 15.2999 38.3399 16.4074C39.0091 17.5002 39.948 18.4025 41.0663 19.028C42.2614 19.6709 43.6005 19.9988 44.9574 19.9809C46.02 19.9974 47.0772 19.8272 48.0809 19.478C49.0785 19.1061 50.0017 18.5593 50.8073 17.8633L47.975 15.3486C47.6266 15.6925 47.2125 15.9626 46.7574 16.1427C46.248 16.3249 45.7101 16.4146 45.1692 16.4074C44.663 16.4117 44.1603 16.3219 43.6869 16.1427C43.242 15.9579 42.8374 15.6882 42.4957 15.3486C42.1784 15.0069 41.9225 14.6129 41.7394 14.184H51.7186V13.1252C51.745 11.7537 51.4264 10.3975 50.7922 9.18115C50.2227 8.06878 49.3579 7.13466 48.2926 6.4812ZM41.6487 11.1929C41.7681 10.7584 41.9753 10.353 42.2575 10.0017C42.5319 9.67747 42.8756 9.41902 43.2633 9.24543C43.6716 9.06475 44.114 8.97445 44.5604 8.98073C45.0009 8.97655 45.4362 9.07631 45.8309 9.2719C46.2186 9.44548 46.5624 9.70394 46.8368 10.0282C47.1448 10.3598 47.3714 10.7585 47.4985 11.1929H41.6487Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M25.6192 6.4812C24.5241 5.80049 23.2555 5.45116 21.9663 5.47535C21.0052 5.45282 20.0495 5.62462 19.1564 5.98046C18.2634 6.33629 17.4514 6.86883 16.7691 7.54613C16.0869 8.22342 15.5485 9.03153 15.1861 9.92199C14.8238 10.8124 14.6451 11.7669 14.6606 12.7281C14.6436 14.0247 14.9922 15.2999 15.6665 16.4074C16.3357 17.5002 17.2745 18.4025 18.3929 19.028C19.5879 19.6709 20.9271 19.9988 22.284 19.9809C23.3516 19.9992 24.4141 19.8289 25.4226 19.478C26.4201 19.1061 27.3434 18.5593 28.149 17.8633L25.3167 15.3486C24.9683 15.6925 24.5542 15.9626 24.0991 16.1427C23.5897 16.3249 23.0518 16.4146 22.5109 16.4074C22.0046 16.4116 21.502 16.3218 21.0285 16.1427C20.5836 15.958 20.179 15.6883 19.8374 15.3486C19.52 15.0069 19.2642 14.6129 19.0811 14.184H29.0603V13.1252C29.0868 11.7536 28.7682 10.3974 28.1338 9.18115C27.5602 8.06682 26.69 7.1325 25.6192 6.4812ZM18.9941 11.1929C19.1135 10.7584 19.3207 10.353 19.6029 10.0017C19.8773 9.67747 20.2211 9.41902 20.6088 9.24543C21.017 9.06475 21.4595 8.97445 21.9058 8.98073C22.3463 8.97655 22.7816 9.07631 23.1764 9.2719C23.5641 9.44548 23.9078 9.70394 24.1822 10.0282C24.4902 10.3598 24.7168 10.7585 24.844 11.1929H18.9941Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M66.0994 1.93221V8.30769H58.4761V1.22508L53.9232 1.94355V19.7162H58.4761V12.4635H66.0994V19.7162H70.6523V1.20996L66.0994 1.93221Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M101.807 6.48139C100.712 5.80067 99.4437 5.45135 98.1546 5.47553C97.1928 5.45197 96.2363 5.623 95.3423 5.97837C94.4484 6.33375 93.6355 6.86612 92.9524 7.54352C92.2694 8.22092 91.7302 9.02939 91.3675 9.92036C91.0047 10.8113 90.8257 11.7664 90.8413 12.7283C90.8242 14.0249 91.1728 15.3 91.8471 16.4076C92.5163 17.5003 93.4552 18.4027 94.5735 19.0282C95.7686 19.6711 97.1077 19.999 98.4646 19.9811C99.5272 19.9976 100.584 19.8274 101.588 19.4781C102.586 19.1063 103.509 18.5595 104.315 17.8635L101.482 15.3488C101.134 15.6927 100.72 15.9628 100.265 16.1429C99.7552 16.3251 99.2173 16.4148 98.6764 16.4076C98.1702 16.4119 97.6675 16.3221 97.1941 16.1429C96.7492 15.9581 96.3446 15.6884 96.0029 15.3488C95.6856 15.0071 95.4297 14.6131 95.2466 14.1841H105.211V13.1254C105.237 11.7538 104.918 10.3977 104.284 9.18133C103.721 8.07188 102.864 7.13806 101.807 6.48139ZM95.1634 11.193C95.2829 10.7586 95.4901 10.3532 95.7723 10.0019C96.0467 9.67765 96.3904 9.4192 96.7781 9.24561C97.1863 9.06493 97.6288 8.97463 98.0751 8.98091C98.5157 8.97673 98.951 9.07649 99.3457 9.27208C99.7334 9.44566 100.077 9.70412 100.352 10.0284C100.66 10.36 100.886 10.7587 101.013 11.193H95.1634Z'
                  fill='#7C4DFF'
                />
                <path d='M77.7991 5.71387H73.511V19.7165H77.7991V5.71387Z' fill='#7C4DFF' />
                <path
                  d='M109.858 16.1505C109.673 15.9501 109.449 15.7907 109.199 15.6826C108.949 15.5745 108.678 15.52 108.406 15.5228C108.13 15.5212 107.857 15.5761 107.604 15.6841C107.35 15.792 107.121 15.9508 106.931 16.1505C106.737 16.3384 106.583 16.5642 106.478 16.8139C106.374 17.0637 106.323 17.3321 106.326 17.6026C106.324 17.8764 106.376 18.148 106.479 18.4015C106.583 18.6549 106.736 18.8852 106.93 19.0788C107.123 19.2725 107.354 19.4256 107.607 19.5292C107.861 19.6328 108.132 19.6849 108.406 19.6824C108.677 19.686 108.945 19.6342 109.195 19.5301C109.444 19.4261 109.67 19.272 109.858 19.0773C110.058 18.8874 110.217 18.6586 110.325 18.4049C110.432 18.1513 110.487 17.8782 110.486 17.6026C110.489 17.3301 110.434 17.0601 110.326 16.8099C110.218 16.5598 110.058 16.3352 109.858 16.1505Z'
                  fill='#FFC736'
                />
                <path
                  d='M86.3414 5.84623C85.7115 6.13803 85.1585 6.57314 84.7267 7.11679V5.76682L80.4386 6.44748V19.7203H84.7267V10.8226C85.0613 10.2749 85.5366 9.82705 86.1032 9.52556C86.6823 9.20775 87.3333 9.04371 87.9939 9.0491C88.3583 9.0485 88.7218 9.08396 89.0792 9.15498C89.4095 9.21801 89.73 9.32484 90.0321 9.47262V5.74036C89.5335 5.48551 88.9766 5.36681 88.4174 5.39624C87.7 5.38451 86.9896 5.5385 86.3414 5.84623Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M75.6559 4.15955C75.175 4.15817 74.7094 3.9902 74.3385 3.68421C73.9675 3.37823 73.714 2.95314 73.6212 2.48129C73.5283 2.00945 73.6019 1.52002 73.8293 1.09629C74.0567 0.672567 74.4239 0.34074 74.8684 0.157286C75.3129 -0.0261669 75.8073 -0.0499095 76.2673 0.0901015C76.7274 0.230113 77.1247 0.525222 77.3917 0.925204C77.6587 1.32519 77.7788 1.80532 77.7316 2.28389C77.6844 2.76246 77.4728 3.20988 77.1328 3.55001C76.9414 3.74721 76.7116 3.90305 76.4575 4.00789C76.2035 4.11273 75.9307 4.16434 75.6559 4.15955Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M133.452 7.37382V9.89903L121.891 9.9199L122.099 11.1095L122.329 12.4869C122.231 12.5147 122.058 12.5773 121.807 12.6747C121.557 12.7582 121.251 12.8555 120.889 12.9669V19.9373H118.426V13.8434C118.064 13.9686 117.717 14.0938 117.383 14.219C117.049 14.3303 116.743 14.4416 116.464 14.5529C116.2 14.6503 115.971 14.7408 115.776 14.8242C115.581 14.8938 115.442 14.9425 115.358 14.9703L114.711 12.2364C114.823 12.2086 115.004 12.1599 115.254 12.0903C115.504 12.0069 115.797 11.9164 116.131 11.819C116.464 11.7077 116.826 11.5895 117.216 11.4642C117.619 11.339 118.023 11.2069 118.426 11.0677V7.45729H117.362C117.278 8.05555 117.195 8.62599 117.111 9.16859C117.028 9.69729 116.938 10.1773 116.84 10.6086L114.732 10.1286C114.969 9.15468 115.178 8.05555 115.358 6.83121C115.539 5.59295 115.678 4.31991 115.776 3.01208L117.863 3.22078C117.835 3.52687 117.8 3.83991 117.758 4.15991C117.731 4.47991 117.696 4.80686 117.654 5.14078H118.426V1.46774L120.889 1.57209V5.14078H122.496V7.39468H126.336V5.91295H122.955V3.42947H126.336V1.36339L128.778 1.46774V3.42947H132.367V5.91295H128.778V7.37382H133.452ZM120.889 10.2121C121.111 10.1425 121.306 10.0799 121.473 10.0242C121.64 9.95468 121.772 9.89903 121.87 9.85729V7.45729H120.889V10.2121ZM131.115 11.3599H132.972V13.8225H131.115V17.1408C131.115 17.6555 131.073 18.0729 130.99 18.3929C130.906 18.7268 130.753 18.9912 130.531 19.186C130.322 19.3947 130.037 19.5408 129.675 19.6242C129.313 19.7216 128.861 19.7981 128.318 19.8538L126.837 19.9999L126.148 17.6208L127.609 17.4747C128.04 17.4329 128.318 17.3355 128.444 17.1825C128.583 17.0295 128.652 16.7303 128.652 16.2851V13.8225H125.271C125.55 14.1286 125.842 14.4486 126.148 14.7825C126.454 15.1164 126.718 15.4225 126.941 15.7008L125.251 17.6208C125.084 17.3842 124.889 17.1268 124.666 16.8486C124.444 16.5564 124.214 16.2782 123.978 16.0138C123.741 15.7355 123.511 15.4782 123.289 15.2416C123.08 15.0051 122.899 14.8103 122.746 14.6573L123.602 13.8225H122.538V11.3599H128.652V10.2538L131.115 10.3582V11.3599Z'
                  fill='#7C4DFF'
                />
                <path
                  d='M153.349 10.3999H143.77V2.67817H147.505V1.30078L149.613 1.40513V2.67817H153.349V10.3999ZM143.874 16.4938C143.735 16.5077 143.561 16.5286 143.352 16.5564C143.144 16.5842 142.9 16.6121 142.622 16.6399V19.6451H140.389V16.9112C139.916 16.9808 139.443 17.0503 138.97 17.1199C138.511 17.1755 138.072 17.2312 137.655 17.2868C137.251 17.3425 136.89 17.3912 136.57 17.4329C136.264 17.4747 136.027 17.5095 135.86 17.5373L135.631 15.1373C135.742 15.1095 135.895 15.0886 136.09 15.0747C136.284 15.0468 136.507 15.019 136.758 14.9912V4.41034H136.194V2.03121H143.352V4.41034H142.622V14.1564C142.858 14.1286 143.06 14.1077 143.227 14.0938C143.394 14.066 143.533 14.0382 143.644 14.0103L143.749 15.3042L143.874 16.4938ZM139.032 4.41034V6.2886H140.389V4.41034H139.032ZM145.898 4.72338V5.5373H147.505V4.72338H145.898ZM149.613 4.72338V5.5373H151.199V4.72338H149.613ZM145.898 8.45903H147.505V7.60338H145.898V8.45903ZM151.199 8.45903V7.60338H149.613V8.45903H151.199ZM139.032 10.3999H140.389V8.58425H139.032V10.3999ZM147.171 13.0712L147.067 13.7599H152.911C152.911 13.8295 152.897 14.0312 152.869 14.3651C152.841 14.6851 152.806 15.0399 152.764 15.4295C152.737 15.819 152.702 16.1947 152.66 16.5564C152.632 16.9042 152.611 17.1408 152.598 17.266C152.556 17.7808 152.472 18.1912 152.347 18.4973C152.222 18.8173 152.041 19.0677 151.804 19.2486C151.568 19.4434 151.255 19.5825 150.865 19.666C150.476 19.7494 149.989 19.819 149.404 19.8747L147.985 19.9999L147.297 17.7042L148.966 17.579C149.231 17.5651 149.453 17.5442 149.634 17.5164C149.815 17.4747 149.961 17.426 150.072 17.3703C150.184 17.3008 150.267 17.2103 150.323 17.099C150.392 16.9877 150.441 16.8347 150.469 16.6399C150.497 16.5008 150.518 16.3686 150.531 16.2434C150.545 16.1042 150.566 15.9581 150.594 15.8051H144.458L144.876 13.0712H143.269V11.1095H154.225V13.0712H147.171ZM140.389 14.4903V12.6955H139.032V14.6782L140.389 14.4903Z'
                  fill='#7C4DFF'
                />
              </svg>
              <Typography sx={{fontSize: 12, fontWeight: 400, display: 'flex', alignItems: 'center', color: '#3A354199', mb: 3}}>
                请将你的款项汇入 TeleHire 账户：
              </Typography>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '9px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199', mb: 1}}>
                    转账备注信息
                  </Typography>
                  <Typography sx={{fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', color: '#3A3541DE'}}>
                    发票ID编码
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE'}}>
                    {finalInvoice.receiptCode}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    货币
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>
                    {`${finalInvoice.receiptCurrency} - ${currencyMap[finalInvoice.receiptCurrency]?.name}`}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    转入账户名称
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 599, color: '#3A3541DE'}}>
                    {finalInvoice.toAccountName}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    转入开户行
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>
                    {finalInvoice.toBankName}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    转入账号
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>
                    {finalInvoice.toAccountNo}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{backgroundColor: '#F9FAFC', display: 'flex', alignItems: 'center', padding: '14px 16px', mb: 3}}>
                <Grid item sx={{width: '105px',mr: 5}}>
                  <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199',display: 'flex', alignItems: 'center'}}>
                    开户行地址
                  </Typography>
                </Grid>
                <Grid sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>
                    {finalInvoice.toBankAddress}
                  </Typography>
                  <Icon icon="material-symbols:file-copy-outline-rounded" style={{width: '16px', height: '16px',color: '#0E71A3',cursor: 'pointer'}} />
                </Grid>
              </Grid>
            </Grid>)
        }
        <Grid container xs={12} sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
          <Button variant="text" onClick={() => {onCancel()}} sx={{border: '1px solid #8A8D9380', borderRadius: '5px',color: '#8A8D93', width: 102, height: 38,mr: 2}}>稍后付款</Button>
          <Button variant="contained" onClick={() => {onSure()}} sx={{width: 73, height: 38}}>完成</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ChoosePayWay
