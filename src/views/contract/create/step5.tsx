// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, ReactNode, SetStateAction, useEffect, useState, useRef } from 'react'

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
import { Checkbox, Radio, RadioGroup } from '@mui/material'
import { listItem, PreviewInfoMapType } from 'src/types/biz/contract'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import { cusFormatDate } from 'src/@core/utils/format'
import { WeWork } from './components/WeWork'
import Icon from '../../../@core/components/icon'
import { Stocks } from './components/Stocks'
import { Insurance } from './components/Insurance'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { Tools } from './components/Tools'
import { ReferenceCheck } from './components/ReferenceCheck'
import { Complete } from './components/Complete'
import { PreviewInfoCard } from './components/PreviewInfoCard'

// ** Next Import
import { useRouter } from 'next/router'
import {
  GET_PRODUCT_LIST_SUPPLIERS,
  GET_PRODUCT_LIST_PRODUCTS,
  GET_BASIC_EQUIPMENT_CATEGORY,
  GET_CONTRACT_PRODUCT_DETAIL,
  GET_CONTRACT_PROFILE
} from 'src/apis/product'
import {
  SAVE_ADDITIONAL_INFORMATION,
  SAVE_EOR_CONTRACT,
  DELETE_ADDITIONAL_INFORMATION,
  GET_LOCALE_COUNTRY,
  TO_SIGNING,
  GET_CONTRACT_QUOTATION,
  REFUSE_SIGN_CONTRACT
} from 'src/apis/contract'
import { getContractDetailById, saveEorContract } from 'src/store/apps/contract'

// ** Axios Imports
import axios from 'axios'
import contract from '@/store/apps/contract'
import { fetchAllOrg } from '@/store/apps/org'
import toast from 'react-hot-toast'
import SalaryForm from '@/views/contract/create/components/SalaryForm'
import AnnualVariablePay from '@/views/contract/create/components/AnnualVariablePay'
import ContractDetail from '@/views/contract/create/components/ContractDetail'
import WorkScope from '@/views/contract/create/components/WorkScope'
import ContractFinish from '@/views/contract/create/components/ContractFinish'
import BindMobile from '@/pages/components/bind-mobile'
import MemberInfo from '@/views/contract/create/components/MemberInfo'
import { GET_BILL_LIST } from '@/apis/payment'
import { postDocusignCallback } from '../../../apis/docusign'

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  orgId: string
  contractId: string
  currentStep: string | number
}

const durationMap: any = {
  monthly: '每月支付',
  weekly: '每周支付',
  oneTime: '一次性'
}

/**
 * url上携带origin属性，签约标识回调回来
 */
