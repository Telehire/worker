// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import {ChangeEvent, forwardRef, Dispatch, SetStateAction, useState, useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import CardContent from '@mui/material/CardContent'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { common } from '@mui/material/colors'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormControl from "@mui/material/FormControl";
import Link from "next/link";
import Icon from "@/@core/components/icon";

interface Contract {
  id: string
  name: string
  teamName: string
  startTime: string
  endTime: string
  createTime: string
  type: string
  status: string
}

const statusMap = {
  'DRAFT': '草稿',
}

const durationMap: any = {
  weekly: '每周',
  monthly: '每月',
  yearly: '每年',
}
const pageSizeList = [10, 20, 50, 100];

interface IParams {
  status: string[],
  type: string[],
  date: any
}

interface EntityProps {
  entiryCountry: string;
  entiryEnName: string;
  entiryId: string;
  entiryName: string;
  kycStatus: number;
  orgId: string;
  status: number;
}

interface CurrencyProps {
  countryCode: string;
  countryName: string;
  currencyId: string;
  currencyName: string;
  currencySymbol: string;
  currencyUnit: string;
  lng: string;
}

interface TeamProps {
  creator: string;
  founderId: string;
  gmtCreate?: any;
  gmtModified?: any;
  id: number;
  modifier: string;
  orgId: string;
  orgName: string;
  role: string;
  status: number;
  teamId: string
  teamName: string;
}

interface FormInputs {
  orgId: string,
  bizEntityId: string,
  certificateType: string,
  name: string,
  idNumber: string,
  startDate: any,
  endDate: any,
  isPermanent: string,
}


const TabsType: any =  {
  calc: 'Calc',
  tax: 'Tax',
  member: 'Member'
}

