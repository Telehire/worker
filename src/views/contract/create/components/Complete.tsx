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
import Icon from '../../../../@core/components/icon'

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
import { listItem } from 'src/types/biz/contract'
import Checkbox from "@mui/material/Checkbox";


interface IProps {
  onClose: () => void
  show: boolean,
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
  monthly: '每月',
}


const Img = styled('img')(({ theme }) => ({}))

export const Complete = (props: IProps) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { onClose, show, onSure } = props
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

  const SuccessWeWork = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8.5 }}>
      <Box component='img' src='/images/contract/wework-success.png' width={96}></Box>
      <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 2, mt: 8 }}>
        {t('提交完成，等待报价')}
      </Typography>
      <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 5 }}>
        {t('Submit complete, wait for quote TeleHire will review the details and get back to you within 2 hours (there may be a delay for holidays)')}
      </Typography>
      <Button size='large' type='submit' variant='contained' onClick={() => { onSure() }}>
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
          width: { xs: '100%', md: 480 },
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
      <SuccessWeWork />
    </Dialog>
  )
}
