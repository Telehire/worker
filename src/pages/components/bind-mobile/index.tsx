import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import {Controller, useForm} from "react-hook-form";
import FormHelperText from "@mui/material/FormHelperText";
import {yupResolver} from "@hookform/resolvers/yup";
import {useTranslation} from "react-i18next";
import {styled, useTheme} from "@mui/material/styles";
import * as yup from "yup";
import {Switch, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Icon from "@/@core/components/icon";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from 'react'
import {common} from "@mui/material/colors";
import Button from "@mui/material/Button";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";
import {matchIsValidTel, MuiTelInput} from "mui-tel-input";
import {useAuth} from "@/hooks/useAuth";
import axios from "axios";
import {BIND_MOBILE} from "@/apis";
import Head from "next/head";

interface DialogFormInputs {
  phoneNumber: string,
  phoneVerifyCode: string
}

interface Iprops{
  handleClose: any
  defaultInfo: any
}

const MuiTelInputStyled = styled(MuiTelInput)(({ theme }) => ({
  backgroundColor: common.white
}))

let timer: any = null;

const BindMobile = ({handleClose, defaultInfo}:Iprops) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const [needWait, setNeedWait] = useState<number>(30)
  const auth = useAuth()
  const schemaDialog = yup.object().shape({
    phoneNumber: yup
      .string()
      .required()
      .test('isValidTel', 'phoneNumber is not valid phone number', function (value: any) {
        if (value) {
          return matchIsValidTel(value)
        }
        return false
      }),
    phoneVerifyCode: yup.string().min(6).required()
  })

  const defaultValues = {
    phoneNumber: '',
    phoneVerifyCode: ''
  }

  useEffect(() => {
    intervalSetWaitSendSms();
  }, [])


  const intervalSetWaitSendSms = () => {
    clearTimeOutTimer();
    const wait = localStorage.getItem('ContractHasSendSms');
    if(wait && (Number(wait) && Number(wait) > 0)) {
      setNeedWait(Number(JSON.parse(wait)))
      timer = setTimeout(() => {
        localStorage.setItem('ContractHasSendSms', JSON.stringify(Number(JSON.parse(wait)) -1))
        intervalSetWaitSendSms()
      }, 1000)
    } else {
      setNeedWait(0)
    }
  }

  const clearTimeOutTimer = () => {
    clearTimeout(timer);
    timer = null
  }

  const loadErrorCallback = () => {
    console.log('报错了')
  }

  const callback = async (res: any) => {
    if(res.ret === 0) {
      setNeedWait(30)
      localStorage.setItem('HasSendSmsRegister', JSON.stringify(30))
      clearTimeout(timer)
      intervalSetWaitSendSms()
      auth.sendSms(
        {
          phoneNumber: getValues('phoneNumber'),
          template: 'REGISTER',
          site: 'biz-gateway'
        },
        err => {
          setError('phoneVerifyCode', {
            type: 'manual',
            message: err ? err.message : 'sending sms failed'
          })
        }
      )
    }
  }

  const onSendSms = async () => {
    try {
      const valid = await trigger(['phoneNumber'])
      if(valid) {
        // 生成一个验证码对象
        // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
        //callback：定义的回调函数
        const {TencentCaptcha} = window as any
        if(TencentCaptcha) {
          const captcha = new TencentCaptcha('194503754', callback, {});

          // 调用方法，显示验证码
          captcha.show();
        }
      }
    }
    catch (error) {
      // 加载异常，调用验证码js加载错误处理函数
      loadErrorCallback();
    }
  }
  const {
    control,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = useForm<DialogFormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schemaDialog) })

  const handleSubmit = async () => {
    const valid  = await trigger(['phoneNumber', 'phoneVerifyCode']);
    if(valid) {
      const value = getValues('phoneNumber')
      const mobileCountry = value?.split(' ')?.[0]
      const mobile = value?.replace(mobileCountry, '').replace(/\s*/g, '')
      const params = {
        vcode: getValues('phoneVerifyCode'),
        mobile,
        mobileCountry: mobileCountry
      }
      axios.post(BIND_MOBILE, params).then(res => {
        if(res.data.code === 'SUCCESS') {
          handleClose()
        }
      })
    }
  }


  return (
    <Grid item xs={12} sx={{py: 4.5, px: 6}}>
      <Head>
        <script src="/js/TCaptcha.js" async />
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 6,
        }}
      >
        {/*<Box component='img' src='/images/contract/wework-logo.png' sx={{ height: 24 }}></Box>*/}
        <Typography sx={{fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
          绑定手机号
        </Typography>
        <IconButton
          size='small' onClick={handleClose} sx={{color: '#7C4DFF'}}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <Typography sx={{px: 6, fontSize: 14, fontWeight: 400, mb: 10}}>
        使用E签宝签署合同时，需要用手机号码进行实名认证，请先输入您的手机号码
      </Typography>
      <Grid item sx={{px: 6}}>
        <form autoComplete='off' >
          <FormControl fullWidth>
            <Controller
              name='phoneNumber'
              control={control}
              render={({ field }) => (
                <MuiTelInputStyled
                  {...field}
                  sx={{mb: 6}}
                  error={Boolean(errors.phoneNumber)}
                  defaultCountry={'CN'}
                  preferredCountries={['CN', 'US', 'TW', 'JP', 'HK', 'KR', 'SG', 'TH', 'AE', ]}
                  forceCallingCode
                  placeholder={t('Login.Mobile_placeholder') || ''}
                  focusOnSelectCountry
                  onChange={field.onChange}
                />
              )}
            />
            {errors.phoneNumber && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneNumber.message}</FormHelperText>
            )}
          </FormControl>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='phoneVerifyCode'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Box>
                    <TextField
                      sx={{ backgroundColor: common.white, width: '100%', mb: 6 }}
                      label={t('Login.Verification_code')}
                      value={value || ''}
                      onChange={onChange}
                      error={Boolean(errors.phoneVerifyCode)}
                      placeholder={t('Login.Verification_code') || ''}
                    />

                    <Button
                      onClick={onSendSms}
                      disabled={!!needWait}
                      sx={{
                        position: 'absolute',
                        right: 13,
                        top: 7,
                        color: theme.palette.primary.main,
                        cursor: 'pointer',
                        '&.MuiTypography-body1': {
                          '&:hover': {
                            color: theme.palette.primary.dark
                          }
                        }
                      }}
                    >
                      {!needWait ? `${t('Login.Send_verification_code')}` : `${needWait}秒`}
                    </Button>
                  </Box>
                )}
              />
              {errors.phoneVerifyCode && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.phoneVerifyCode.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid container justifyContent='flex-end' sx={{mb: 6}}>
            <Button size='large' variant='outlined' onClick={handleClose}>
              {t('取消')}
            </Button>
            <Button size='large' variant='contained' sx={{ ml: 3 }} onClick={() => {handleSubmit()}}>
              {t('确定')}
            </Button>
          </Grid>
        </form>
      </Grid>

    </Grid>
  )
}
export default BindMobile