const VacateList = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [tabKey, setTabKey] = useState<string>('Calc')
  const { direction } = theme

  const defaultValues = {
    orgId: '',
    bizEntityId: '',
    certificateType: '1',
    name: '',
    idNumber: '',
    startDate: '',
    endDate: '',
    isPermanent: '',
  }
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })


  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column'
      }}
    >
      <Typography sx={{ fontSize: 20, fontWeight: 500, color: '#3A3541DE',mb: 6 }}>
        统计
      </Typography>
      <Grid container xs={12} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={10}>
          <Tabs value={tabKey} onChange={(e, val) => setTabKey(val)}>
            <Tab value={TabsType.calc} label="雇主成本计算器" />
            <Tab value={TabsType.tax} label="员工个人所得税" />
            <Tab value={TabsType.member} label="员工签证" />
          </Tabs>
        </Grid>
      </Grid>
      {
        tabKey === TabsType.calc && (
          <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
            <Grid item xs={5.8} sx={{flex: 1, mr: 8}}>
              <Card>
                <CardContent>
                  <CardHeader title="雇主成本计算器" sx={{textAlign: 'center'}}></CardHeader>
                  <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#3A3541DE',mb: 3 }}>
                    选择员工工作地
                  </Typography>
                  <Grid container sx={{mb: 6}}>
                    <Grid item xs={5.8}>
                      <FormControl fullWidth>
                        <InputLabel id='certificateType' error={Boolean(errors.certificateType)} htmlFor='certificateType'>
                          {t('国家/地区')}
                        </InputLabel>
                        <Controller
                          name='certificateType'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              label={t('国家/地区')}
                              value={value}
                              onChange={(e) => {
                                onChange(e.target.value)
                              }}
                              error={Boolean(errors.certificateType)}
                              labelId='certificateType'
                              aria-describedby='certificateType'
                            >
                              <MenuItem value={10}>{t('中国')}</MenuItem>
                              <MenuItem value={20}>{t('日本')}</MenuItem>
                              <MenuItem value={30}>{t('美国')}</MenuItem>
                              <MenuItem value={40}>{t('其他')}</MenuItem>
                            </Select>
                          )}
                        />
                        {errors.certificateType && (
                          <FormHelperText sx={{ color: 'error.main' }} id='certificateType'>
                            {t('This field is required')}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={0.4} />
                    <Grid item xs={5.8}>
                      <FormControl fullWidth>
                        <InputLabel id='certificateType' error={Boolean(errors.certificateType)} htmlFor='certificateType'>
                          {t('省/州')}
                        </InputLabel>
                        <Controller
                          name='certificateType'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              label={t('省/州')}
                              value={value}
                              onChange={(e) => {
                                onChange(e.target.value)
                              }}
                              error={Boolean(errors.certificateType)}
                              labelId='certificateType'
                              aria-describedby='certificateType'
                            >
                              <MenuItem value={10}>{t('浙江')}</MenuItem>
                              <MenuItem value={20}>{t('广东')}</MenuItem>
                              <MenuItem value={30}>{t('山东')}</MenuItem>
                              <MenuItem value={40}>{t('吉林')}</MenuItem>
                            </Select>
                          )}
                        />
                        {errors.certificateType && (
                          <FormHelperText sx={{ color: 'error.main' }} id='certificateType'>
                            {t('This field is required')}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#3A3541DE',mb: 3 }}>
                    选择职位
                  </Typography>
                  <Grid item xs={12} sx={{mb: 6}}>
                    <FormControl fullWidth>
                      <InputLabel id='certificateType' error={Boolean(errors.certificateType)} htmlFor='certificateType'>
                        {t('职称')}
                      </InputLabel>
                      <Controller
                        name='certificateType'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            label={t('职称')}
                            value={value}
                            onChange={(e) => {
                              onChange(e.target.value)
                            }}
                            error={Boolean(errors.certificateType)}
                            labelId='certificateType'
                            aria-describedby='certificateType'
                          >
                            <MenuItem value={10}>{t('初级')}</MenuItem>
                            <MenuItem value={20}>{t('中级')}</MenuItem>
                            <MenuItem value={30}>{t('高级')}</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.certificateType && (
                        <FormHelperText sx={{ color: 'error.main' }} id='certificateType'>
                          {t('This field is required')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#3A3541DE',mb: 3 }}>
                    月薪
                  </Typography>
                  <Grid container sx={{mb: 6}}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id='certificateType' error={Boolean(errors.certificateType)} htmlFor='certificateType'>
                          {t('月薪')}
                        </InputLabel>
                        <Controller
                          name='certificateType'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Grid container>
                              <Grid item xs={3.8}>
                                <Select
                                  sx={{width: '100%',borderRadius: 1}}
                                  label={t('职称')}
                                  value={value}
                                  onChange={(e) => {
                                    onChange(e.target.value)
                                  }}
                                  error={Boolean(errors.certificateType)}
                                  labelId='certificateType'
                                  aria-describedby='certificateType'
                                >
                                  <MenuItem value={10}>{t('初级')}</MenuItem>
                                  <MenuItem value={20}>{t('中级')}</MenuItem>
                                  <MenuItem value={30}>{t('高级')}</MenuItem>
                                </Select>
                              </Grid>
                              <Grid item xs={0.2} />
                              <Grid item xs={8}>
                                <TextField
                                  style={{width: '100%',borderRadius: '100px !important'}}
                                  label={t('请输入')}
                                  placeholder={t('请输入') || ''}
                                  value={value}
                                  onChange={onChange}
                                  error={Boolean(errors.name)}
                                  aria-describedby='name'
                                />
                              </Grid>
                            </Grid>
                          )}
                        />
                        {errors.certificateType && (
                          <FormHelperText sx={{ color: 'error.main' }} id='certificateType'>
                            {t('This field is required')}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      href='/'
                      component={Link}
                      variant='outlined'
                      onClick={() => {}}
                      endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}
                      sx={{
                        margin: 0,
                        borderRadius: 4,
                        color: '#fff',
                        backgroundColor: '#7C4DFF',
                        width: '100%'
                      }}
                    >
                      {t('查看')}
                    </Button>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item sx={{flex: 1,backgroundColor: '#fff'}}>
             <Card>
               <CardContent sx={{ height: 517 }}>
                 <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection: 'column', height: '100%'}}>
                   <Box component="img" src='/images/organization/tools/calc.png' width={90} sx={{mb: 10}} />
                   <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#3A354199' }}>
                     请在右侧输入你想要雇佣的员工信息，系统会帮你计算出雇佣成本
                   </Typography>
                 </Grid>
               </CardContent>
             </Card>
            </Grid>
          </Grid>
        )
      }

    </Box>
  )
}

export default VacateList