enum OriginEnum {
  DOCUSIGN = 'docusign'
  // todo: E签宝
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

const ImgStyled2 = styled('img')(({ theme }) => ({
  width: 50,
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
  currencyKey?: string
}

interface FormInputs {
  checkSurvey?: boolean
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
const DialogContainer = (props: DialogProps) => {
  const { show, onClose, children } = props
  return (
    <Dialog
      open={show}
      onClose={onClose}
      fullWidth
      sx={{
        '.MuiPaper-root': {
          width: { xs: '100%', md: 'auto' },
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
      {children}
    </Dialog>
  )
}

const previewInfoMapDefaultValue: PreviewInfoMapType = {
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
    title: '报价概览'
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
      }
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
      }
    ]
  },
  {
    title: '预付押金',
    titleDesc: '这个要在签订合同后支付',
    infoMap: [
      {
        name: '押金',
        value: '$ 12,318.01',
        desc: '预付1.5个月的费用'
      }
    ]
  }
]

const currencyMap: { [key: string]: string } = {
  CNY: '人民币',
  USD: '美元'
}

const currencyIconMap: { [key: string]: string } = {
  CNY: '¥',
  USD: '$'
}

let firstTime = true

let firstTimeGetDic = true

const Step5 = ({ setStep, orgId, contractId, currentStep }: Props) => {
  // 初始化
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const defaultValues = {}
  const [dialogType, setDialogType] = useState<AddDialogTypes>(AddDialogTypes.WeWork)
  const { organizations, teams } = useSelector((state: RootState) => state.org)
  const [showDialogContainer, setDialogContainer] = useState(false)
  const [productList, setProductList] = useState([])
  const [companyList, setCompanyList] = useState([])
  const [invoiceInfo, setInvoiceInfo] = useState<any>({})
  const [equipmentCategory, setEquipmentCategory] = useState([])
  const [equipmentData, setEquipmentData] = useState([])
  const [showDialogCompete, setShowDialogCompete] = useState(false)
  const [dic, setDic] = useState<{ workSpaceList: listItem[]; refrenceCheckList: listItem[] }>({
    workSpaceList: [],
    refrenceCheckList: []
  })
  const [equipmentDetail, setEquipmentDetail] = useState({
    descnDescn: ''
  })
  const [quotationInfo, setQuotationInfo] = useState<any>([...tempQuotationInfo])
  const [contractProfileData, setContractProfileData] = useState([])
  const [previewInfoMap, setPreviewInfoMap] = useState<PreviewInfoMapType>({ ...previewInfoMapDefaultValue })
  const [areaInfo, setAreaInfo] = useState<{ countries: any[]; areaList: any[]; cityList: any[] }>({
    countries: [],
    areaList: [],
    cityList: []
  })
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [editDialogType, setEditDialogType] = useState<string>('')
  const [signUrl, setSignUrl] = useState<string>('')
  const [needCheckAuth, setNeedCheckAuth] = useState<boolean>(false)
  const [deposit, setDeposit] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const { productListSuppliers } = useSelector((state: RootState) => state.product)
  const { currentContract } = useSelector((state: RootState) => state.contract)
  const { config } = useSelector((state: RootState) => state.config)

  // todo: 处理回调回来query携带origin的逻辑
  // &origin=docusign&state=1&envelopeId=1&event=signing_complete
  const { origin, state, envelopeId, event } = router.query

  const [isCallback, setIsCallback] = useState<boolean>(origin === OriginEnum.DOCUSIGN)

  const docuCallback = async () => {
    try {
      await postDocusignCallback({
        state: String(state),
        envelopeId: String(envelopeId),
        event: String(event),
        contractId: currentContract.contractId
      })
      await dispatch(getContractDetailById({ orgId: '1', contractId: currentContract.contractId }))
    } finally {
      setIsCallback(false)
    }
  }

  useEffect(() => {
    if (currentContract.contractId && isCallback) {
      docuCallback()
    }
  }, [currentContract.contractId, isCallback])

  useEffect(() => {
    if (firstTimeGetDic && currentContract.contractId) {
      fetchAllDic()
      firstTimeGetDic = false
    }
  }, [currentContract])
  useEffect(() => {
    fetchProfile()
    initSetPreviewData()
  }, [areaInfo])

  useEffect(() => {
    initSetPreviewData()
  }, [organizations, teams, config])

  useEffect(() => {
    if (orgId) {
      if (currentContract.contractStatus === 'SIGNING' && !currentContract.eSignFlowId) {
        getSignStatusAndUrl()
      } else {
        setSignUrl(currentContract.eSignUserUrl)
      }
      if (
        currentContract.contractStatus === 'SIGNING' ||
        currentContract.contractStatus === 'UNPAID' ||
        currentContract.contractStatus === 'PENDING-ARRIVED'
      ) {
        getContractQuotationInfo()
      }
      if (
        (currentContract.contractStatus === 'UNPAID' || currentContract.contractStatus === 'PENDING-ARRIVED') &&
        currentStep !== 6
      ) {
        setStep(prev => prev + 1)
      }
      if (currentContract.contractStatus === 'UNPAID' || currentContract.contractStatus === 'SIGNED') {
        getInvoiceIdListByContractId()
      }
      if (firstTime) {
        firstTime = false
      } else {
        initSetPreviewData()
      }
      console.log('orgId', orgId)
    }
  }, [currentContract, orgId])
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  // 图片资源
  const bizInsuranceImg = '/images/contract/bizInsurance.png'
  const equipmentLeaseImg = '/images/contract/equipmentLease.png'
  const weworkImg = '/images/contract/wework.png'
  const stockOptionsImg = '/images/contract/stockOptions.png'
  const bgSurveyImg = '/images/contract/bgSurvey.png'
  const providerImg = '/images/contract/provider.png'

  // 方法
  const onSubmit = async () => {
    const contract = { ...currentContract }
    contract.action = 'submit'
    const {
      payload: { code }
    } = await dispatch(saveEorContract(contract))
    if (code === 'SUCCESS') {
      setShowDialogCompete(true)
    }
  }

  const findName = (id: any, arr: any, key?: string, label?: string) => {
    return ((arr.find((v: any) => v[key || 'areaCode'] === id) as any) || ({} as any))[label || 'name']
  }

  const initSetPreviewData = () => {
    const memberInfo: any = { title: '员工信息' }
    const contractFinish: any = { title: '合同结束' }
    const workScope: any = { title: t('Scope of Work Statement') }
    const contractDetail: any = { title: '合同详情' }
    const salaryInfo: any = { title: '薪资' }
    const changeableSalary: any = { title: '年度可变薪酬' }
    if (currentContract.staff) {
      memberInfo.data = [
        {
          name: '法定全名',
          value: currentContract.staff.staffName
        },
        {
          name: '电子邮箱',
          value: currentContract.staff.staffEmail
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
          value: `${findName(currentContract.staff.staffWorkplaceCountry, areaInfo.countries)} ${findName(
            currentContract.staff.staffWorkplaceState,
            areaInfo.areaList
          )} ${findName(currentContract.staff.staffWorkplaceCity, areaInfo.cityList)}`
        },
        {
          name: '工作签证',
          value:
            currentContract.staff.staffWorkplaceCountry === currentContract.staff.staffNationality ? '不需要' : '需要'
        }
      ]
      contractFinish.data = [
        {
          name: '结束日期',
          value: cusFormatDate(new Date(currentContract.contractEndDate))
        },
        {
          name: t('Probationary period'),
          value:
            Math.ceil(
              (Number(currentContract.probationEndDate) - Number(currentContract.planEntryDate)) / (60000 * 60 * 24)
            ) + '天'
        },
        {
          name: '试用期最后一天',
          value: cusFormatDate(new Date(currentContract.probationEndDate))
        }
      ]
      workScope.data = [{ desc: currentContract.jobDuty }]
      contractDetail.data = [
        {
          name: '期望入职时间',
          value: cusFormatDate(currentContract.planEntryDate)
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
          value:
            Math.ceil(
              (Number(currentContract.probationEndDate) - Number(currentContract.planEntryDate)) / (60000 * 60 * 24)
            ) + '天'
        },
        {
          name: '归属实体',
          value: findName(currentContract.entiryId, organizations, 'entiryId', 'entiryName')
        },
        {
          name: '归属团队',
          value: findName(currentContract.teamId, teams, 'teamId', 'teamName')
        }
      ]
      salaryInfo.data = [
        {
          name: t('Monthly Salary'),
          value:
            (currencyIconMap[currentContract.salaryCurrency] || '¥') +
            ' ' +
            Number(currentContract.salaryAmount / 1000).toFixed(2)
        },
        {
          // todo  详情接口缺乏签约奖金返回值
          name: '签约奖金',
          value:
            (currencyIconMap[currentContract.salaryCurrency] || '¥') +
            ' ' +
            Number((currentContract.signingBonus || 0) / 1000).toFixed(2)
        }
      ]
      if (currentContract.variablePayInfo && currentContract.variablePayInfo.title) {
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
            name: currentContract.variablePayInfo.type === '固定金额' ? '金额' : '百分比',
            value:
              currentContract.variablePayInfo.type === '固定金额'
                ? Number(currentContract.variablePayInfo.fixedValueLong / 1000).toFixed(2)
                : currentContract.variablePayInfo.percentageValueLong
          },
          {
            name: '支付频率',
            value: currentContract.variablePayInfo.period
          }
        ]
      } else {
        changeableSalary.isEmpty = true
        changeableSalary.emptyDesc = `暂无${changeableSalary.title}信息`
      }
    }
    setPreviewInfoMap({
      memberInfo,
      contractFinish,
      workScope,
      contractDetail,
      salaryInfo,
      changeableSalary
    })
  }

  const saveContract = () => {
    router.push('/contract/list')
  }

  const getContractQuotationInfo = () => {
    axios
      .get(GET_CONTRACT_QUOTATION, { params: { orgId: orgId, contractId: currentContract.contractId } })
      .then(res => {
        if (res.data.code === 'SUCCESS') {
          const result = res.data.data
          const middleQuotationInfo = [...tempQuotationInfo]
          const cur = currencyIconMap[currentContract.salaryCurrency]
          middleQuotationInfo[1].infoMap = [
            {
              name: '总计',
              value: cur + result.normalMouthSalary
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
            }
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
            }
          ]
          middleQuotationInfo[3].infoMap = [
            {
              name: '押金',
              value: cur + result.deposit,
              desc: '预付1.5个月的费用'
            }
          ]
          setDeposit(result.deposit)
          setQuotationInfo(middleQuotationInfo)
        }
      })
  }

