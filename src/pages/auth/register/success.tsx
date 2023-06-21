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
import SendMail from 'src/views/pages/auth/send-mails/SendMails'
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
import { RegisterParams } from '../../../context/types'
import { FormControlLabel } from '@mui/material'
import LogoWithSlogan from 'src/components/svg/LogoWithSlogan'
import DialogPrivacy from 'src/views/components/dialogs/DialogPrivacy'
import Sidebar from 'src/views/pages/sidebar-left/Sidebar'
import { REGISTER_VERIFY_TYPE } from '../../../enums/registerEnum'
import RedirectLogin from '../../../views/pages/auth/redirect-login/RedirectLogin'
import LogoText from '../../../components/svg/LogoText'
import Hidden from '@mui/material/Hidden'
import { MuiTelInputCountry } from 'mui-tel-input/dist/shared/constants/countries'
import {LOGIN_TYPE, REGISTER_TYPE} from "@/enums/loginEnum";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import toast from "react-hot-toast";
import RegisterStep1Page from "@/pages/auth/register/step1";

const color = '#fff'

let timer: any = null;

let lastSec = 5

const SuccessPage = () => {
  const { t } = useTranslation()
  const [name, setName] = useState<string>('')
  const [lastDescState, setLastDescState] = useState<any>('')
  const router = useRouter();
  useEffect(() => {
    const cusName = localStorage.getItem('REGISTER_ENTERPRISE_NAME');
    console.log(cusName)
    if(cusName){
      setName(JSON.parse(cusName))
      localStorage.removeItem('REGISTER_ENTERPRISE_NAME')
      startCountdown()
    }
  }, [])

  const startCountdown = () => {
    clearTimeout(timer)
    timer = null;
    console.log(lastSec)
    if(lastSec > 0) {
      setLastDescState(lastSec)
      timer = setTimeout(() => {
        lastSec -= 1
        startCountdown()
      }, 1000)
    } else {
     toLogin()
    }
  }

  const toLogin = () => {
    clearTimeout(timer)
    timer = null;
    router.replace('/auth/login')
  }

  return (
    <Grid container md={12} sm={12} sx={{height: '100%', backgroundColor: '#443699',display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Grid item xs={12} sx={{py: 7, px: 6 ,width: '100%' }}>
        <svg width={197} height={48} viewBox='0 0 197 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clipPath='url(#clip0_1060_15058)'>
            <path
              d='M19.927 13.5635H0V18.3713H7.24332V35.7046H12.6837V18.3713H19.927V13.5635Z'
              fill={color ?? 'currentColor'}
            />
            <path d='M37.0933 35.7044H42.2128V12.7725L37.0933 13.5632V35.7044Z' fill={color ?? 'currentColor'} />
            <path
              d='M57.7069 19.8893C56.3983 19.0759 54.8824 18.6585 53.3419 18.6874C52.1935 18.6605 51.0514 18.8658 49.9842 19.291C48.9171 19.7162 47.9468 20.3525 47.1315 21.1619C46.3163 21.9712 45.6729 22.9369 45.2399 24.0009C44.807 25.0649 44.5934 26.2055 44.612 27.3541C44.5916 28.9034 45.0082 30.4272 45.8139 31.7507C46.6136 33.0564 47.7354 34.1347 49.0718 34.8821C50.4999 35.6503 52.1 36.0422 53.7215 36.0208C54.9912 36.0405 56.2545 35.8371 57.4538 35.4198C58.6459 34.9754 59.7491 34.322 60.7117 33.4903L57.3273 30.4855C56.911 30.8964 56.4162 31.2191 55.8723 31.4344C55.2636 31.6521 54.6209 31.7592 53.9745 31.7507C53.3696 31.7557 52.769 31.6485 52.2032 31.4344C51.6716 31.2135 51.1882 30.8912 50.7798 30.4855C50.4007 30.0771 50.0949 29.6063 49.8761 29.0937H61.8007V27.8285C61.8322 26.1896 61.4515 24.5691 60.6937 23.1156C60.0131 21.7864 58.9798 20.6702 57.7069 19.8893ZM49.7677 25.5195C49.9104 25.0004 50.158 24.5159 50.4952 24.0962C50.8231 23.7087 51.2338 23.3999 51.6971 23.1925C52.1849 22.9765 52.7136 22.8686 53.247 22.8761C53.7734 22.8712 54.2936 22.9904 54.7653 23.2241C55.2285 23.4315 55.6393 23.7403 55.9672 24.1278C56.3352 24.524 56.606 25.0005 56.758 25.5195H49.7677Z'
              fill={color ?? 'currentColor'}
            />
            <path
              d='M30.6136 19.8893C29.3051 19.0759 27.7891 18.6585 26.2486 18.6874C25.1002 18.6605 23.9581 18.8658 22.891 19.291C21.8238 19.7162 20.8535 20.3525 20.0383 21.1619C19.223 21.9712 18.5796 22.9369 18.1467 24.0009C17.7137 25.0649 17.5001 26.2055 17.5187 27.3541C17.4983 28.9034 17.9149 30.4272 18.7206 31.7507C19.5203 33.0564 20.6422 34.1347 21.9786 34.8821C23.4066 35.6503 25.0068 36.0422 26.6282 36.0208C27.904 36.0426 29.1736 35.8392 30.3786 35.4198C31.5707 34.9754 32.6739 34.322 33.6366 33.4903L30.2521 30.4855C29.8358 30.8964 29.341 31.2191 28.7971 31.4344C28.1884 31.6521 27.5457 31.7592 26.8993 31.7507C26.2944 31.7556 25.6938 31.6484 25.128 31.4344C24.5964 31.2136 24.1129 30.8913 23.7047 30.4855C23.3255 30.0771 23.0197 29.6063 22.8009 29.0937H34.7255V27.8285C34.7572 26.1896 34.3765 24.569 33.6185 23.1156C32.933 21.7841 31.8932 20.6676 30.6136 19.8893ZM22.697 25.5195C22.8397 25.0004 23.0873 24.5159 23.4245 24.0962C23.7524 23.7087 24.1632 23.3999 24.6265 23.1925C25.1142 22.9765 25.6429 22.8686 26.1763 22.8761C26.7027 22.8712 27.2229 22.9904 27.6946 23.2241C28.1579 23.4315 28.5686 23.7403 28.8965 24.1278C29.2646 24.524 29.5353 25.0005 29.6873 25.5195H22.697Z'
              fill={color ?? 'currentColor'}
            />
            <path
              d='M78.985 14.4534V22.0717H69.8755V13.6084L64.4351 14.4669V35.7044H69.8755V27.0377H78.985V35.7044H84.4254V13.5903L78.985 14.4534Z'
              fill={color ?? 'currentColor'}
            />
            <path
              d='M121.654 19.8896C120.346 19.0761 118.83 18.6587 117.289 18.6876C116.14 18.6595 114.997 18.8638 113.929 19.2885C112.861 19.7131 111.889 20.3493 111.073 21.1588C110.257 21.9682 109.613 22.9343 109.179 23.999C108.746 25.0636 108.532 26.2049 108.55 27.3543C108.53 28.9036 108.947 30.4274 109.752 31.7509C110.552 33.0566 111.674 34.1349 113.01 34.8823C114.438 35.6505 116.039 36.0424 117.66 36.021C118.93 36.0407 120.193 35.8373 121.392 35.42C122.584 34.9756 123.688 34.3223 124.65 33.4906L121.266 30.4857C120.849 30.8966 120.355 31.2193 119.811 31.4346C119.202 31.6523 118.559 31.7594 117.913 31.7509C117.308 31.756 116.707 31.6487 116.142 31.4346C115.61 31.2137 115.127 30.8914 114.718 30.4857C114.339 30.0773 114.033 29.6065 113.815 29.094H125.721V27.8288C125.753 26.1899 125.372 24.5693 124.614 23.1159C123.941 21.7901 122.917 20.6743 121.654 19.8896ZM113.715 25.5197C113.858 25.0006 114.105 24.5162 114.443 24.0964C114.771 23.7089 115.181 23.4001 115.645 23.1927C116.132 22.9768 116.661 22.8689 117.195 22.8764C117.721 22.8714 118.241 22.9906 118.713 23.2243C119.176 23.4317 119.587 23.7406 119.915 24.128C120.283 24.5243 120.553 25.0007 120.705 25.5197H113.715Z'
              fill={color ?? 'currentColor'}
            />
            <path d='M92.9659 18.9722H87.8418V35.7046H92.9659V18.9722Z' fill={color ?? 'currentColor'} />
            <path
              d='M131.274 31.4436C131.054 31.2041 130.785 31.0136 130.486 30.8844C130.187 30.7552 129.865 30.6902 129.539 30.6935C129.21 30.6916 128.883 30.7572 128.58 30.8862C128.277 31.0152 128.004 31.2049 127.777 31.4436C127.544 31.6681 127.36 31.9379 127.236 32.2363C127.111 32.5347 127.05 32.8555 127.054 33.1787C127.051 33.5059 127.113 33.8304 127.237 34.1333C127.361 34.4362 127.544 34.7114 127.775 34.9428C128.006 35.1741 128.282 35.3571 128.585 35.4809C128.887 35.6047 129.212 35.667 129.539 35.6639C129.862 35.6683 130.183 35.6064 130.482 35.482C130.78 35.3577 131.05 35.1736 131.274 34.941C131.513 34.714 131.703 34.4405 131.832 34.1375C131.961 33.8344 132.026 33.5081 132.024 33.1787C132.028 32.8531 131.963 32.5304 131.833 32.2315C131.704 31.9327 131.514 31.6642 131.274 31.4436Z'
              fill='#FFC736'
            />
            <path
              d='M103.173 19.1304C102.42 19.479 101.76 19.999 101.244 20.6486V19.0355L96.1196 19.8488V35.7091H101.244V25.0769C101.644 24.4225 102.212 23.8872 102.889 23.527C103.581 23.1472 104.358 22.9512 105.148 22.9576C105.583 22.9569 106.018 22.9993 106.445 23.0842C106.839 23.1595 107.222 23.2871 107.583 23.4637V19.0039C106.988 18.6993 106.322 18.5575 105.654 18.5927C104.797 18.5786 103.948 18.7626 103.173 19.1304Z'
              fill={color ?? 'currentColor'}
            />
            <path
              d='M90.4044 17.115C89.8298 17.1133 89.2735 16.9126 88.8302 16.547C88.3869 16.1813 88.084 15.6734 87.973 15.1095C87.8621 14.5457 87.95 13.9609 88.2217 13.4545C88.4934 12.9482 88.9322 12.5517 89.4634 12.3325C89.9946 12.1133 90.5853 12.0849 91.1351 12.2522C91.6848 12.4195 92.1596 12.7721 92.4786 13.2501C92.7976 13.7281 92.9411 14.3018 92.8847 14.8737C92.8283 15.4455 92.5755 15.9802 92.1693 16.3866C91.9406 16.6222 91.6659 16.8085 91.3624 16.9337C91.0588 17.059 90.7328 17.1207 90.4044 17.115Z'
              fill={color ?? 'currentColor'}
            />
            <path
              d='M159.468 20.9562V23.9737L145.652 23.9986L145.902 25.4201L146.176 27.066C146.06 27.0992 145.852 27.174 145.553 27.2904C145.253 27.3902 144.888 27.5066 144.455 27.6396V35.9688H141.513V28.687C141.08 28.8366 140.665 28.9862 140.266 29.1358C139.867 29.2688 139.501 29.4018 139.169 29.5348C138.853 29.6512 138.578 29.7593 138.346 29.859C138.113 29.9422 137.947 30.0004 137.847 30.0336L137.074 26.7667C137.207 26.7335 137.423 26.6753 137.722 26.5922C138.021 26.4924 138.371 26.3843 138.77 26.268C139.169 26.135 139.601 25.9937 140.066 25.844C140.548 25.6944 141.031 25.5365 141.513 25.3702V21.0559H140.241C140.141 21.7708 140.041 22.4525 139.942 23.1008C139.842 23.7326 139.734 24.3062 139.617 24.8216L137.099 24.248C137.381 23.0842 137.631 21.7708 137.847 20.3078C138.063 18.8281 138.229 17.3069 138.346 15.7441L140.839 15.9935C140.806 16.3593 140.765 16.7333 140.715 17.1157C140.681 17.4981 140.64 17.8888 140.59 18.2878H141.513V13.8987L144.455 14.0234V18.2878H146.376V20.9811H150.964V19.2105H146.924V16.2429H150.964V13.774L153.882 13.8987V16.2429H158.171V19.2105H153.882V20.9562H159.468ZM144.455 24.3477C144.721 24.2646 144.954 24.1898 145.154 24.1233C145.353 24.0402 145.511 23.9737 145.627 23.9238V21.0559H144.455V24.3477ZM156.675 25.7193H158.894V28.662H156.675V32.6272C156.675 33.2423 156.625 33.7411 156.525 34.1234C156.426 34.5224 156.243 34.8383 155.977 35.0711C155.727 35.3205 155.387 35.495 154.954 35.5948C154.522 35.7112 153.982 35.8026 153.333 35.8691L151.563 36.0437L150.74 33.2007L152.485 33.0262C153.001 32.9763 153.333 32.8599 153.483 32.677C153.649 32.4942 153.732 32.1367 153.732 31.6047V28.662H149.692C150.025 29.0278 150.374 29.4102 150.74 29.8092C151.106 30.2082 151.421 30.5739 151.687 30.9064L149.667 33.2007C149.468 32.9181 149.235 32.6105 148.969 32.278C148.703 31.9289 148.429 31.5964 148.146 31.2805C147.864 30.948 147.589 30.6404 147.323 30.3578C147.074 30.0752 146.858 29.8424 146.675 29.6595L147.697 28.662H146.425V25.7193H153.732V24.3976L156.675 24.5223V25.7193Z'
              fill={color ?? 'currentColor'}
            />
            <path
              d='M183.243 24.5722H171.797V15.3451H176.261V13.6992L178.779 13.8239V15.3451H183.243V24.5722ZM171.921 31.8541C171.755 31.8707 171.547 31.8956 171.298 31.9289C171.049 31.9621 170.758 31.9954 170.425 32.0286V35.6197H167.757V32.3528C167.192 32.436 166.626 32.5191 166.061 32.6022C165.512 32.6687 164.989 32.7352 164.49 32.8017C164.008 32.8682 163.576 32.9264 163.193 32.9763C162.827 33.0262 162.545 33.0677 162.345 33.101L162.071 30.2331C162.204 30.1999 162.387 30.1749 162.62 30.1583C162.852 30.125 163.118 30.0918 163.418 30.0585V17.415H162.744V14.572H171.298V17.415H170.425V29.061C170.708 29.0278 170.949 29.0028 171.148 28.9862C171.348 28.953 171.514 28.9197 171.647 28.8865L171.772 30.4326L171.921 31.8541ZM166.136 17.415V19.6594H167.757V17.415H166.136ZM174.34 17.789V18.7616H176.261V17.789H174.34ZM178.779 17.789V18.7616H180.675V17.789H178.779ZM174.34 22.253H176.261V21.2305H174.34V22.253ZM180.675 22.253V21.2305H178.779V22.253H180.675ZM166.136 24.5722H167.757V22.4026H166.136V24.5722ZM175.862 27.7642L175.737 28.5872H182.72C182.72 28.6703 182.703 28.9114 182.67 29.3104C182.636 29.6928 182.595 30.1167 182.545 30.5822C182.512 31.0478 182.47 31.4966 182.42 31.9289C182.387 32.3445 182.362 32.6272 182.346 32.7768C182.296 33.3919 182.196 33.8824 182.046 34.2481C181.897 34.6305 181.681 34.9298 181.398 35.1459C181.115 35.3787 180.741 35.5449 180.276 35.6447C179.81 35.7444 179.228 35.8275 178.53 35.894L176.834 36.0437L176.011 33.3005L178.006 33.1509C178.322 33.1342 178.588 33.1093 178.804 33.076C179.02 33.0262 179.195 32.968 179.328 32.9015C179.461 32.8183 179.561 32.7103 179.627 32.5773C179.71 32.4443 179.769 32.2614 179.802 32.0286C179.835 31.8624 179.86 31.7045 179.877 31.5548C179.893 31.3886 179.918 31.214 179.951 31.0311H172.62L173.118 27.7642H171.198V25.4201H184.291V27.7642H175.862ZM167.757 29.46V27.3154H166.136V29.6845L167.757 29.46Z'
              fill={color ?? 'currentColor'}
            />
          </g>
          <defs>
            <clipPath id='clip0_1060_15058'>
              <rect width='196.627' height='48' fill={color ?? 'currentColor'} />
            </clipPath>
          </defs>
        </svg>

      </Grid>
      <Grid item xs={12} sx={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 20}}>
        <Box component="img" src="/images/register/success-back.png" width={162} />
        <Typography
          sx={{
            color: '#fff',
            fontSize: 48,
            fontWeight: 400,
            lineHeight: 1.5,
            mb: 3
          }}
        >
          {`Hello, ${name}`}
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 400,
            mb: 4.5
          }}
        >
          {t('您已成功注册 TeleHire特聘 的企业账号')}
        </Typography>
        <Typography
          sx={{
            color: '#FFFFFF80',
            fontSize: 14,
            fontWeight: 400,
            mb: 11,
            width: 410,
            textAlign: 'center'
          }}
        >
          {t('开始登录TeleHire平台，邀请团队经理；创建员工合同；签署承包商协议；管理您企业的工资账单和承包商账单。')}
        </Typography>
        <Button variant="contained" sx={{width: 430, py: 3, borderRadius: 1, mb: 6}} onClick={toLogin}>{t('进入登录')}</Button>
        <Typography
          sx={{
            color: '#FFFFFF80',
            fontSize: 14,
            fontWeight: 400,
            width: 410,
            textAlign: 'center',
            mb: 55
          }}
        >
          {`${lastDescState}${t('秒自动进入登录')}`}
        </Typography>
      </Grid>
    </Grid>
  )
}
SuccessPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

SuccessPage.guestGuard = true
export default SuccessPage
