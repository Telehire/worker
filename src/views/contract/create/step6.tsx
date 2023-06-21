// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

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

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { common } from '@mui/material/colors'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { listItem, PreviewInfoMapType } from 'src/types/biz/contract'
import {cusFormatDate} from 'src/@core/utils/format'
import { WeWork } from './components/WeWork'
import Icon from '../../../@core/components/icon'
import { Stocks } from './components/Stocks'
import { Insurance } from './components/Insurance'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { Tools } from './components/Tools'
import { ReferenceCheck } from './components/ReferenceCheck'
import { Complete } from './components/Complete'
import { PreviewInfoCard }  from './components/DetailPreviewInfoCard'

// ** Next Import
import { useRouter } from 'next/router'
import {
  GET_PRODUCT_LIST_SUPPLIERS,
  GET_PRODUCT_LIST_PRODUCTS,
  GET_CONTRACT_PROFILE,
} from 'src/apis/product'
import {
  GET_LOCALE_COUNTRY,
  GET_CONTRACT_QUOTATION, STOP_EOR_CONTRACT, EDIT_CONTRACT_IN_DETAIL,
} from 'src/apis/contract'
import {getContractDetailById, saveEorContract} from 'src/store/apps/contract'

// ** Axios Imports
import axios from 'axios'
import ContractDetail from "@/views/contract/create/components/ContractDetail";
import ContractFinish from "@/views/contract/create/components/ContractFinish";
import MemberInfo from "@/views/contract/create/components/MemberInfo";
import CustomAvatar from "@/@core/components/mui/avatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

interface Props {
  orgId: string
  contractId: string
  getContractDetail: any
}

const durationMap: any = {
  monthly: '每月支付',
  weekly: '每周支付',
  oneTime: '一次性',
}

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 500,
  textAlign: 'center',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const TypographyStyled2 = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 400,
  textAlign: 'center',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 400,
  textDecoration: 'none',
  color: theme.palette.info.light
}))

const ImgStyled = styled('img')(({ theme }) => ({
  width: 48,
  height: 48,
  marginRight: theme.spacing(5)
}))

type AttachmentType = {
  logoSrc: string
  title: string
  summary: string
  learnUrl?: string
  showLearn: boolean
  showAdd: boolean
  showProvider: boolean
  showSurveyBox: boolean
  providerUrl?: string
  type: string
  onAdd?: () => void
  currencyKey?: string;
}

interface FormInputs {
  teamId: '',
  staffEmail: '',
}

interface DialogProps {
  children: ReactNode
  show: boolean
  onClose: () => void
}

enum AddDialogTypes {
  WeWork,
  Stocks,
  Insurance,
  Tools,
  ReferenceCheck,
  editSalary,
  editYearChangeable,
  editContractInfo,
  workScope,
  contractFinish,
  memberInfo
}
const Img = styled('img')(({ theme }) => ({}))

const previewInfoMapDefaultValue:PreviewInfoMapType = {
  salaryInfo: {
    title: '薪资',
    data: []
  },
  changeableSalary: {
    title: '年度可变薪酬',
    data: []
  },
  contractDetail: {
    title: '合同详情',
    data: []
  },
  workScope: {
    title: '工作范围说明',
    data: []
  },
  contractFinish: {
    title: '合同结束',
    data: []
  },
  memberInfo: {
    title: '员工信息',
    data: []
  }
}

const tempQuotationInfo = [
  {
    title: '报价概览',
  },
  {
    title: '估计一般月薪',
    infoMap: [
      {
        name: '总计',
        value: '$6909.01'
      },
      {
        name: '工资总额',
        value: '$ 4166.67'
      },
      {
        name: '雇主成本',
        value: '$ 1992.34'
      },
      {
        name: '平台费',
        value: '$ 599.00',
        desc: '每月599美元'
      },
    ]
  },
  {
    title: '签约奖金',
    titleDesc: '这将在第一个月的工资单上支付',
    infoMap: [
      {
        name: '总计',
        value: '待定'
      },
      {
        name: '签约奖金',
        value: '$ 3000.00'
      },
      {
        name: '签约奖金雇主成本',
        value: '$ 1992.34'
      },
    ]
  },
  {
    title: '预付押金',
    infoMap: [
      {
        name: '押金',
        value: '$ 12,318.01',
        desc: '预付1.5个月的费用'
      },
    ],
  }
]