  const getInvoiceIdListByContractId = () => {
    axios.post(GET_BILL_LIST, { contractId: currentContract.contractId }).then(res => {
      if (res.data.code === 'SUCCESS') {
        const invoice = res.data.data.pageList.filter((v: any) => v.invoiceType === 'GUARANTEE_DEPOSIT')[0]
        if (invoice) {
          console.log(invoice)
          setInvoiceInfo(invoice)
        }
      }
    })
  }

  const getSignStatusAndUrl = () => {
    axios
      .get(TO_SIGNING, {
        params: {
          orgId: orgId,
          contractId: currentContract.contractId,
          redirectUrl: `${location.origin}/contract/create/full-time/?contractId=${currentContract.contractId}&type=detail&redirect=true`
        }
      })
      .then(res => {
        if (res.data.code === 'SUCCESS') {
          if (res.data.data.userSignUrl) {
            if (router.query.redirect) {
              location.href = res.data.data.userSignUrl
            } else {
              setSignUrl(res.data.data.userSignUrl)
            }
          } else {
            setSignUrl(res.data.data.authUrl)
          }
          if (res.data.data.triggerESignSuccess) {
            setNeedCheckAuth(false)
          } else if (res.data.data.triggerESignSuccess) {
            setNeedCheckAuth(true)
          }
        } else if (res.data.code === 'INVALID_MOBILE') {
          setEditDialogType('bindMobile')
          setShowEditDialog(true)
        }
      })
  }

  const fetchAllDic = () => {
    const defaultParams = {
      country: currentContract.staff?.staffWorkplaceCountry,
      city: currentContract.staff?.staffWorkplaceCity
    }
    const getRefrenceCheck = axios.post(GET_PRODUCT_LIST_PRODUCTS, { ...defaultParams, productType: 'REFERENCE-CHECK' })
    const getWorkSpace = axios.post(GET_PRODUCT_LIST_PRODUCTS, { ...defaultParams, productType: 'WORKING-SPACE' })
    const getCountry = axios.get(GET_LOCALE_COUNTRY, { params: { parent: 0 } })
    const getArea = axios.get(GET_LOCALE_COUNTRY, { params: { parent: currentContract.staff.staffWorkplaceCountry } })
    const getCity = axios.get(GET_LOCALE_COUNTRY, { params: { parent: currentContract.staff.staffWorkplaceState } })
    Promise.all([getRefrenceCheck, getWorkSpace, getCountry, getArea, getCity]).then(res => {
      setDic({
        refrenceCheckList: res[0].data.data,
        workSpaceList: res[1].data.data
      })
      setAreaInfo({
        countries: res[2].data.data,
        areaList: res[3].data.data,
        cityList: res[4].data.data
      })
      console.log(res)
    })
  }

