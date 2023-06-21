// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, ReactNode, SetStateAction, useState, SyntheticEvent } from 'react'

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
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from '../../../forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import axios from 'axios'
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface IProps {
  onClose: () => void
  show: boolean
  equipmentCategory: any
  changeCategory: any
  equipmentData: any
  equipmentDetail: any
  fetchEquipmentDetail: any
  onSure: any
}

interface FormInputs {
  insurance: string,
  accident: string
}

enum Step {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4
}

export const Tools = (props: IProps) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { onClose, show, equipmentCategory, changeCategory, equipmentData, equipmentDetail, fetchEquipmentDetail,onSure } = props
  const [step, setStep] = useState<Step>(Step.One)
  const [toolsType, setToolsType] = useState('')
  const [toolsData, setToolsData] = useState(new Array(3).fill(1))
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [productId, setProductId] = useState('')

  const defaultValues = {
    insurance: '',
    accident: ''
  }

  const schema = yup.object().shape({
    insurance: yup.string().min(2).required(),
    accident: yup.string().min(2).required(),
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues, mode: 'onBlur', resolver: yupResolver(schema) })

  const handleMenuItemClick = (event: SyntheticEvent, index: number, rkey: string) => {
    setSelectedIndex(index)
    changeCategory(rkey)
  }

  const fetchProductDetail = () =>{
    if(productId){
      fetchEquipmentDetail(productId)
      setStep(Step.Three)
    }
  }

  const continueAddProduct = ()=>{
    setStep(Step.Two)
    setProductId('')
  }

  const handleAddProduct = () => {
    onSure(productId).then((res: any) => {
      console.log(res);
      if(res.data.code === 'SUCCESS') {
        setStep(Step.Four)
      }
    });
  }

  const Header = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 6,
        py: 5
      }}
    >
      <Box>
      </Box>
      <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
        {t('选择设备')}
      </Typography>
      <IconButton
        size='small' onClick={onClose}
      >
        <Icon icon='mdi:close' />
      </IconButton>
    </Box>
  )

  const Cell = ({ title, value, desc = '' }: { title: string, value: string, desc?: string }) => (
    <Box sx={{ px: 4, py: 2.25, mb: 2, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14, width: 80, mr: 6 }}>
        {title}
      </Typography>
      <Typography sx={{ color: theme.palette.text.primary, fontSize: 14, fontWeight: 500, width: 80, mr: 6 }}>
        {value}
      </Typography>
      {desc &&
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
        {value}
      </Typography>
      }
    </Box>
  )

  const ComputerInfo = (props: { selected: boolean,equipment: any }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', }}>
      <Box onClick={ ()=>{setProductId(props.equipment.productId)} } sx={{ mb: 2, borderRadius: 2, border: `1px dashed ${props.selected ? theme.palette.info.dark: '#E4E7ED'}`, width: 182, height: 182, display: 'flex', alignItems: 'center',justifyContent: 'center' }}>
        <Box component='img' src={props.equipment.productImg} width={125}></Box>
      </Box>
      <Typography sx={{ fontSize: 12, whiteSpace: 'wrap', width: 142, textAlign: 'center' }}>
        {props.equipment.productName}
      </Typography>
    </Box>
  )


  const Guide = () => (
    <Grid
      container
      xs={12}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Grid item xs={0} sm={5.28} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box component='img' src='/images/contract/office.png' sx={{ width: '100%', height: '100%' }} />
      </Grid>
      <Grid
      item
        sm={12}
        md={6.72}
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
            width: '100%',
            mb: 5
          }}
        >

          <Typography sx={{ fontWeight: 500, fontSize: 20 }}>
            {t('为您的员工租赁设备')}
          </Typography>
          <IconButton
            size='small' onClick={onClose}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>

        <Box sx={{ mb: 10, px: 4, py: 3, display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', background: theme.palette.customColors.background3 }}>
          <Box component='img' src='/images/contract/guide_4.png' sx={{ mr: 4, width: 32 }}></Box>
          <Typography sx={{ fontSize: '14px' }}>
            {t('将设备出租给您的雇员时，降低错误分类的风险')}
          </Typography>
        </Box>

        <Box sx={{ mb: 10, px: 4, py: 3, display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', background: theme.palette.customColors.background3 }}>
          <Box component='img' src='/images/contract/guide_5.png' sx={{ mr: 4, width: 32 }}></Box>
          <Typography sx={{ fontSize: '14px' }}>
            {t('非常适合 12 个月或更长时间的合同')}
          </Typography>
        </Box>

        <Box sx={{ mb: 10, px: 4, py: 3, display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', background: theme.palette.customColors.background3 }}>
          <Box component='img' src='/images/contract/guide_6.png' sx={{ mr: 4, width: 32 }}></Box>
          <Typography sx={{ fontSize: '14px' }}>
            {t('TeleHire特聘 处理采购、运输管理、交付，并将检索任何设备')}
          </Typography>
        </Box>

        <Box sx={{ borderRadius: 2, mb: 10, px: 4, py: 3, display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', background: theme.palette.customColors.background3 }}>
          <Box component='img' src='/images/contract/guide_7.png' sx={{ mr: 4, width: 32 }}></Box>
          <Typography sx={{ fontSize: '14px' }}>
            {t('通过全天候 IT 支持和按需借用设备快速解决问题')}
          </Typography>
        </Box>
        <Box sx={{ borderRadius: 2, mb: 10, px: 4, py: 3, display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', background: theme.palette.customColors.background3 }}>
          <Box component='img' src='/images/contract/guide_8.png' sx={{ mr: 4, width: 32 }}></Box>
          <Typography sx={{ fontSize: '14px' }}>
            {t('预付 6个月，之后转为按月付款')}
          </Typography>
        </Box>
        <Box sx={{ borderRadius: 2, mb: 15.5, px: 4, py: 3, display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', background: theme.palette.customColors.background3 }}>
          <Box component='img' src='/images/contract/guide_9.png' sx={{ mr: 4, width: 32 }}></Box>
          <Typography sx={{ fontSize: '14px' }}>
            {t('可以灵活取消租赁，但是需支付一定费用')}
          </Typography>
        </Box>

        <Box sx={{ position: 'absolute', bottom: 24, alignSelf: 'center' }}>
          <Button size='large' type='submit' variant='contained' onClick={() => setStep(Step.Two)}>
            {t('开始租赁')}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )

  const SecondPage = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { xs: '100%', md: 720 }
      }}
    >
      <Header />
      <Box sx={{ display: 'flex' }}>
        <MenuList sx={{ mr: 8.5 }} className="custom-menu">
          {
            equipmentCategory.map((category:any, index:number)=>(
              <MenuItem
                key={category.rkey}
                style={{height: '48px', padding: '12px 36px 12px 16px',fontWeight: 500, fontSize: '16px'}}
                selected={index === selectedIndex}
                onClick={event => handleMenuItemClick(event, index,category.rkey)}
              >{category.rvalue}</MenuItem>
            ))
          }
        </MenuList>
        <Grid
          sx={{
            mb: 9
          }}
          container
          spacing={3}
        >
          {equipmentData.map((equipment:any, index:number) => (
            <Grid key={index} item xs={6} sm={4}>
              <ComputerInfo selected={productId === equipment.productId} equipment={equipment}/>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          mr: 6,
          mb: 6
        }}
      >
        <Button variant='contained' onClick={fetchProductDetail} sx={{ ml: 3 }}>{t('Next step')}</Button>
      </Box>
    </Box>
  )

  const ThreePage = () => (
    <Box sx={{ position: 'relative' }}>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'row', px: 6, pb: 6 }}>
        <Box sx={{ mr: 6, borderRadius: 2, border: `1px solid #E4E7ED`, flexShrink: 0, width: 240, height: 240, display: 'flex', alignItems: 'center',justifyContent: 'center' }}>
          <Box component='img' src='/images/contract/computer.png' width={216}></Box>
        </Box>
        <Box>
          {/*<Typography sx={{ fontSize: 14, whiteSpace: 'wrap', fontWeight: 500, mb: 3.5 }}>*/}
          {/*  { equipmentDetail.productName }*/}
          {/*</Typography>*/}
          <Cell title={t('月租期')} value={ equipmentDetail.productTotalPeriod }/>
          <Cell title={t('合约总额')} value={ equipmentDetail.productTotalPriceStr }/>
          <Cell title={t('首付款')} value={ equipmentDetail.productUpfrontPriceStr } desc={t('前6个月租金')}/>
          <Cell title={t('每月租金')} value={ equipmentDetail.productNextPriceStr } desc={t('从第7个月开始')}/>
        </Box>
      </Box>
      <Box sx={{ px: 5, mb: 22.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 4 }}>
          {t('规格')}
        </Typography>
        <Box>
          {
            equipmentDetail.descnDescn && Object.keys(JSON.parse(equipmentDetail.descnDescn)).map((v, i) => (
              <Cell key={i} title={v} value={JSON.parse(equipmentDetail.descnDescn)[v]}/>
            ))
          }
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', width: '100%', p: 6, bottom: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox />
          <Typography sx={{ fontSize: 14 }}>
            我同意 TeleHire特聘 和 { equipmentDetail.supplierName } 的
          </Typography>
          <Typography sx={{ fontSize: 14, color: theme.palette.info.main }}>
            条款和条件
          </Typography>
        </Box>
        <Button variant='contained' disabled={productId?false:true} onClick={handleAddProduct} sx={{ ml: 3 }}>{t('Next step')}</Button>
      </Box>
    </Box>
  )

  const Success = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8.5 }}>
      <Box component='img' src='/images/contract/wework-success.png' width={96}></Box>
      <Typography sx={{ fontSize: '20px', fontWeight: 500, mb: 2, mt: 8 }}>
        {t('你已经成功的添加了一个设备')}
      </Typography>
      <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 5 }}>
        {t('是否需要添加更多设备？')}
      </Typography>
      <Box>
        <Button size='large' type='submit' variant='outlined' onClick={() => {onClose()}} sx={{ mr: 4 }}>
          {t('否，关闭')}
        </Button>
        <Button size='large' type='submit' variant='contained' onClick={continueAddProduct}>
          {t('是，继续添加')}
        </Button>
      </Box>
    </Box>
  )

  let result = <Guide />
  switch(step) {
    case (Step.One):
      result = <Guide />;
      break;
    case (Step.Two):
      result = <SecondPage />;
      break;
    case (Step.Three):
      result = <ThreePage />;
      break;
    case (Step.Four):
      result = <Success />;
  }

  return (
    <Dialog
      open={show}
      onClose={onClose}
      fullWidth
      sx={{
        '.MuiPaper-root': {
          maxWidth: 'fit-content',
          width: { xs: '100%', md: step === Step.Two || step === Step.Three ? 720 : step === Step.One ? 600 : 480 },
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
      {result}
    </Dialog>
  )

}