const currencyMap: {[key: string]: string} = {
  'CNY': '人民币',
  'USD': '美元'
}

const currencyIconMap: {[key: string]: string} = {
  'CNY': '¥',
  'USD': '$'
}

let firstTimeGetDic = true


const Step5 = ({ orgId, contractId, getContractDetail }: Props) => {
  // 初始化
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const [dialogType, setDialogType] = useState<AddDialogTypes>(AddDialogTypes.WeWork)
  const { organizations, teams } = useSelector((state: RootState) => state.org)
  const [showDialogCompete, setShowDialogCompete] = useState(false)
  const [dic, setDic] = useState<{workSpaceList: listItem[], refrenceCheckList: listItem[]}>({workSpaceList: [], refrenceCheckList: []})
  const [quotationInfo, setQuotationInfo] = useState<any>([...tempQuotationInfo])
  const [contractProfileData, setContractProfileData] = useState([])
  const [previewInfoMap, setPreviewInfoMap] = useState<PreviewInfoMapType>({...previewInfoMapDefaultValue})
  const [areaInfo, setAreaInfo] = useState<{countries: any[], areaList: any[], cityList: any[]}>({countries: [], areaList: [], cityList: []})
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [editDialogType, setEditDialogType] = useState<string>('')
  const [deposit, setDeposit] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const defaultValues = {}
  const {currentContract} = useSelector((state: RootState) => state.contract)
  const { config } = useSelector((state: RootState) => state.config)
  useEffect(() => {
    if(firstTimeGetDic && currentContract.contractId) {
      fetchAllDic()
      firstTimeGetDic = false
    }
    setValue('teamId', currentContract.teamId)
    setValue('staffEmail', currentContract.staffEmail)
  }, [currentContract])
  useEffect(() => {
    fetchProfile()
  }, [areaInfo])

  useEffect(() => {
    initSetPreviewData()
  }, [organizations, teams, config, areaInfo])

  useEffect(() => {
    if(orgId) {
      getContractQuotationInfo()
      initSetPreviewData()
    }
  }, [currentContract, orgId])

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  // 图片资源
  const stockOptionsImg = '/images/contract/stockOptions.png'

  // 方法

  const findName = (id: any, arr: any, key?: string, label?: string) => {
    return (arr.find((v: any) => v[key || 'areaCode'] === id) as any || {} as any)[label || 'name']
  }

  const stopEorContract = () => {
    axios.get(STOP_EOR_CONTRACT, {params: {orgId, contractId: currentContract.contractId}}).then(res => {
      if(res.data.code === 'SUCCESS') {
        toast.success('终止成功')
        setShowEditDialog(false)
        getContractDetail(contractId)
      }
    })
  }

  const handleStopContract = () => {
    setEditDialogType('stop');
    setShowEditDialog(true)
  }

  const initSetPreviewData = () => {
    const memberInfo: any = {title: '员工信息',}
    const contractFinish:any = {title: '合同结束'}
    const workScope: any = {title: '工作范围说明'}
    const contractDetail: any = {title: '合同详情'}
    const salaryInfo: any = {title: '薪资'}
    const changeableSalary: any = {title: '年度可变薪酬'}
    if(currentContract.staff) {
      memberInfo.data = [
        {
          name: '法定全名',
          value: currentContract.staff.staffName
        },
        {
          name: '电子邮箱',
          value: currentContract.staff.staffEmail,
          click: !(currentContract.contractStatus === 'TERMINATION'),

        },
        {
          name: '国籍',
          value: findName(currentContract.staff.staffNationality, areaInfo.countries)
        },
        {
          name: '身份证号',
          value: currentContract.staff.staffIDCardNumber
        },
        {
          name: '就业地址',
          value: `${findName(currentContract.staff.staffWorkplaceCountry, areaInfo.countries)} ${findName(currentContract.staff.staffWorkplaceState, areaInfo.areaList)} ${findName(currentContract.staff.staffWorkplaceCity, areaInfo.cityList)}`
        },
        {
          name: '工作签证',
          value: currentContract.staff.staffWorkplaceCountry ===  currentContract.staff.staffNationality ? '不需要' : '需要'
        },
      ]
      contractFinish.data= [
        {
          name: '结束日期',
          value : cusFormatDate(new Date(currentContract.contractEndDate))
        },
        {
          name: t('Probationary period'),
          value : Math.ceil((Number(currentContract.probationEndDate) - Number(currentContract.planEntryDate))/(60000 * 60 * 24)) + '天'
        },
        {
          name: '试用期最后一天',
          value : cusFormatDate(new Date(currentContract.probationEndDate))
        },
        {
          name: '终止合同',
          click: !(currentContract.contractStatus === 'TERMINATION'),
          value: currentContract.contractStatus === 'TERMINATION' ? '已终止' : '',
          clickRender: () => (
            <Button sx={{border: '1px solid #FF4C5180', color: '#FF4C51',py: 1, px: 3}} onClick={handleStopContract}>终止合同</Button>
          )
        }
      ]
      workScope.data = [{desc: currentContract.jobDuty}]
      contractDetail.data = [
        {
          name: '期望入职时间',
          value: cusFormatDate(currentContract.planEntryDate),
        },
        {
          name: '职称',
          value: currentContract.jobTitle
        },
        {
          name: t('Employment Type'),
          value: currentContract.employmentType === 'full-time' ? '全职员工' : '兼职员工',
          desc: `每周工作时长 ${(config.workingHour as any)?.rvalue} 小时`
        },
        {
          name: t('Paid Vacation'),
          value: t('Standard'),
          desc: `${currentContract.paidVacationDays} 天带薪假期`
        },
        {
          name: t('Probationary period'),
          value: Math.ceil((Number(currentContract.probationEndDate) - Number(currentContract.planEntryDate))/(60000 * 60 * 24)) + '天'
        },
        {
          name: '归属实体',
          value: findName(currentContract.entiryId, organizations, 'entiryId', 'entiryName')
        },
        {
          name: '归属团队',
          value: findName(currentContract.teamId, teams, 'teamId', 'teamName'),
          click: !(currentContract.contractStatus === 'TERMINATION'),
        },
      ]
      salaryInfo.data = [
        {
          name: t('Monthly Salary'),
          value: (currencyIconMap[currentContract.salaryCurrency] || '¥') + ' ' +  Number(currentContract.salaryAmount / 1000).toFixed(2)
        },
        {
          // todo  详情接口缺乏签约奖金返回值
          name: '签约奖金',
          value: (currencyIconMap[currentContract.salaryCurrency] || '¥')  + ' ' + Number((currentContract.signingBonus || 0) / 1000).toFixed(2)
        }
      ]
      if(currentContract.variablePayInfo && currentContract.variablePayInfo.title) {
        changeableSalary.data = [
          {
            name: '标题',
            value: currentContract.variablePayInfo.title
          },
          {
            name: '生效日期',

            value: cusFormatDate(new Date(currentContract.variablePayInfo.startDay))
          },
          {
            name: '类型',
            value: currentContract.variablePayInfo.type
          },
          {
            name: currentContract.variablePayInfo.type === '固定金额' ? '金额': '百分比',
            value: currentContract.variablePayInfo.type === '固定金额' ? Number(currentContract.variablePayInfo.fixedValueLong / 1000).toFixed(2) : currentContract.variablePayInfo.percentageValueLong
          },
          {
            name: '支付频率',
            value: currentContract.variablePayInfo.period
          },
        ]
      }else{
        changeableSalary.isEmpty = true;
        changeableSalary.emptyDesc = `暂无${changeableSalary.title}信息`
      }

    }
    setPreviewInfoMap({
      memberInfo,
      contractFinish,
      workScope,
      contractDetail,
      salaryInfo,
      changeableSalary,
    })
  }

  const getContractQuotationInfo = () => {
    axios.get(GET_CONTRACT_QUOTATION, {params: {orgId: orgId, contractId: currentContract.contractId}}).then(res => {
      if(res.data.code === 'SUCCESS') {
        const result = res.data.data
        const middleQuotationInfo = [...tempQuotationInfo];
        const cur = currencyIconMap[currentContract.salaryCurrency]
        middleQuotationInfo[1].infoMap = [
          {
            name: '总计',
            value:  cur + result.normalMouthSalary
          },
          {
            name: '工资总额',
            value: cur + result.mouthSalarySum
          },
          {
            name: '雇主成本',
            value: cur + result.employerCost
          },
          {
            name: '平台费',
            value: cur + result.platformFee,
            desc: `每月${result.platformFee}${currencyMap[currentContract.salaryCurrency]}`
          },
        ]
        middleQuotationInfo[2].infoMap = [
          {
            name: '总计',
            value: cur + result.signBonusSum
          },
          {
            name: '签约奖金',
            value: cur + result.signBonus
          },
          {
            name: '签约奖金雇主成本',
            value: cur + result.signBonusEmpCost
          },
        ]
        middleQuotationInfo[3].infoMap = [
          {
            name: '押金',
            value: cur + result.deposit,

            // @ts-ignore
            desc: () => (
              <Typography sx={{color: '#3BB200', backgroundColor: '#43CA0014', fontSize: 12, fontWeight: 400, py: 1, px: 3}}>已支付</Typography>
            )
          },
        ]
        setDeposit(result.deposit)
        setQuotationInfo(middleQuotationInfo)
      }
    })
  }


  const fetchAllDic = () => {
    const defaultParams = {
      country: currentContract.staff?.staffWorkplaceCountry,
      city: currentContract.staff?.staffWorkplaceCity,
    }
    const getRefrenceCheck = axios.post(GET_PRODUCT_LIST_PRODUCTS, {...defaultParams, productType: 'REFERENCE-CHECK',})
    const getWorkSpace = axios.post(GET_PRODUCT_LIST_PRODUCTS, {...defaultParams, productType: 'WORKING-SPACE'});
    const getCountry = axios.get(GET_LOCALE_COUNTRY, {params: {parent:0}});
    const getArea= axios.get(GET_LOCALE_COUNTRY, {params: {parent: currentContract.staff.staffWorkplaceCountry}});
    const getCity = axios.get(GET_LOCALE_COUNTRY, {params: {parent: currentContract.staff.staffWorkplaceState}});
    Promise.all([getRefrenceCheck, getWorkSpace, getCountry, getArea, getCity]).then(res => {
      setDic({
        refrenceCheckList: res[0].data.data,
        workSpaceList: res[1].data.data,
      })
      setAreaInfo({
        countries: res[2].data.data,
        areaList: res[3].data.data,
        cityList: res[4].data.data
      })
    })
  }



  const fetchProfile = ()=>{
    axios.post(GET_CONTRACT_PROFILE,
      {
        types: [
          "INSURANCE",
          "EQUIPMENT",
          "WORKING-SPACE",
          "REFERENCE-CHECK",
          "OPTION"
        ],
        orgId: orgId,
        contractId
      }
    ).then(res => {
      setContractProfileData(res.data.data)
    })
  }


  const handleEditInfo = (name: string) => {
    console.log(name)
    switch (name) {
      case '电子邮箱':
        setEditDialogType('staffEmail');
        setShowEditDialog(true);
        break;
      case '归属团队':
        setEditDialogType('teamId');
        setShowEditDialog(true);
        break;
      default:
        break;
    }
  }

  const handleCloseEditDialog = () => {
    setShowEditDialog(false)
  }

  const handleSaveContract = async (key: 'teamId' | 'staffEmail') => {
    // @ts-ignore
    const valid = await trigger([key]);
    if(valid) {
      // @ts-ignore
      axios.post(EDIT_CONTRACT_IN_DETAIL, {contractId: currentContract.contractId, [key]: getValues(key)}).then(res => {
        if(res.data.code === 'SUCCESS') {
          toast.success('修改成功');
          handleCloseEditDialog()
          getContractDetail(contractId)
        }
      })
    }
  }

  const teamForm = () => {
    return (
      <Grid item xs={12} sx={{py: 4.5, px: 6, textAlign: 'center'}}>
        <FormControl fullWidth>
          <InputLabel error={Boolean(errors.teamId)} htmlFor='teamId'>
            {t('Team')}
          </InputLabel>
          <Controller
            name='teamId'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Select
                label={t('Team')}
                value={value}
                onChange={onChange}
                error={Boolean(errors.teamId)}
                aria-describedby='contractingTeam'
              >
                {teams.map((o: any) => (
                  <MenuItem value={o.teamId}>{o.teamName}</MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.teamId && (
            <FormHelperText sx={{ color: 'error.main' }}>{errors.teamId.message}</FormHelperText>
          )}
        </FormControl>
       <Grid item sx={{display: 'flex', justifyContent: 'flex-end', mt: 4}}>
         <Button variant="contained" onClick={() => {handleSaveContract('teamId')}} sx={{mr: 4}}>确定</Button>
         <Button variant="outlined" onClick={handleCloseEditDialog} sx={{ml: 4}}>取消</Button>
       </Grid>
      </Grid>
    )
  }
  const emailForm = () => {
    return (
      <Grid item xs={12} sx={{py: 4.5, px: 6, textAlign: 'center'}}>
        <FormControl fullWidth>
          <Controller
            name='staffEmail'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                type='email'
                label={t('Staff.Employee_email')}
                placeholder={t('Staff.Employee_email') || ''}
                value={value}
                onChange={onChange}
                error={Boolean(errors.staffEmail)}
                aria-describedby='staffEmail'
              />
            )}
          />
          {errors.staffEmail && (
            <FormHelperText sx={{ color: 'error.main' }}>{errors.staffEmail.message}</FormHelperText>
          )}
        </FormControl>
        <Grid item sx={{display: 'flex', justifyContent: 'flex-end', mt: 4}}>
          <Button variant="contained" onClick={() => {handleSaveContract('staffEmail')}} sx={{mr: 4}}>确定</Button>
          <Button variant="outlined" onClick={handleCloseEditDialog} sx={{ml: 4}}>取消</Button>
        </Grid>
      </Grid>
    )
  }


  // 组件
  // 额外信息卡片
  const displayAttachment = (
    {
      logoSrc,
      title,
      summary,
      learnUrl,
      showLearn = true,
      showAdd = true,
      providerUrl,
      type,
      onAdd,
      currencyKey
    }: AttachmentType) => {
    return (
      <Card
        sx={{
          p: '24px',
          borderRadius: '8px',
          mb: 5
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
            mb: 4
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              width: '80%'
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
              <TypographyStyled2 variant='body2' sx={{ textAlign: 'left' }}>
                {summary}
              </TypographyStyled2>
            </Box>
          </Box>

          {showAdd && (
            <Button
              sx={{ backgroundColor: theme.palette.customColors.background1, height: '34px', fontWeight: 400 }}
              onClick={onAdd}
            >
              <Icon icon='ic:sharp-add' width={16} />
              {t('Adding')}
            </Button>
          )}
        </Box>
        {
          contractProfileData.filter((o:any)=> type === o.type).map((v:any,index:number)=>(
            <Grid key={v.supplierId} container sx={{ mt: 4, backgroundColor: '#F9FAFC', borderRadius: '5px', padding: '16px 0' }} style={{display: 'flex', alignItems: 'center'}}>
              <Grid item style={{flex: 1, display:'flex'}}>
                {
                  v.data.productImg && <Img sx={{maxWidth: '60px', maxHeight: '60px'}} alt="" src={v.data.productImg} />
                }
                <Grid item style={{paddingLeft: '12px', fontSize: '16px', fontWeight: 600}}>
                  { v.data.productName }
                </Grid>
                {
                  v.type === 'OPTION'&&
                  <Grid item style={{paddingLeft: '12px', fontSize: '16px', fontWeight: 600}}>
                    { `股票期权-0${index+1}` }
                  </Grid>
                }
                <Grid item style={{textAlign:'right',flex:4}}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, }}>{ `${v.data[currencyKey || 'currency']} ${v.data.productNextPriceStr || v.data.value}` }</Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: 400, }}>{v.type === 'OPTION' ? '总估价' :  durationMap[v.productPriceMode]}</Typography>
                </Grid>
              </Grid>
            </Grid>))}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {showLearn && (
            <LinkStyled
              href={learnUrl || ''}
              sx={{
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
          )}
        </Box>
      </Card>)}

  if(!currentContract.contractId) {
    return null
  }

  return (
    <Grid container sx={{ my: 5 }}>
      <Grid item xs={5.7}>
        {/*薪资*/}
        <Card sx={{p: '24px', borderRadius: '8px', mb: 5}}>
          <Grid item xs={12}>
            <TypographyStyled2 sx={{textAlign: 'left', mb: 4}}>客户签署</TypographyStyled2>
            <Grid item sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, backgroundColor: '#F9FAFC', py: 3.5, px: 4, borderRadius: 1}}>
              <Icon icon="gala:file-document" style={{width: 30, height :30 ,cursor: 'pointer', marginRight: 20, color: '#3296FA'}}/>
              <Grid item sx={{flex: 1}}>
                <Typography sx={{textAlign: 'left', color: '#3A3541DE', fontWeight: 500, fontSize: 14}}>
                  {`${currentContract.jobTitle}-工作范围协议`}
                </Typography>
                <Typography sx={{textAlign: 'left', color: '#3A354199', fontWeight: 400, fontSize: 12}}>
                  这是企业客户与 TeleHire特聘 签订的员工工作范围协议
                </Typography>
              </Grid>
              <Icon icon="material-symbols:download" style={{width: 24, height: 24, cursor: 'pointer',color: '#3296FA'}} />
            </Grid>
            <>
              <Grid item sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, backgroundColor: '#F9FAFC', py: 3.5, px: 4, borderRadius: 1,mb: 4}}>
                <Grid>
                  <Typography sx={{textAlign: 'left', color: '#3A3541DE', fontWeight: 500, fontSize: 14}}>
                    客户签署
                  </Typography>
                  <Typography sx={{textAlign: 'left', color: '#3A3541DE', fontWeight: 500, fontSize: 12}}>
                    签署人：{currentContract.staffName}
                  </Typography>
                </Grid>
                <Grid sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ecf4eb', color: '#67C23A', px: 3, py: 1, fontSize: 13, fontWeight: 400,borderRadius: 2}}>
                  已完成
                </Grid>
              </Grid>
              <Grid item sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, backgroundColor: '#F9FAFC', py: 3.5, px: 4, borderRadius: 1,mb: 4}}>
                <Grid>
                  <Typography sx={{textAlign: 'left', color: '#3A3541DE', fontWeight: 500, fontSize: 14}}>
                    平台方签署
                  </Typography>
                </Grid>
                <Grid sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ecf4eb', color: '#67C23A', px: 3, py: 1, fontSize: 13, fontWeight: 400,borderRadius: 2}}>
                  已完成
                </Grid>
              </Grid>
              <Typography sx={{textAlign: 'left', color: '#3A3541DE', fontWeight: 400, fontSize: 14, display: 'flex'}}>
                {`该${currentContract.contractType}合同受已签订的《`}
                <Typography sx={{textAlign: 'left', color: '#7C4DFF', fontWeight: 400, fontSize: 14, mx: 1}}>
                  客户与平台的主服务协议
                </Typography>
                》的约束，请仔细阅读。
              </Typography>
            </>
          </Grid>
        </Card>
        <PreviewInfoCard
          title={previewInfoMap.salaryInfo.title}
          infoMap={previewInfoMap.salaryInfo.data}
          handleEdit={handleEditInfo}
        />
        {/*年度可变薪资*/}
        <PreviewInfoCard
          title={previewInfoMap.changeableSalary.title}
          infoMap={previewInfoMap.changeableSalary.data}
          isEmpty={previewInfoMap.changeableSalary.isEmpty}
          emptyDesc={previewInfoMap.changeableSalary.emptyDesc}
          handleEdit={handleEditInfo}
        />
        {/*合同详情*/}
        <PreviewInfoCard
          title={previewInfoMap.contractDetail.title}
          infoMap={previewInfoMap.contractDetail.data}
          handleEdit={handleEditInfo}
        />
        {
          contractProfileData.find((v: any) => v.type === 'OPTION') &&(
          <Grid container spacing={5}>
            <Grid item xs={12}>
              {displayAttachment({
                learnUrl: '/',
                logoSrc: stockOptionsImg,
                title: t('Stock Option Offers'),
                summary: t(
                  "Use TeleHire to offer stock options and track grants. Please note that establishing an international stock option plan and granting stock options usually requires the approval of legal counsel and the company's board of directors. A separate contract should be signed outside of the platform to grant equity."
                ),
                showAdd: false,
                showLearn: true,
                showProvider: false,
                showSurveyBox: false,
                type: 'OPTION',
                onAdd: () => {
                  setDialogType(AddDialogTypes.Stocks)
                }
              })}
            </Grid>
          </Grid>)
          }
        <PreviewInfoCard
          title={previewInfoMap.workScope.title}
          infoMap={previewInfoMap.workScope.data}
          handleEdit={handleEditInfo}
        />
        <PreviewInfoCard
          title={previewInfoMap.contractFinish.title}
          infoMap={previewInfoMap.contractFinish.data}
          handleEdit={handleEditInfo}
        />
        <PreviewInfoCard
          title={previewInfoMap.memberInfo.title}
          infoMap={previewInfoMap.memberInfo.data}
          handleEdit={handleEditInfo}
        />
      </Grid>
      <Grid item xs={0.6} />
      <Grid item xs={5.7}>
        <PreviewInfoCard
          mulData={quotationInfo}
          handleEdit={handleEditInfo}
        />
      </Grid>

      <Dialog
        open={showEditDialog}
        onClose={handleCloseEditDialog}
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md: editDialogType === 'signing' ? 1200 : (editDialogType === 'bindMobile' ? 400 : 600) },
            '&::-webkit-scrollbar': {
              width: 4,
              borderRadius: 8
            },
            minWidth: { xs: '100%', md: editDialogType === 'signing' ? '90%' :(editDialogType === 'bindMobile' ? 500: '50%') },
            '&::-webkit-scrollbar-thumb': {
              background: '#d9d9d9',
              borderRadius: 8
            }
          }
        }}
      >
        {editDialogType === 'contractDetail' && <ContractDetail handleClose={handleCloseEditDialog} defaultInfo={currentContract}/>}
        {editDialogType === 'contractFinish' && <ContractFinish handleClose={handleCloseEditDialog} defaultInfo={currentContract}/>}
        {editDialogType === 'MemberInfo' && (
          <MemberInfo
            handleClose={handleCloseEditDialog}
            defaultInfo={currentContract}
            organizations={organizations}
            teams={teams}
            countries={areaInfo.countries}
            areaList={areaInfo.areaList}
            cities={areaInfo.cityList}
          />
        )}
        {editDialogType === 'stop' && (
          <Grid item xs={12} sx={{py: 4.5, px: 6, textAlign: 'center'}}>
            <Typography sx={{mb: 6}}>确定终止合同么？</Typography>
            <Button variant="contained" onClick={stopEorContract} sx={{mr: 4}}>确定</Button>
            <Button variant="outlined" onClick={handleCloseEditDialog} sx={{ml: 4}}>取消</Button>
          </Grid>
        )}
        {
          editDialogType === 'teamId' && teamForm()
        }
        {
          editDialogType === 'staffEmail' && emailForm()
        }
      </Dialog>
    </Grid>
  )
}

export default Step5