  const fetchProductOfSuppler = (supplierId: string) => {
    axios
      .post(GET_PRODUCT_LIST_PRODUCTS, {
        supplierId,
        country: 'CN',
        productType: 'INSURANCE',
        city: 'CNZJHZ'
      })
      .then(res => {
        setProductList(res.data.data)
      })
  }

  const fetchProductOfCategory = (category: string) => {
    axios
      .post(GET_PRODUCT_LIST_PRODUCTS, {
        category,
        country: 'CN',
        productType: 'EQUIPMENT',
        city: 'CNZJHZ'
      })
      .then(res => {
        setEquipmentData(res.data.data)
      })
  }

  const fetchSupplier = (productType: string) => {
    axios
      .get(GET_PRODUCT_LIST_SUPPLIERS, {
        params: {
          orgId: orgId,
          country: 'CN',
          productType,
          city: 'CNZJHZ'
        }
      })
      .then(res => {
        setCompanyList(res.data.data)
      })
  }

  const fetchEquipmentCategory = () => {
    axios
      .get(GET_BASIC_EQUIPMENT_CATEGORY, {
        params: {
          rgroup: 'equipment.category'
        }
      })
      .then(res => {
        setEquipmentCategory(res.data.data)
        if (res.data.data.length > 0) {
          fetchProductOfCategory(res.data.data[0].rkey)
        }
      })
  }

  const fetchEquipmentDetail = (productId: string) => {
    axios
      .get(GET_CONTRACT_PRODUCT_DETAIL, {
        params: {
          productId
        }
      })
      .then(res => {
        setEquipmentDetail(res.data.data)
      })
  }

  const fetchProfile = () => {
    axios
      .post(GET_CONTRACT_PROFILE, {
        types: ['INSURANCE', 'EQUIPMENT', 'WORKING-SPACE', 'REFERENCE-CHECK', 'OPTION'],
        orgId,
        contractId
      })
      .then(res => {
        setContractProfileData(res.data.data)
      })
  }

  const addContractProfile = async (productId: string) => {
    const res = await saveAdditionalInformation('INSURANCE', [productId])
    console.log(res.data.code)
    if (res.data.code === 'SUCCESS') {
      setDialogContainer(false)
      fetchProfile()
    }
  }

  const saveTools = async (productId: string) => {
    const res = await saveAdditionalInformation('EQUIPMENT', [productId])
    return Promise.resolve(res)
  }

  const saveReferenceCheck = async (productIdList: string[]) => {
    const res = await saveAdditionalInformation('REFERENCE-CHECK', productIdList)
    console.log(res)
    if (res.data.code === 'SUCCESS') {
      setDialogContainer(false)
    }
  }

  const saveWeWork = async (productIdList: string[]) => {
    return saveAdditionalInformation('WORKING-SPACE', productIdList)
  }

  const saveAdditionalInformation = async (type: string, productIdList: string[]) => {
    const data = {
      action: type,
      contractId: contractId,
      orgId,
      teamId: currentContract.teamId,
      type: 'EOR',
      product: {
        productIds: productIdList
      }
    }
    const res = await axios.post(SAVE_ADDITIONAL_INFORMATION, data)
    fetchProfile()
    return res
  }

  const saveStock = async (stock: any) => {
    const tempParams = {
      action: 'OPTION',
      contractId,
      option: { ...stock },
      orgId,
      teamId: currentContract.teamId,
      type: 'EOR'
    }
    const res = await axios.post(SAVE_ADDITIONAL_INFORMATION, tempParams)
    fetchProfile()
    return res
  }

  const deleteProfile = async (profileId: string) => {
    const tempParams = {
      orgId,
      contractId,
      profileId
    }
    const res = await axios.delete(DELETE_ADDITIONAL_INFORMATION, { params: tempParams })
    fetchProfile()
    return res
  }

  const handleEditInfo = (name: string) => {
    console.log(name)
    switch (name) {
      case '薪资':
        setEditDialogType('salary')
        setShowEditDialog(true)
        break
      case '年度可变薪酬':
        setEditDialogType('annualVariablePay')
        setShowEditDialog(true)
        break
      case '合同详情':
        setEditDialogType('contractDetail')
        setShowEditDialog(true)
        break
      case '工作范围说明':
        setEditDialogType('workScope')
        setShowEditDialog(true)
        break
      case '合同结束':
        setEditDialogType('contractFinish')
        setShowEditDialog(true)
        break
      case '员工信息':
        setEditDialogType('MemberInfo')
        setShowEditDialog(true)
        break
      default:
        break
    }
  }

  const handleCloseEditDialog = () => {
    setShowEditDialog(false)
  }

  const handleBindMobileDialog = () => {
    setShowEditDialog(false)
  }

  const handleToSign = async () => {
    await getSignStatusAndUrl()
    setEditDialogType('signing')
    setShowEditDialog(true)
  }

