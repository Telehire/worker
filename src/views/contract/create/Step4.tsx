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
import { Checkbox, Radio, RadioGroup } from '@mui/material'
import { listItem } from 'src/types/biz/contract'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'

import { WeWork } from './components/WeWork'
import Icon from '../../../@core/components/icon'
import { Stocks } from './components/Stocks'
import { Insurance } from './components/Insurance'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { Tools } from './components/Tools'
import { ReferenceCheck } from './components/ReferenceCheck'
import { Complete } from './components/Complete'

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
  DELETE_ADDITIONAL_INFORMATION
} from 'src/apis/contract'
import {getContractDetailById, saveEorContract} from 'src/store/apps/contract'

// ** Axios Imports
import axios from 'axios'
import contract from "@/store/apps/contract";
import {fetchAllOrg} from "@/store/apps/org";
import toast from 'react-hot-toast'

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  orgId: string
  contractId: string
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
  only?: boolean
  canAdd?: boolean
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
  ReferenceCheck
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

const Step4 = ({ setStep, orgId, contractId }: Props) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const router = useRouter()

  const onSubmit = async () => {
    const contract = { ...currentContract }
    const params = {
      action: 'submit',
      contractId,
      orgId,
      teamId: contract.teamId,
      type: 'EOR',
      salary: {
        employmentType: contract.employmentType,
        salaryCurrency: contract.salaryCurrency,
        salaryAmount: String(Number(contract.salaryAmount) / 1000),
        salaryFiguredPeriod: contract.salaryFiguredPeriod,
        planEntryDate: contract.planEntryDate,
        paidVacationType: contract.paidVacationType,
        paidVacationDays: contract.paidVacationDays,
        contractTermType: contract.paidVacationDays,
        contractEndDate: contract.contractEndDate,
        needProbation: contract.needProbation === 1,
        probationEndDate: contract.probationEndDate,
        weeklyWorkHours: contract.weeklyWorkHours,
        signingBonus: contract.signingBonus,
        variablePay: {
          title: contract.variablePayInfo.title,
          startDay: contract.variablePayInfo.startDay,
          type: contract.variablePayInfo.type,
          period: contract.variablePayInfo.period,

          //TODO
          currency: contract.variablePayInfo.currency,
          fixedValue: '',
          percentageValue: '',
        },
        regularAllowance: {
          title: contract.regularAllowanceInfo.title,
          period: contract.regularAllowanceInfo.period,
          amount: contract.regularAllowanceInfo.amount,

          //TODO
          currency: contract.regularAllowanceInfo.currency
        }
      }
    }
    if(contract.variablePayInfo.fixedValueLong || Number(contract.variablePayInfo.fixedValueLong) === 0) {
      params.salary.variablePay.fixedValue = String(Number(contract.variablePayInfo.fixedValueLong || 0) / 1000)
    }

    if(contract.variablePayInfo.percentageValue || Number(contract.variablePayInfo.percentageValue) === 0) {
      params.salary.variablePay.percentageValue = String(Number(contract.variablePayInfo.percentageValueLong || 0) / 1000)
    }

    console.log(params)
    const {
      payload: { code, error }
    } = await dispatch(
      saveEorContract(params)
    )
    if(code === 'SUCCESS'){
      setShowDialogCompete(true)
    } else {
      toast.error(error, { position: 'top-right' })
    }
  }

  const saveContract = async ()=>{
    await dispatch(getContractDetailById({orgId, contractId}));
    setStep(prev => prev + 1)
    router.push('/contract/list')
  }

  const defaultValues = {}
  const [dialogType, setDialogType] = useState<AddDialogTypes>(AddDialogTypes.WeWork)
  const { organizations } = useSelector((state: RootState) => state.org)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const [showDialogContainer, setDialogContainer] = useState(false)
  const [productList, setProductList] = useState([])
  const [companyList, setCompanyList] = useState([])
  const [equipmentCategory, setEquipmentCategory] = useState([])
  const [equipmentData, setEquipmentData] = useState([])
  const [showDialogCompete, setShowDialogCompete] = useState(false)
  const [dic, setDic] = useState<{
    workSpaceList: listItem[],
    refrenceCheckList: listItem[],
    equipmentList:  any[],
    insuranceList: any[]
  }>({
    workSpaceList: [],
    refrenceCheckList: [],
    equipmentList: [],
    insuranceList: []
  })
  useEffect(() => {
    fetchAllDic()
  }, [])
  const [equipmentDetail, setEquipmentDetail] = useState({
    descnDescn:''
  })
  const [referenceCheckList, setReferenceCheck] = useState([])
  const [addInsuranceList, setAddInsuranceList] = useState([])
  const [contractProfileData, setContractProfileData] = useState([])
  const dispatch = useDispatch<AppDispatch>()
  const {
    productListSuppliers
  } = useSelector((state: RootState) => state.product)
  const {currentContract} = useSelector((state: RootState) => state.contract)
  console.log(currentContract);

  const displayAttachment = ({
    logoSrc,
    title,
    summary,
    learnUrl,
    showLearn = true,
    showAdd = true,
    showProvider = false,
    showSurveyBox = false,
    providerUrl,
    type,
    onAdd,
    only,
    canAdd
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

          {(showAdd && (!only || (only && contractProfileData.filter((o:any)=> type === o.type).length === 0))) && (
            <Button
              disabled={!canAdd}
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
                <Typography sx={{ fontSize: '14px', fontWeight: 600, }}>{ `${v.data.currency} ${v.data.productNextPriceStr || v.data.value}` }</Typography>
                <Typography sx={{ fontSize: '12px', fontWeight: 400, }}>{v.type === 'OPTION' ? '总估价' :  durationMap[v.productPriceMode]}</Typography>
              </Grid>
              {/* <Grid sx={{flex:3}}></Grid> */}
              <Grid>
                <Button
                  sx={{ height: '34px', fontWeight: 400 ,justifyContent:'flex-end'}}
                  onClick={ () => deleteProfile(v.profileId) }
                >
                  <Icon icon="material-symbols:delete-outline-rounded"  />
                </Button>

              </Grid>
            </Grid>
          </Grid>))
        }

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

          {showProvider && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <TypographyStyled2 variant='body2' sx={{ textAlign: 'left', mr: 2, mt: 1 }}>
                {t('提供方')}:
              </TypographyStyled2>
              <ImgStyled2 src={providerUrl} alt='Provider Pic' />
            </Box>
          )}
        </Box>

        {showSurveyBox && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              backgroundColor: theme.palette.customColors.background3,
              borderRadius: 1,
              p: 3
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
              <FormControl>
                <Controller
                  name={'checkSurvey'}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => <Checkbox value={value} onChange={onChange} />}
                />
              </FormControl>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  ml: 3
                }}
              >
                <TypographyStyled2 variant='body2' sx={{ textAlign: 'left', fontSize: '1rem' }}>
                  ${t('美国犯罪记录')}
                </TypographyStyled2>
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
              </Box>
            </Box>

            <TypographyStyled2 variant='body2' sx={{ textAlign: 'left', mr: 2, mt: 1 }}>
              $ 49.00
            </TypographyStyled2>
          </Box>
        )}
      </Card>
    )
  }

  const fetchAllDic = () => {
    const defaultParams = {
      country: currentContract.staff?.staffWorkplaceCountry,
      city: currentContract.staff?.staffWorkplaceCity,
    }
    const getRefrenceCheck = axios.post(GET_PRODUCT_LIST_PRODUCTS, {...defaultParams, productType: 'REFERENCE-CHECK',})
    const getWorkSpace = axios.post(GET_PRODUCT_LIST_PRODUCTS, {...defaultParams, productType: 'WORKING-SPACE'});
    const getInsureance = axios.post(GET_PRODUCT_LIST_PRODUCTS, {...defaultParams, productType: 'INSURANCE'});
    const getEquipment = axios.post(GET_PRODUCT_LIST_PRODUCTS, {...defaultParams, productType: 'EQUIPMENT'});
    Promise.all([getRefrenceCheck, getWorkSpace, getInsureance, getEquipment]).then(res => {
      setDic({
        refrenceCheckList: res[0].data.data,
        workSpaceList: res[1].data.data,
        equipmentList: res[2].data.data,
        insuranceList: res[3].data.data
      })
    })
  }

  const fetchProductOfSuppler = (supplierId:string)=>{
    axios.post(GET_PRODUCT_LIST_PRODUCTS,
      {
        supplierId,
        country: currentContract.staff?.staffWorkplaceCountry,
        city: currentContract.staff?.staffWorkplaceCity,
        productType:'INSURANCE',
      }
    ).then(res => {
      setProductList(res.data.data)
    })
  }

  const fetchProductOfCategory = (category:string)=>{
    axios.post(GET_PRODUCT_LIST_PRODUCTS,
      {
        category,
        country: currentContract.staff?.staffWorkplaceCountry,
        city: currentContract.staff?.staffWorkplaceCity,
        productType:'EQUIPMENT',
      }
    ).then(res => {
      setEquipmentData(res.data.data)
    })
  }

  const fetchSupplier = (productType:string)=>{
    axios.get(GET_PRODUCT_LIST_SUPPLIERS, {params:
      {
        orgId: orgId,
        country: currentContract.staff?.staffWorkplaceCountry,
        city: currentContract.staff?.staffWorkplaceCity,
        productType,
      }
    }).then(res => {
      setCompanyList(res.data.data)
    })
  }

  const fetchEquipmentCategory = ()=>{
    axios.get(GET_BASIC_EQUIPMENT_CATEGORY, {params:
      {
        rgroup:'equipment.category'
      }
    }).then(res => {
      setEquipmentCategory(res.data.data)
      if(res.data.data.length > 0){
        fetchProductOfCategory(res.data.data[0].rkey)
      }
    })
  }

  const fetchEquipmentDetail = (productId: string)=>{
    axios.get(GET_CONTRACT_PRODUCT_DETAIL, {params:
      {
        productId
      }
    }).then(res => {
      setEquipmentDetail(res.data.data)
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
        orgId: "1",
        contractId
    }
    ).then(res => {
      setContractProfileData(res.data.data)
    })
  }

  const addContractProfile = async (productId: string) =>{
    const res = await saveAdditionalInformation('INSURANCE', [productId])
    console.log(res.data.code)
    if(res.data.code === 'SUCCESS') {
      setDialogContainer(false)
      fetchProfile()
    }
  }

  const saveTools = async (productId: string) =>{
    const res = await saveAdditionalInformation('EQUIPMENT', [productId])
    return Promise.resolve(res)
  }

  const saveReferenceCheck = async (productIdList: string[])=>{
    const res = await saveAdditionalInformation('REFERENCE-CHECK', productIdList);
    console.log(res)
    if(res.data.code === 'SUCCESS') {
      setDialogContainer(false)
    }
  }

  const saveWeWork = async (productIdList: string[]) => {
    return saveAdditionalInformation('WORKING-SPACE', productIdList)
  }

  const saveAdditionalInformation = async (type: string, productIdList: string[]) => {
    const data = {
      action:type,
      contractId: contractId,
      orgId,
      teamId: currentContract.teamId,
      type: 'EOR',
      product:{
        productIds: productIdList
      }
    }
    const res = await axios.post(SAVE_ADDITIONAL_INFORMATION,data)
    fetchProfile()
    return res
  }

  const saveStock = async (stock :any) => {
    const tempParams = {
      action: "OPTION",
      contractId,
      option: {...stock},
      orgId,
      teamId: currentContract.teamId,
      type: "EOR"
    }
    const res = await axios.post(SAVE_ADDITIONAL_INFORMATION,tempParams)
    fetchProfile()
    return res
  }

  const deleteProfile = async (profileId:string) => {
    const tempParams = {
      orgId,
      contractId,
      profileId
    }
    const res = await axios.delete(DELETE_ADDITIONAL_INFORMATION, {params:tempParams})
    fetchProfile()
    return res
  }

  const bizInsuranceImg = '/images/contract/bizInsurance.png'
  const equipmentLeaseImg = '/images/contract/equipmentLease.png'
  const weworkImg = '/images/contract/wework.png'
  const stockOptionsImg = '/images/contract/stockOptions.png'
  const bgSurveyImg = '/images/contract/bgSurvey.png'
  const providerImg = '/images/contract/provider.png'

  return (
    <Box sx={{ my: 5 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
        <Grid item xs={12}>
            {displayAttachment({
              learnUrl: '/',
              logoSrc: bizInsuranceImg,
              title: t('Commercial insurance'),
              summary: t('Add additional commercial insurance for employees, basic social insurance, already included in the contract'),
              showLearn: true,
              showAdd: true,
              showProvider: false,
              showSurveyBox: false,
              type: 'INSURANCE',
              onAdd: () => {
                fetchSupplier('INSURANCE')
                setDialogType(AddDialogTypes.Insurance)
                setDialogContainer(true)
              },
              only: true,
              canAdd: dic.insuranceList.length > 0
            })}
          </Grid>

          <Grid item xs={12}>
            <TypographyStyled2 variant='body2' sx={{ textAlign: 'left' }}>
              {t('Other additional costs')}
            </TypographyStyled2>
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
              type: 'EQUIPMENT',
              onAdd: () => {
                fetchEquipmentCategory()
                setDialogType(AddDialogTypes.Tools)
                setDialogContainer(true)
              },
              only: false,
              canAdd: dic.equipmentList.length > 0
            })}
          </Grid>

          <Grid item xs={12}>
            {displayAttachment({
              learnUrl: '/',
              logoSrc: weworkImg,
              title: t('Monthly co-working space membership'),
              summary: t('Request access to co-working. Explore available co-working locations'),
              showAdd: true,
              showLearn: true,
              showProvider: false,
              showSurveyBox: false,
              type: 'WORKING-SPACE',
              onAdd: () => {
                setDialogType(AddDialogTypes.WeWork)
                setDialogContainer(true)
              },
              only: true,
              canAdd: dic.workSpaceList.length > 0
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
              },
              only: false,
              canAdd: true
            })}
          </Grid>

          <Grid item xs={12}>
            {displayAttachment({
              learnUrl: '/',
              logoSrc: bgSurveyImg,
              title: t('Background Check'),
              summary: t('Verify the background of new team members and get results within minutes.'),
              showAdd: true,
              showLearn: true,
              showProvider: false,
              showSurveyBox: false,
              type: 'REFERENCE-CHECK',
              onAdd: () => {
                setDialogType(AddDialogTypes.ReferenceCheck)
                setDialogContainer(true)
              },
              only: false,
              canAdd: dic.refrenceCheckList.length > 0
            })}
          </Grid>

          <Grid item xs={12}>
            <Button size='large' type='submit' variant='contained' sx={{ width: '100%' }}>
              {t('Create completion')}
            </Button>
          </Grid>
        </Grid>
      </form>

      {dialogType === AddDialogTypes.WeWork && showDialogContainer && <WeWork show={showDialogContainer} onClose={() => setDialogContainer(false)} list={dic.workSpaceList} onSure={saveWeWork} />}
      {dialogType === AddDialogTypes.Stocks && showDialogContainer && <Stocks show={showDialogContainer} onClose={() =>  setDialogContainer(false)} onSure={saveStock} organizations={organizations}></Stocks>}
      {dialogType === AddDialogTypes.Insurance && showDialogContainer && <Insurance show={showDialogContainer} onClose={() => setDialogContainer(false)} insuranceCompanies={companyList} changeSupplier={fetchProductOfSuppler} insuranceProducts={productList} onSure={addContractProfile}></Insurance>}
      {dialogType === AddDialogTypes.Tools && showDialogContainer && <Tools show={showDialogContainer} onClose={() => setDialogContainer(false)} changeCategory={fetchProductOfCategory} equipmentCategory={equipmentCategory} equipmentData={equipmentData} equipmentDetail={equipmentDetail} fetchEquipmentDetail={fetchEquipmentDetail} onSure={saveTools}></Tools>}
      {dialogType === AddDialogTypes.ReferenceCheck && showDialogContainer && <ReferenceCheck show={showDialogContainer} onClose={() => setDialogContainer(false)} list={dic.refrenceCheckList} onSure={saveReferenceCheck} ></ReferenceCheck>}
      <Complete show={showDialogCompete} onClose={() => setShowDialogCompete(false)} onSure={saveContract} ></Complete>
    </Box>
  )
}

export default Step4
