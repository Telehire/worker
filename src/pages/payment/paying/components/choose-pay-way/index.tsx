import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { BillPropsType } from '@/types/biz/bill'

// ** React Imports
import { useEffect, useState } from 'react'
import { LOGIN_TYPE } from '@/enums/loginEnum'
import { styled } from '@mui/material/styles'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import { useTranslation } from 'react-i18next'
import { payWayMap } from '@/utils/constant'

interface waitPayListItemType {
  currencyType: string
  currencyTypeName: string
  exchangeRate: string
  money: string
  payCurrency: string
  paymentType: string
  [key: string]: any
}

interface payWayListItem {
  id: string
  name: string
  desc: string
  service: string
  serviceCharge: string
  url: string
  paymentType: string
  [key: string]: any
}

interface IProps {
  waitSavePayWayList: payWayListItem[]
  hasSavePayWayList: payWayListItem[]
  waitPayList: waitPayListItemType[]
  currentWay: string
  handleChoosePayWay: any
  waitPayMoney: number
  onCancel: any
  onSure: any
  billInfo: any
  accountInfo: any
}

const ToggleButtonGroupStyled = styled(ToggleButtonGroup)(({ theme }) => ({
  background: '#F5F7FA',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  padding: '4px',
  justifyContent: 'space-between',
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    fontSize: '1rem',
    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius
    }
  }
}))

const ToggleButtonStyled = styled(ToggleButton)(({ theme }) => ({
  width: '50%',
  fontSize: '1rem',
  height: '2.5rem',
  '&.Mui-selected': {
    background: theme.palette.common.white,
    color: theme.palette.primary.main,
    '&:hover': {
      background: theme.palette.common.white
    }
  },
  '&:not(.Mui-selected)': {
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const serviceMap: any = {
  service: '预估手续费',
  no: '免手续费'
}

const currencyMap: { [key: string]: any } = {
  CNY: {
    name: '人民币',
    icon: '¥'
  },
  USD: {
    name: '美元',
    icon: '$'
  },
  USDC: {
    name: 'USDC',
    icon: 'USDC'
  },
  USDT: {
    name: 'USDT',
    icon: 'USDT'
  }
}

const logoMap: any = {
  BANK: '/images/bill/bank-logo.png',
  ALIPAY: '/images/bill/alipay-logo.png',
  WECHAT: '/images/bill/wechart-logo.png',
  VIRTUALCOIN: '/images/bill/bitcoin-logo.png'
}

const ChoosePayWay = (props: IProps) => {
  const { t } = useTranslation()
  const {
    waitPayList,
    waitSavePayWayList,
    hasSavePayWayList,
    handleChoosePayWay,
    currentWay,
    onCancel,
    onSure,
    waitPayMoney,
    billInfo,
    accountInfo
  } = props
  const [total, setTotal] = useState<number>()
  const [showPayWayMode, setShowPayWayMode] = useState<string>('1')
  useEffect(() => {
    if (waitPayMoney) {
      setTotal(Number(waitPayMoney))
    } else {
      let sum = 0
      waitPayList.forEach(v => {
        sum += Number(Number((Number(v.money) / 1000) * Number(v.exchangeRate)).toFixed(2))
      })
      setTotal(sum)
    }
    console.log('waitPayList', waitPayList)
  }, [waitPayMoney, waitPayList])

  useEffect(() => {
    handleChoosePayWay({})
  }, [showPayWayMode])

  console.log('@@ ', props, showPayWayMode)

  return (
    <Grid container md={12}>
      <Grid item xs={12} sx={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px' }}>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>账单总额</Typography>
          <Typography
            sx={{ fontSize: 14, fontWeight: 600 }}
          >{`${billInfo.businessEntityCurrencyIcon} ${total}`}</Typography>
        </Grid>
        <Grid item xs={12} sx={{ backgroundColor: '#F9FAFC', borderRadius: '8px', py: 3, px: 4, mb: 2 }}>
          {waitPayList.map(v => (
            <Grid item xs={12} sx={{ display: 'flex', mb: 2 }}>
              <Typography sx={{ fontSize: 14, minWidth: '50px', fontWeight: 600, color: '#3A3541DE', mr: 8 }}>
                汇率
              </Typography>
              <Grid sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  sx={{ fontSize: 14, fontWeight: 500, color: '#3A3541DE' }}
                >{`1${v.currencyTypeName} ≈ ${v.exchangeRate}人民币`}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px' }}>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>选择付款方式</Typography>
        </Grid>
        <ToggleButtonGroupStyled
          exclusive
          value={showPayWayMode}
          onChange={(e, val) => {
            setShowPayWayMode(val)
          }}
          aria-label='text alignment'
          sx={{ mb: 7 }}
        >
          <ToggleButtonStyled value='1' aria-label='left aligned'>
            已保存的支付方式
          </ToggleButtonStyled>
          <ToggleButtonStyled value='2' aria-label='right aligned'>
            新的支付方式
          </ToggleButtonStyled>
        </ToggleButtonGroupStyled>
        {(showPayWayMode === '1' ? hasSavePayWayList : waitSavePayWayList).map(v => (
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: '#F9FAFC',
              borderRadius: '8px',
              padding: '12px 16px',
              mb: 4,
              display: 'flex',
              border: (showPayWayMode === '1' ? v.id === accountInfo.id : v.paymentType === currentWay)
                ? '1px solid #7C4DFF'
                : '1px solid #F9FAFC'
            }}
            onClick={() => {
              handleChoosePayWay(v)
            }}
          >
            <Box
              component='img'
              src={logoMap[v.paymentType]}
              sx={{ mr: 3, width: '40px', height: '40px', display: 'flex', alignItems: 'center' }}
            />
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {showPayWayMode === '2' ? (
                <Grid sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}>{v.name}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#909399' }}>{v.desc}</Typography>
                </Grid>
              ) : (
                <Grid sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}>{`${
                    payWayMap[v.paymentType]?.name
                  } - ${currencyMap[v.currency].name}`}</Typography>
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 488, color: '#909399' }}
                  >{`账户：${v.accountNo}`}</Typography>
                </Grid>
              )}
              <Grid sx={{ textAlign: 'right' }}>
                {v.paymentType === 'BANK' && (
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}
                  >{`${billInfo.businessEntityCurrencyIcon} ${billInfo.commissionCharge}`}</Typography>
                )}
                <Typography sx={{ fontSize: 12, fontWeight: 400, color: '#909399' }}>
                  {serviceMap[v.service]}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
        <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            variant='text'
            onClick={() => {
              onCancel()
            }}
            sx={{ border: '1px solid #8A8D9380', borderRadius: '5px', color: '#8A8D93', width: 73, height: 38, mr: 2 }}
          >
            取消
          </Button>
          <Button
            disabled={!currentWay}
            variant='contained'
            onClick={() => {
              onSure(total)
            }}
            sx={{ width: 87, height: 38 }}
          >
            {t('Next step')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ChoosePayWay