  const sureRefuseContract = () => {
    axios.get(REFUSE_SIGN_CONTRACT, { params: { orgId, contractId: currentContract.contractId } }).then(res => {
      if (res.data.code === 'SUCCESS') {
        toast.success('拒绝成功')
        setShowEditDialog(false)
        getContractDetailById({ contractId, orgId })
      }
    })
  }
  const refuseContract = () => {
    setEditDialogType('refuse')
    setShowEditDialog(true)
  }

  const toPay = () => {
    if (invoiceInfo.invoiceId) {
      router.push(`/payment/paying/?billId=${invoiceInfo.invoiceId}`)
    }
  }

  const handleCloseSignModal = async () => {
    setShowEditDialog(false)
    await dispatch(getContractDetailById({ orgId: orgId, contractId }))
  }

  const singDialogInside = () => {
    return (
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            mb: 6
          }}
        >
          {/*<Box component='img' src='/images/contract/wework-logo.png' sx={{ height: 24 }}></Box>*/}
          <Typography sx={{ fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
            {needCheckAuth ? '验证' : '  签署'}
          </Typography>
          <IconButton
            size='small'
            onClick={() => {
              handleCloseSignModal()
            }}
            sx={{ color: '#7C4DFF' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>
        <Box component='iframe' src={signUrl} sx={{ height: 800, width: '100%' }} />
      </Grid>
    )
  }

  // 组件
  // 额外信息卡片
  const displayAttachment = ({
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
          borderRadius: '8px'
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
        {contractProfileData
          .filter((o: any) => type === o.type)
          .map((v: any, index: number) => (
            <Grid
              key={v.supplierId}
              container
              sx={{ mt: 4, backgroundColor: '#F9FAFC', borderRadius: '5px', padding: '16px 0' }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Grid item style={{ flex: 1, display: 'flex' }}>
                {v.data.productImg && (
                  <Img sx={{ maxWidth: '60px', maxHeight: '60px' }} alt='' src={v.data.productImg} />
                )}
                <Grid item style={{ paddingLeft: '12px', fontSize: '16px', fontWeight: 600 }}>
                  {v.data.productName}
                </Grid>
                {v.type === 'OPTION' && (
                  <Grid item style={{ paddingLeft: '12px', fontSize: '16px', fontWeight: 600 }}>
                    {`股票期权-0${index + 1}`}
                  </Grid>
                )}
                <Grid item style={{ textAlign: 'right', flex: 4 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{`${v.data[currencyKey || 'currency']} ${
                    v.data.productNextPriceStr || v.data.value
                  }`}</Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: 400 }}>
                    {v.type === 'OPTION' ? '总估价' : durationMap[v.productPriceMode]}
                  </Typography>
                </Grid>
                {/* <Grid sx={{flex:3}}></Grid> */}
                <Grid>
                  <Button
                    sx={{ height: '34px', fontWeight: 400, justifyContent: 'flex-end' }}
                    onClick={() => deleteProfile(v.profileId)}
                  >
                    <Icon icon='material-symbols:delete-outline-rounded' />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ))}

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
      </Card>
    )
  }

  if (!currentContract.contractId) {
    return null
  }

  if (isCallback) {
    return null
  }

  return (
    <Box sx={{ my: 5 }}>
      {/*等待报价*/}
      {currentContract.contractStatus === 'QUOTATION' && (
        <Card sx={{ p: '24px', borderRadius: '8px', mb: 5 }}>
          <Grid item xs={12}>
            <TypographyStyled sx={{ textAlign: 'left', mb: 4 }}>目前进程</TypographyStyled>
            <Box component='img' src='/images/contract/logo.png' height={15} />
            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
              <TypographyStyled sx={{ textAlign: 'left', color: '#3A3541DE', fontWeight: 400, fontSize: 14 }}>
                我们将在 2 小时内通过电子邮件回复您，并提供完整的报价以供审核，您审核通过后，就可以签署合同。
              </TypographyStyled>
              <Button
                sx={{
                  backgroundColor: theme.palette.customColors.background1,
                  height: 45,
                  fontWeight: 400,
                  width: 140,
                  fontSize: 14,
                  py: 1.5,
                  px: 2.5,
                  ml: 10
                }}
                disabled
              >
                等待报价
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}
      {/*等待付款*/}
      {(currentContract.contractStatus === 'UNPAID' || currentContract.contractStatus === 'SIGNED') &&
        invoiceInfo.invoiceId && (
          <Card sx={{ p: '24px', borderRadius: '8px', mb: 5 }}>
            <Grid item xs={12}>
              <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TypographyStyled sx={{ textAlign: 'left', mb: 0 }}>待支付押金</TypographyStyled>
                <Typography
                  sx={{ fontSize: 12, fontWeight: 400, color: '#FF943E', px: 1, py: 0.5, backgroundColor: '#FFF6F0' }}
                >{`请在${cusFormatDate(
                  new Date(invoiceInfo.gmtCreate + 5 * 24 * 60 * 60 * 1000),
                  'yyyy-mm-dd'
                )}日之前支付`}</Typography>
              </Grid>
              <Grid
                item
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 4,
                  mb: 3,
                  backgroundColor: '#9155FD14',
                  px: 4.5,
                  py: 4.5,
                  borderRadius: 1
                }}
              >
                <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#3A3541DE', mr: 3 }}>押金</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#303133' }}>{`${
                    invoiceInfo.invoiceTotalValue / 1000
                  } ${currencyMap[currentContract.salaryCurrency]}`}</Typography>
                </Grid>
                <Button
                  variant='contained'
                  sx={{ fontWeight: 400, fontSize: 14, py: 1, px: 3.5, ml: 10 }}
                  onClick={() => {
                    toPay()
                  }}
                  disabled={!invoiceInfo.invoiceId}
                >
                  去支付
                </Button>
              </Grid>
              <Typography
                sx={{ fontSize: 14, fontWeight: 400, color: '#3A3541DE', mr: 3, display: 'flex', alignItems: 'center' }}
              >
                <Icon
                  icon='material-symbols:info-outline'
                  style={{ color: '#8A8D93', width: 18, height: 18, marginRight: 4 }}
                />
                若取消合同，押金将退还到你设置的退款账号
              </Typography>
            </Grid>
          </Card>
        )}
      {(currentContract.contractStatus === 'SIGNING' ||
        currentContract.contractStatus === 'UNPAID' ||
        currentContract.contractStatus === 'PENDING-ARRIVED') && (
        <Card sx={{ p: '24px', borderRadius: '8px', mb: 5 }}>
          <Grid item xs={12}>
            <TypographyStyled2 sx={{ textAlign: 'left', mb: 4 }}>签署合同</TypographyStyled2>
            <Grid
              item
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
                backgroundColor: '#F9FAFC',
                py: 3.5,
                px: 4,
                borderRadius: 1
              }}
            >
              <Icon
                icon='gala:file-document'
                style={{ width: 30, height: 30, cursor: 'pointer', marginRight: 20, color: '#3296FA' }}
              />
              <Grid item sx={{ flex: 1 }}>
                <Typography sx={{ textAlign: 'left', color: '#3A3541DE', fontWeight: 500, fontSize: 14 }}>
                  {`${currentContract.jobTitle}-工作范围协议`}
                </Typography>
                <Typography sx={{ textAlign: 'left', color: '#3A354199', fontWeight: 400, fontSize: 12 }}>
                  这是企业客户与 TeleHire特聘 签订的员工工作范围协议
                </Typography>
              </Grid>
              <Icon
                icon='material-symbols:download'
                style={{ width: 24, height: 24, cursor: 'pointer', color: '#3296FA' }}
              />
            </Grid>
            {(currentContract.contractStatus === 'SIGNING' || currentContract.contractStatus === 'ARCHIVED') && (
              <Grid
                item
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 4,
                  backgroundColor: '#9155FD14',
                  py: 3.5,
                  px: 4,
                  borderRadius: 1,
                  mb: 4
                }}
              >
                <Typography sx={{ textAlign: 'left', color: '#3A3541DE', fontWeight: 500, fontSize: 14 }}>
                  企业签署
                </Typography>
                {currentContract.contractStatus === 'SIGNING' && (
                  <Grid>
                    <Button
                      sx={{
                        backgroundColor: 'transparent',
                        height: 45,
                        fontWeight: 400,
                        fontSize: 14,
                        py: 1,
                        px: 4.5,
                        border: '1px solid #8A8D93',
                        color: '#8A8D93',
                        mr: 3
                      }}
                      onClick={() => {
                        refuseContract()
                      }}
                    >
                      拒绝
                    </Button>
                    <Button
                      onClick={() => {
                        handleToSign()
                      }}
                      sx={{
                        backgroundColor: '#7C4DFF',
                        height: 45,
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: 14,
                        py: 1,
                        px: 4.5
                      }}
                    >
                      {needCheckAuth ? '验证' : ' 审查并签署'}
                    </Button>
                  </Grid>
                )}
                {currentContract.contractStatus === 'ARCHIVED' && (
                  <Grid>
                    <Button
                      disabled
                      sx={{
                        backgroundColor: 'transparent',
                        height: 45,
                        fontWeight: 400,
                        fontSize: 14,
                        py: 1,
                        px: 4.5,
                        border: '1px solid #8A8D93',
                        color: '#8A8D93',
                        mr: 3
                      }}
                      onClick={() => {
                        refuseContract()
                      }}
                    >
                      已拒绝
                    </Button>
                    <Button
                      onClick={() => {
                        handleToSign()
                      }}
                      sx={{
                        backgroundColor: '#7C4DFF',
                        height: 45,
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: 14,
                        py: 1,
                        px: 4.5
                      }}
                    >
                      {needCheckAuth ? '验证' : ' 审查并签署'}
                    </Button>
                  </Grid>
                )}
              </Grid>
            )}
            {(currentContract.contractStatus === 'UNPAID' || currentContract.contractStatus === 'PENDING-ARRIVED') && (
              <>
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 4,
                    backgroundColor: '#F9FAFC',
                    py: 3.5,
                    px: 4,
                    borderRadius: 1,
                    mb: 4
                  }}
                >
                  <Grid>
                    <Typography sx={{ textAlign: 'left', color: '#3A3541DE', fontWeight: 500, fontSize: 14 }}>
                      企业签署
                    </Typography>
                    <Typography sx={{ textAlign: 'left', color: '#3A3541DE', fontWeight: 500, fontSize: 12 }}>
                      签署人：TeleHire平台
                    </Typography>
                  </Grid>
                  <Grid
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#ecf4eb',
                      color: '#67C23A',
                      px: 3,
                      py: 1,
                      fontSize: 13,
                      fontWeight: 400,
                      borderRadius: 2
                    }}
                  >
                    已完成
                  </Grid>
                </Grid>
                <Typography
                  sx={{ textAlign: 'left', color: '#3A3541DE', fontWeight: 400, fontSize: 14, display: 'flex' }}
                >
                  {`该${currentContract.contractType}合同受已签订的《`}
                  <Typography sx={{ textAlign: 'left', color: '#7C4DFF', fontWeight: 400, fontSize: 14, mx: 1 }}>
                    客户与平台的主服务协议
                  </Typography>
                  》的约束，请仔细阅读。
                </Typography>
              </>
            )}
          </Grid>
        </Card>
      )}
      {(currentContract.contractStatus === 'SIGNING' ||
        currentContract.contractStatus === 'UNPAID' ||
        currentContract.contractStatus === 'PENDING-ARRIVED') && (
        <PreviewInfoCard
          mulData={quotationInfo}
          handleEdit={handleEditInfo}
          canEdit={currentContract.contractStatus !== 'UNPAID' && currentContract.contractStatus !== 'PENDING-ARRIVED'}
        />
      )}
      {/*薪资*/}
      <PreviewInfoCard
        title={previewInfoMap.salaryInfo.title}
        infoMap={previewInfoMap.salaryInfo.data}
        handleEdit={handleEditInfo}
        canEdit={currentContract.contractStatus !== 'UNPAID' && currentContract.contractStatus !== 'PENDING-ARRIVED'}
      />
      {/*年度可变薪资*/}
      <PreviewInfoCard
        title={previewInfoMap.changeableSalary.title}
        infoMap={previewInfoMap.changeableSalary.data}
        isEmpty={previewInfoMap.changeableSalary.isEmpty}
        emptyDesc={previewInfoMap.changeableSalary.emptyDesc}
        handleEdit={handleEditInfo}
        canEdit={currentContract.contractStatus !== 'UNPAID' && currentContract.contractStatus !== 'PENDING-ARRIVED'}
      />
      {/*合同详情*/}
      <PreviewInfoCard
        title={previewInfoMap.contractDetail.title}
        infoMap={previewInfoMap.contractDetail.data}
        handleEdit={handleEditInfo}
        canEdit={currentContract.contractStatus !== 'UNPAID' && currentContract.contractStatus !== 'PENDING-ARRIVED'}
      />
      <Grid container spacing={5}>
        <Grid item xs={12}>
          {displayAttachment({
            learnUrl: '/',
            logoSrc: bizInsuranceImg,
            title: t('Commercial insurance'),
            summary: t(
              'Add additional commercial insurance for employees, basic social insurance, already included in the contract'
            ),
            showLearn: true,
            showAdd: true,
            showProvider: false,
            showSurveyBox: false,
            type: 'INSURANCE',
            currencyKey: 'productNextCurrency',
            onAdd: () => {
              fetchSupplier('INSURANCE')
              setDialogType(AddDialogTypes.Insurance)
              setDialogContainer(true)
            }
          })}
        </Grid>

        <Grid item xs={12}>
          {displayAttachment({
            learnUrl: '/',
            logoSrc: equipmentLeaseImg,
            title: t('Equipment Rental'),
            summary: t('Equip your leased staff with compliance equipment in just a few clicks.'),
            showAdd: true,
            showLearn: true,
            showProvider: false,
            showSurveyBox: false,
            providerUrl: providerImg,
            currencyKey: 'productNextCurrency',
            type: 'EQUIPMENT',
            onAdd: () => {
              fetchEquipmentCategory()
              setDialogType(AddDialogTypes.Tools)
              setDialogContainer(true)
            }
          })}
        </Grid>

        <Grid item xs={12}>
          {displayAttachment({
            learnUrl: '/',
            logoSrc: weworkImg,
            title: t('Monthly co-working space membership'),
            summary: t('请求访问 WeWork。探索可用的 WeWork 地点'),
            showAdd: true,
            showLearn: true,
            showProvider: false,
            showSurveyBox: false,
            currencyKey: 'productNextCurrency',
            type: 'WORKING-SPACE',
            onAdd: () => {
              setDialogType(AddDialogTypes.WeWork)
              setDialogContainer(true)
            }
          })}
        </Grid>

        <Grid item xs={12}>
          {displayAttachment({
            learnUrl: '/',
            logoSrc: stockOptionsImg,
            title: t('Stock Option Offers'),
            summary: t(
              "Use TeleHire to offer stock options and track grants. Please note that establishing an international stock option plan and granting stock options usually requires the approval of legal counsel and the company's board of directors. A separate contract should be signed outside of the platform to grant equity."
            ),
            showAdd: true,
            showLearn: true,
            showProvider: false,
            showSurveyBox: false,
            type: 'OPTION',
            onAdd: () => {
              setDialogType(AddDialogTypes.Stocks)
              setDialogContainer(true)
            }
          })}
        </Grid>

        <Grid item xs={12} mb={5}>
          {displayAttachment({
            learnUrl: '/',
            logoSrc: bgSurveyImg,
            title: t('Background Check'),
            summary: t('Verify the background of new team members and get results within minutes.'),
            showAdd: true,
            showLearn: true,
            showProvider: false,
            showSurveyBox: false,
            currencyKey: 'productNextCurrency',
            type: 'REFERENCE-CHECK',
            onAdd: () => {
              setDialogType(AddDialogTypes.ReferenceCheck)
              setDialogContainer(true)
            }
          })}
        </Grid>
      </Grid>
      <PreviewInfoCard
        title={previewInfoMap.workScope.title}
        infoMap={previewInfoMap.workScope.data}
        handleEdit={handleEditInfo}
        canEdit={currentContract.contractStatus !== 'UNPAID' && currentContract.contractStatus !== 'PENDING-ARRIVED'}
      />
      <PreviewInfoCard
        title={previewInfoMap.contractFinish.title}
        infoMap={previewInfoMap.contractFinish.data}
        handleEdit={handleEditInfo}
        canEdit={currentContract.contractStatus !== 'UNPAID' && currentContract.contractStatus !== 'PENDING-ARRIVED'}
      />
      <PreviewInfoCard
        title={previewInfoMap.memberInfo.title}
        infoMap={previewInfoMap.memberInfo.data}
        handleEdit={handleEditInfo}
        canEdit={currentContract.contractStatus !== 'UNPAID' && currentContract.contractStatus !== 'PENDING-ARRIVED'}
      />
      {dialogType === AddDialogTypes.WeWork && showDialogContainer && (
        <WeWork
          show={showDialogContainer}
          onClose={() => setDialogContainer(false)}
          list={dic.workSpaceList}
          onSure={saveWeWork}
        />
      )}
      {dialogType === AddDialogTypes.Stocks && showDialogContainer && (
        <Stocks
          show={showDialogContainer}
          onClose={() => setDialogContainer(false)}
          onSure={saveStock}
          organizations={organizations}
        ></Stocks>
      )}
      {dialogType === AddDialogTypes.Insurance && showDialogContainer && (
        <Insurance
          show={showDialogContainer}
          onClose={() => setDialogContainer(false)}
          insuranceCompanies={companyList}
          changeSupplier={fetchProductOfSuppler}
          insuranceProducts={productList}
          onSure={addContractProfile}
        ></Insurance>
      )}
      {dialogType === AddDialogTypes.Tools && showDialogContainer && (
        <Tools
          show={showDialogContainer}
          onClose={() => setDialogContainer(false)}
          changeCategory={fetchProductOfCategory}
          equipmentCategory={equipmentCategory}
          equipmentData={equipmentData}
          equipmentDetail={equipmentDetail}
          fetchEquipmentDetail={fetchEquipmentDetail}
          onSure={saveTools}
        ></Tools>
      )}
      {dialogType === AddDialogTypes.ReferenceCheck && showDialogContainer && (
        <ReferenceCheck
          show={showDialogContainer}
          onClose={() => setDialogContainer(false)}
          list={dic.refrenceCheckList}
          onSure={saveReferenceCheck}
        ></ReferenceCheck>
      )}
      <Dialog
        open={showEditDialog}
        onClose={handleCloseEditDialog}
        sx={{
          '.MuiPaper-root': {
            width: {
              xs: '100%',
              md:
                editDialogType === 'signing'
                  ? 1200
                  : editDialogType === 'bindMobile' || editDialogType === 'refuse'
                  ? 400
                  : 600
            },
            '&::-webkit-scrollbar': {
              width: 4,
              borderRadius: 8
            },
            minWidth: {
              xs: '100%',
              md:
                editDialogType === 'signing'
                  ? '90%'
                  : editDialogType === 'bindMobile' || editDialogType === 'refuse'
                  ? 500
                  : '50%'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#d9d9d9',
              borderRadius: 8
            }
          }
        }}
      >
        {editDialogType === 'salary' && (
          <SalaryForm handleClose={handleCloseEditDialog} defaultInfo={currentContract} />
        )}
        {editDialogType === 'annualVariablePay' && (
          <AnnualVariablePay handleClose={handleCloseEditDialog} defaultInfo={currentContract} />
        )}
        {editDialogType === 'contractDetail' && (
          <ContractDetail handleClose={handleCloseEditDialog} defaultInfo={currentContract} />
        )}
        {editDialogType === 'workScope' && (
          <WorkScope handleClose={handleCloseEditDialog} defaultInfo={currentContract} />
        )}
        {editDialogType === 'contractFinish' && (
          <ContractFinish handleClose={handleCloseEditDialog} defaultInfo={currentContract} />
        )}
        {editDialogType === 'bindMobile' && (
          <BindMobile handleClose={handleBindMobileDialog} defaultInfo={currentContract} />
        )}
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
        {editDialogType === 'signing' && singDialogInside()}
        {editDialogType === 'refuse' && (
          <Grid item xs={12} sx={{ py: 4.5, px: 6, textAlign: 'center' }}>
            <Typography sx={{ mb: 6 }}>确定拒绝么？</Typography>
            <Button variant='contained' onClick={sureRefuseContract} sx={{ mr: 4 }}>
              确定
            </Button>
            <Button variant='outlined' onClick={handleCloseEditDialog} sx={{ ml: 4 }}>
              取消
            </Button>
          </Grid>
        )}
      </Dialog>
    </Box>
  )
}

export default Step5
