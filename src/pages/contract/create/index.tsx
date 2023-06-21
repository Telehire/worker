// ** React Imports
import { useState, ReactNode, MouseEvent, SetStateAction, useEffect, Fragment, useRef } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { setLocale } from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { common } from '@mui/material/colors'
import Dialog from '@mui/material/Dialog'
import axios from 'axios'
import { GET_CURRENT_USER_ORG_LIST, GET_ORG_ENTITY_LIST } from '@/apis'

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.info.main
}))

const ImgStyled = styled('img')(({ theme }) => ({
  width: 48,
  height: 48,
  marginRight: theme.spacing(5)
}))

type ContractGuideType = {
  logoSrc: string
  title: string
  summary: string
  learnUrl: string
  createUrl: string
}

const CreateContractPage = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)

  // ** Hooks
  const router = useRouter()
  const staffTypeImg = '/images/contract/staff.png'

  const checkCanCreateContract = (creatUrl: string) => {
    axios.get(GET_CURRENT_USER_ORG_LIST, {}).then(async res => {
      if (res.data.code === 'SUCCESS') {
        await axios.get(GET_ORG_ENTITY_LIST, { params: { orgId: res.data.data[0].orgId } }).then(res1 => {
          if (!res1.data.data.length || !res1.data.data.some((v: any) => v.kycStatus === 3 || v.kycStatus === 5)) {
            setShowEditDialog(true)
          } else {
            router.push(creatUrl)
          }
        })
      }
    })
  }
  const handleToKyc = () => {
    router.push('/enterprise/certification/')
  }

  const displayContractGuide = ({ logoSrc, title, summary, learnUrl, createUrl }: ContractGuideType) => {
    return (
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          p: '24px',
          backgroundColor: common.white,
          borderRadius: '8px',
          mb: 4
        }}
      >
        <Box
          sx={{
            width: '80%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <ImgStyled src={logoSrc} alt='Profile Pic' />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            <TypographyStyled variant='body1' sx={{ textAlign: 'left' }}>
              {title}
            </TypographyStyled>
            <TypographyStyled variant='body2' sx={{ textAlign: 'left' }}>
              {summary}
            </TypographyStyled>

            <LinkStyled
              href={learnUrl || ''}
              sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              {t('Staff.Learn_more')}
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'>
                <path fill={'currentColor'} d='M6.4 18L5 16.6L14.6 7H6V5h12v12h-2V8.4L6.4 18Z' />
              </svg>
            </LinkStyled>
          </Box>
        </Box>
        <LinkStyled
          href={'javascript:void(0);'}
          sx={{
            width: '20%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            minHeight: '90px',
            color: theme.palette.primary.main
          }}
          onClick={() => {
            checkCanCreateContract(createUrl || '/')
          }}
        >
          <Icon icon='ic:round-keyboard-arrow-right' />
        </LinkStyled>
      </Card>
    )
  }

  return (
    <Grid
      container
      spacing={6}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Grid item xl={8} lg={8} md={8} sm={11} xs={11}>
        <Box
          sx={{
            px: 6
          }}
        >
          <Box sx={{ mb: 6, mt: 20 }}>
            <TypographyStyled variant='h5'> {t('Staff.Create_contract')} </TypographyStyled>
            <TypographyStyled variant='body2'> {t('Staff.Create_contract_type')} </TypographyStyled>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {displayContractGuide({
              createUrl: '/contract/create/full-time',
              learnUrl: '/',
              logoSrc: staffTypeImg,
              summary: t('Staff.Full_time_desc'),
              title: t('Staff.Full_time_employee')
            })}

            {displayContractGuide({
              createUrl: '/contract/create/part-time',
              learnUrl: '/',
              logoSrc: staffTypeImg,
              summary: t('Staff.Part_time_desc'),
              title: t('Staff.Part_time_employee')
            })}
          </Box>
        </Box>
      </Grid>
      <Dialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false)
        }}
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md: 450 },
            '&::-webkit-scrollbar': {
              width: 4,
              borderRadius: 8
            },
            minWidth: { xs: '100%', md: '40%' },
            '&::-webkit-scrollbar-thumb': {
              background: '#d9d9d9',
              borderRadius: 8
            }
          }
        }}
      >
        <Grid
          container
          md={12}
          sm={12}
          sx={{
            py: 10,
            px: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box component='img' src='/images/organization/tips-back.png' width={240} sx={{ mb: 10 }} />
          <Typography sx={{ fontSize: 20, fontWeight: 500, mb: 5, textAlign: 'center' }}>
            请先完善组织认证信息
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#3A354199', mb: 5, textAlign: 'center' }}>
            请先完善组织详细信息后，才能使用 TeleHire 的相关功能
          </Typography>
          <Button
            size='large'
            variant='contained'
            onClick={() => {
              handleToKyc()
            }}
          >
            认证企业信息
          </Button>
        </Grid>
      </Dialog>
    </Grid>
  )
}

export default CreateContractPage
