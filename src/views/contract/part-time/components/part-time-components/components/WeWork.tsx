// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, ReactNode, SetStateAction, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography, { TypographyProps } from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

import { common } from '@mui/material/colors'
import Icon from '@/@core/components/icon'

import IconButton from '@mui/material/IconButton'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import DialogActions from '@mui/material/DialogActions';
import Radio from '@mui/material/Radio'
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import axios from "axios";
import {GET_PRODUCT_LIST_PRODUCTS} from "@/apis/product";
import { listItem } from '@/types/biz/contract'
import Checkbox from "@mui/material/Checkbox";


interface IProps {
  onClose: () => void
  show: boolean,
  list: listItem[],
  onSure: any,
}
enum Step {
  One = 1,
  Two = 2,
  Three = 3
}

interface FormInputs {
  employeeWorkCountry: string
  employeeWorkCity: string
}

const durationMap: any = {
  monthly: '每月支付',
  weekly: '每周支付',
  oneTime: '一次性',
}


const Img = styled('img')(({ theme }) => ({}))

export const WeWork = (props: IProps) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { onClose, show, list, onSure } = props
  const [step, setStep] = useState<Step>(Step.One)
  const [checkedValue, setCheckedValue] = useState<string>()
  const handleChangeCheck = (val: string) => {
    setCheckedValue(val)
  }
  const { currentContract } =  useSelector((state: RootState) => state.contract)

  const handleSure = async (callback: any) => {
    onSure([checkedValue]).then((res: any) => {
      console.log(res)
      if(res.data.code === 'SUCCESS') {
        callback()
      }
    });
  }

  const Guide = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Box component='img' src='/images/contract/office.png' sx={{ width: '44%', objectFit: 'contain' }} />
      <Box
        sx={{
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          position: 'relative',
          flex: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Box component='img' src='/images/contract/wework-logo.png' sx={{ height: 24 }}></Box>
          <IconButton
            size='small' onClick={onClose}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>
        <Typography sx={{ mt: 7.5, mb: 2, fontWeight: 500, fontSize: '20px' }}>
          {t('在您家附近共享办公空间')}
        </Typography>
        <Typography sx={{ mb: 11.5, fontWeight: 500, fontSize: '20px' }}>
          {t('月度会员计划')}
        </Typography>
        <Box sx={{ mb: 10, display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', color: theme.palette.primary.main }}>
          <Box component='img' src='/images/contract/guide_1.png' sx={{ mr: 4, width: 32 }}></Box>
          <Typography sx={{ fontSize: '14px' }}>
            {t('在移动工位、休息室、隔音电话间等各处工作')}
          </Typography>
        </Box>
        <Box sx={{ mb: 10, display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', color: theme.palette.primary.main }}>
          <Box component='img' src='/images/contract/guide_2.png' sx={{ mr: 4, width: 32 }}></Box>
          <Typography sx={{ fontSize: '14px' }}>
            {t('使用配额预订会客室和专属办公室')}
          </Typography>
        </Box>
        <Box sx={{ mb: 10, display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', color: theme.palette.primary.main }}>
          <Box component='img' src='/images/contract/guide_3.png' sx={{ mr: 4, width: 32 }}></Box>
          <Typography sx={{ fontSize: '14px' }}>
            {t('享受包括高速网络和无限量咖啡在内的办公必需品')}
          </Typography>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 24, alignSelf: 'center' }}>
          <Button size='large' type='submit' variant='contained' onClick={() => setStep(Step.Two)}>
            {t('添加联合办公会员')}
          </Button>
        </Box>
      </Box>
    </Box>
  )

  const SelectWeWork = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        m: 6,
        mt: 5
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4.5
        }}
      >
        <Box></Box>
        <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>
          {t('选择联合办公会员')}
        </Typography>
        <IconButton
          size='small' onClick={onClose}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <Grid container xs={12} spacing={1}>
        <Box>
          <Typography sx={{ fontSize: '16px', ml: 5, fontWeight: 500, mb: 3 }}>
            员工工作地: {`${currentContract.staffWorkplaceCountryName}, ${currentContract.staffWorkplaceStateName}, ${currentContract.staffWorkplaceCityName}`}
          </Typography>
          <Typography sx={{ fontSize: '14px', ml: 5, color: '#3A354199' }}>
            {t('为该工作地匹配的服务商如下')}
          </Typography>
        </Box>
        <Box sx={{ mt: 4.5, background: theme.palette.customColors.background3, borderRadius: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: 4, py: 6 }}>
        {
          list.map(v => (
              <Grid key={v.productId} container sx={{ mt: 4, backgroundColor: '#F9FAFC', borderRadius: '5px', padding: '16px 0' }} style={{display: 'flex', alignItems: 'center'}}>
                <Radio size="small" checked={checkedValue === v.productId} onChange={(e, val) => {handleChangeCheck(v.productId)}} />
                {
                  v.supplierIconUrl && <Img sx={{maxWidth: '48px', maxHeight: '48px'}} alt="" src={v.supplierIconUrl} />
                }
                <Grid item style={{flex: 1}}>
                  <Grid item style={{paddingLeft: '16px', fontSize: '16px', fontWeight: 600}}>
                    {v.lngProductName.find(item => (item.lng === i18n.language || item.lng.indexOf(i18n.language) !== -1))?.rvalue}
                  </Grid>
                </Grid>
                <Grid item xs={4} sm={4} style={{textAlign: 'right'}} sx={{pr: 2}}>
                  <Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.15' }}>
                    <span style={{marginRight: '5px'}}>{v.productNextCurrency}</span>
                    {`${v.productNextPriceStr}`}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, }}>
                    {durationMap[v.productPriceMode]}
                  </Typography>
                </Grid>
              </Grid>
            ))
          }
        </Box>

        <DialogActions sx={{ width: '100%' }}>
          <Button size='large' type='submit' variant='contained' onClick={() => {handleSure(() => setStep(Step.Three))}}>
            {t('+ 添加会员')}
          </Button>
        </DialogActions>
      </Grid>
    </Box>
  )

  const SuccessWeWork = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8.5 }}>
      <Box component='img' src='/images/contract/wework-success.png' width={96}></Box>
      <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 2, mt: 8 }}>
        {t('你已经成功的添加了WeWork会员')}
      </Typography>
      <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 5 }}>
        {t('Wework 将在员工合同生效后才生效')}
      </Typography>
      <Button size='large' type='submit' variant='contained' onClick={() => { onClose(); setStep(Step.One) }}>
        {t('知道了')}
      </Button>
    </Box>
  )

  return (
    <Dialog
      open={show}
      onClose={onClose}
      sx={{
        '.MuiPaper-root': {
          width: { xs: '100%', md: step === Step.Three ? 480 : 600 },
          '&::-webkit-scrollbar': {
            width: 4,
            borderRadius: 8
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#d9d9d9',
            borderRadius: 8
          }
        }
      }}
    >
      {step === Step.One ? <Guide /> : step === Step.Two ? <SelectWeWork /> : <SuccessWeWork />}
    </Dialog>
  )
}
