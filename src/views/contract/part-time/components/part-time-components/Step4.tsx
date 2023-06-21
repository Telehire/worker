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
import { Checkbox, Radio, RadioGroup, TextField } from '@mui/material'
import { listItem } from '@/types/biz/contract'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'

import { WeWork } from './components/WeWork'
import Icon from '@/@core/components/icon'
import { Stocks } from './components/Stocks'
import { Insurance } from './components/Insurance'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import FileUploader from './components/FileUploader'
import MulFileUploader from './components/MulFileUploader'
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
} from '@/apis/product'
import {
  SAVE_ADDITIONAL_INFORMATION,
  SAVE_EOR_CONTRACT,
  DELETE_ADDITIONAL_INFORMATION
} from '@/apis/contract'
import { saveEorContract } from '@/store/apps/contract'

// ** Axios Imports
import axios from 'axios'
import contract from "@/store/apps/contract";
import {fetchAllOrg} from "@/store/apps/org";
import toast from 'react-hot-toast'
import DatePicker from "react-datepicker";
import CustomInput from "@/views/forms/form-elements/pickers/PickersCustomInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import ListItem from "@mui/material/ListItem";

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

const TypographyTitleStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: 24,
  textAlign: 'left',
  fontSize: '1.1rem',
  fontWeight: '600',
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const TypographyDescStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: 24,
  textAlign: 'left',
  fontSize: '0.875rem',
  color: '#3A354199',
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
    // setStep(prev => prev + 1)
    const contract = { ...fixedCostContract }
    contract.action = 'submit'
    const {
      payload: { code }
    } = await dispatch(
      saveEorContract(contract)
    )
    if(code === 'SUCCESS'){
      setShowDialogCompete(true)
      setStep(prev => prev + 1)
    }
  }

  const saveContract = ()=>{
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
  const [equipmentCategory, setEquipmentCategory] = useState([])
  const [equipmentData, setEquipmentData] = useState([])
  const [showDialogCompete, setShowDialogCompete] = useState(false)
  const [contractModalType, setContractModalType] = useState<string>('1')
  const [chooseComplianceDocuments, setChooseComplianceDocuments] = useState<boolean>(false)
  const [buyTeleHireGold, setBuyTeleHireGold] = useState<boolean>(false)
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false)
  const [dic, setDic] = useState<{workSpaceList: listItem[], refrenceCheckList: listItem[]}>({workSpaceList: [], refrenceCheckList: []})
  useEffect(() => {
    fetchAllDic()
  }, [])
  const [equipmentDetail, setEquipmentDetail] = useState({
    descnDescn:''
  })
  const [referenceCheckList, setReferenceCheck] = useState([])
  const [addInsuranceList, setAddInsuranceList] = useState([])
  const [contractProfileData, setContractProfileData] = useState([])
  const [additionFilesList, setAdditionFilesList] = useState<any>([])
  const [specialPaper, setSpecialPaper] = useState<boolean>(false)
  const [specialPaperContent, setSpecialPaperContent] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const {
    productListSuppliers
  } = useSelector((state: RootState) => state.product)
  const {currentContract, fixedCostContract} = useSelector((state: RootState) => state.contract)
  console.log(currentContract, fixedCostContract);

  const fetchAllDic = () => {
    const defaultParams = {
      country: currentContract.staff?.staffWorkplaceCountry,
      city: currentContract.staff?.staffWorkplaceCity,
    }
    const getRefrenceCheck = axios.post(GET_PRODUCT_LIST_PRODUCTS, {...defaultParams, productType: 'REFERENCE-CHECK',})
    const getWorkSpace = axios.post(GET_PRODUCT_LIST_PRODUCTS, {...defaultParams, productType: 'WORKING-SPACE'});
    Promise.all([getRefrenceCheck, getWorkSpace]).then(res => {
      setDic({
        refrenceCheckList: res[0].data.data,
        workSpaceList: res[1].data.data,
      })
    })
  }


  const fetchProductOfCategory = (category:string)=>{
    axios.post(GET_PRODUCT_LIST_PRODUCTS,
      {
        category,
        country:'CN',
        productType:'EQUIPMENT',
        city:'CNZJHZ'
      }
    ).then(res => {
      setEquipmentData(res.data.data)
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


  const saveReferenceCheck = async (productIdList: string[])=>{
    const res = await saveAdditionalInformation('REFERENCE-CHECK', productIdList);
    console.log(res)
    if(res.data.code === 'SUCCESS') {
      setDialogContainer(false)
    }
  }


  const saveAdditionalInformation = async (type: string, productIdList: string[]) => {
    const data = {
      action:type,
      contractId: contractId,
      orgId,
      teamId: fixedCostContract.teamId,
      type: 'EOR',
      product:{
        productIds: productIdList
      }
    }
    const res = await axios.post(SAVE_ADDITIONAL_INFORMATION,data)
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
     onAdd
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

  const additionalFilesImg = '/images/contract/additional-files.png'
  const specialPaperImg= '/images/contract/special-paper.png'
  const bgSurveyImg = '/images/contract/bgSurvey.png'
  const teleHireGold= '/images/contract/teleHire-gold.png'
  const checkImg= '/images/contract/check.png'

  const finalSave = async () => {
    await saveEorContract({
      action: 'SUBMIT',
      contractId,
      orgId,
      teamId: fixedCostContract.teamId,
      type: 'EOR',
    })
    await router.push('/contract/list')
  }
  const cusRadio = (value: string | number, label: string, checked: boolean, onChange: any) => {
    return  <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>
      <Radio size="small" checked={checked} onChange={(e,val) => {onChange(e, val, value)}} value={value}/>
      <Typography sx={{fontSize: 14, color: '#303133'}}>{label}</Typography>
    </Grid>
  }

  const moreInfoItem = (title?: string, desc?: string) => {
    return  <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', borderRadius: 1, padding: 3, mb: 3}}>
      <Box component='img' src={checkImg} sx={{ width: 24, height: 24, ml: 2.5, mr: 4.5, cursor: 'pointer', }} />
      <Grid sx={{flex: 1}}>
        {title &&  <TypographyTitleStyled sx={{mb: 1,fontSize: 14, fontWeight: 400}}>{title}</TypographyTitleStyled>}
        {desc &&  <TypographyDescStyled sx={{fontSize: 12, mb: 0,color: '#909399'}}>{desc}</TypographyDescStyled>}
      </Grid>
    </Grid>
  }

  const handleRemoveFile = (index: number) => {
    const temp = [...additionFilesList];
    temp.splice(index, 1);
    setAdditionFilesList(temp)
  }

  return (
    <Box sx={{ my: 5 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ my: 5 }}>
          <CardContent>
            <Grid container spacing={5} sx={{mb: 3}}>
              <Grid item xs={12}>
                <TypographyTitleStyled sx={{mb: 1}}>合同模板</TypographyTitleStyled>
                <TypographyDescStyled sx={{mb: 6, fontSize: 12}}>您想使用 TeleHire 的本地合规合同吗？您也可以选择上传自己已经签署的合同。</TypographyDescStyled>
                <Grid container sx={{mb: 2}}>
                  {cusRadio('1', '使用 TeleHire 合同', contractModalType === '1', (e: any, val: boolean, value: string) => {setContractModalType(value)})}
                  {cusRadio('2', '使用我自己的合同', contractModalType === '2', (e: any, val: boolean, value: string) => {setContractModalType(value)})}
                </Grid>
              </Grid>
            </Grid>
            <Grid container sx={{display: contractModalType === '2' ? 'block' : 'none' }}>
              <FileUploader />
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ my: 5 }}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center'}}>
                <Checkbox sx={{mr: 4}} checked={chooseComplianceDocuments} onChange={(e, val) => {setChooseComplianceDocuments(val)}} />
                <Grid sx={{flex: 1}}>
                  <TypographyTitleStyled sx={{mb: 1}}>合规文件</TypographyTitleStyled>
                  <TypographyDescStyled sx={{fontSize: 12, mb: 0}}>要求承包商根据所在国家/地区的劳动法上传必要的合规文件</TypographyDescStyled>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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
            }
          })}
        </Grid>
        <Card sx={{ my: 5 }}>
          <CardContent>
            <Grid container spacing={5} sx={{mb: 4.5}}>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center'}}>
                <ImgStyled src={additionalFilesImg} alt='Profile Pic' />
                <Grid sx={{flex: 1}}>
                  <TypographyTitleStyled sx={{mb: 1}}>附加文件</TypographyTitleStyled>
                  <TypographyDescStyled sx={{fontSize: 12, mb: 0}}>附加文件：附上合同可能需要的任何附加文件</TypographyDescStyled>
                </Grid>
                <Grid>
                  <MulFileUploader faFiles={additionFilesList} needFileList={false} handleChangFiles={(files: any) => {console.log(files); setAdditionFilesList(files)}} />
                </Grid>
              </Grid>
            </Grid>
            {
              additionFilesList.map((v: any, index: number) => (
                <Grid item xs={12} key={index} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, backgroundColor: '#F9FAFC', px: 2}}>
                  <Typography sx={{color: '#7C4DFF', fontSize: 14}}>{v.name}</Typography>
                  <Grid onClick={() => {handleRemoveFile(index)}}>
                    <Icon icon='ph:trash' fontSize={20} />
                  </Grid>
                </Grid>
              ))
            }
          </CardContent>
        </Card>
        <Card sx={{ my: 5 }}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center'}}>
                <ImgStyled src={specialPaperImg} alt='Profile Pic' />
                <Grid sx={{flex: 1}}>
                  <TypographyTitleStyled sx={{mb: 1}}>特殊条款</TypographyTitleStyled>
                  <TypographyDescStyled sx={{fontSize: 12, mb: 0}}>您可能需要合同中的特殊条款来概述特殊情况的条款</TypographyDescStyled>
                </Grid>
                {
                  specialPaper ?  (
                    <Grid  onClick={() => {setSpecialPaper(!specialPaper)}}>
                    <Icon icon='ph:trash' fontSize={20} />
                  </Grid>
                  ) : (
                    <Button
                      sx={{ backgroundColor: theme.palette.customColors.background1, height: '34px', fontWeight: 400 }}
                      onClick={() => {setSpecialPaper(!specialPaper)}}
                    >
                      <Icon icon='ic:sharp-add' width={16} />
                      {t('Adding')}
                    </Button>
                  )
                }
              </Grid>
            </Grid>
            {
              specialPaper &&
              (<Grid container sx={{mt: 8}}>
                <TextField
                  fullWidth
                  value={specialPaperContent}
                  id="outlined-multiline-static"
                  label="请输入特殊条款"
                  multiline
                  rows={4}
                  onChange={(e) => {
                    setSpecialPaperContent(e.target.value)
                  }}
                />
              </Grid>
              )
            }
          </CardContent>
        </Card>
        <Card sx={{ my: 5 }}>
          <CardContent>
            <Grid container spacing={5} sx={{mb: 5.5}}>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center'}}>
                <Checkbox sx={{mr: 4}} checked={buyTeleHireGold} onChange={(e, val) => {setBuyTeleHireGold(val)}} />
                <Grid sx={{flex: 1}}>
                  <TypographyTitleStyled sx={{mb: 1}}>购买 TeleHire Gold</TypographyTitleStyled>
                  <TypographyDescStyled sx={{fontSize: 12, mb: 0}}>如果发生独立承包商错误分类索赔，您将承担责任，TeleHire特聘 将提供财务保护。我们将承担最高 25,000 美元的任何法律费用、税收罚款或第三方赔偿费用。</TypographyDescStyled>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', borderRadius: 1, padding: 4, mb: 3}}>
              <Box component='img' src={teleHireGold} sx={{ width: 48, height: 48, ml: 2.5, mr: 4.5, cursor: 'pointer', }} />
              <Grid item sx={{flex: 1}}>
                <Typography sx={{fontSize: 14, color: '#303133'}}>TeleHire Gold</Typography>
              </Grid>
              <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                <Grid textAlign="right" sx={{mr: 5}}>
                  <Typography sx={{fontSize: 14, color: '#303133', fontWeight: 500}}>$50.00</Typography>
                  <Typography sx={{fontSize: 12, color: '#909399', minWidth: 100}}>每月</Typography>
                </Grid>
                <Grid sx={{cursor: 'pointer'}}>
                  {
                    showMoreInfo ?  (
                      <Icon icon='material-symbols:keyboard-arrow-down'  onClick={() => {setShowMoreInfo(!showMoreInfo)}} />
                    ) : (
                      <Icon icon='material-symbols:keyboard-arrow-up' onClick={() => {setShowMoreInfo(!showMoreInfo)}} />
                    )
                  }
                </Grid>
              </Grid>
            </Grid>
            {
              showMoreInfo && (
                <Grid container>
                  {moreInfoItem('法律费用保险', '支付您的法律辩护费用')}
                  {moreInfoItem('税务机关的处罚', '获得税务机关处罚、责任和罚款的赔偿')}
                  {moreInfoItem('第三方责任保险', '根据法院的判决，获得最高 10,000 美元的第三方赔偿')}
                  <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFC', borderRadius: 1, padding: 3, mb: 3}}>
                    <TypographyDescStyled sx={{fontSize: 12, mb: 0, mr: 1.5,color: '#606266'}}>
                      依据的
                    </TypographyDescStyled>
                    <TypographyDescStyled sx={{fontSize: 12, mb: 0,color: '#206AB5',cursor: 'pointer'}}>
                      条款和条件约束
                    </TypographyDescStyled>
                  </Grid>
              </Grid>
              )
            }
          </CardContent>
        </Card>
      </form>

      {dialogType === AddDialogTypes.ReferenceCheck && showDialogContainer && <ReferenceCheck show={showDialogContainer} onClose={() => setDialogContainer(false)} list={dic.refrenceCheckList} onSure={saveReferenceCheck} ></ReferenceCheck>}
      <Grid item xs={12}>
        <Button size='large' type='button' onClick={onSubmit} variant='contained' sx={{ width: '100%' }}>
          {t('Next step')}
        </Button>
      </Grid>
    </Box>
  )
}

export default Step4
