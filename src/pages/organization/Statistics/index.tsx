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
import { DataGrid } from '@mui/x-data-grid'
import Stack from '@mui/material/Stack'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import FormControl from '@mui/material/FormControl'
import DatePicker, {ReactDatePickerProps} from "react-datepicker";
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { styled, useTheme } from '@mui/material/styles'
import Icon from '../../../@core/components/icon'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  GET_CONTRACT_STATUS_MAP,
  GET_CONTRACT_LIST,
  GET_COUNTRY_LIST,
  GET_CONTRACT_COUNT_BY_TYPE,
  GET_CURRENCY_LIST,
  GET_ENTITY_LIST,
  GET_TEAM_LIST
} from 'src/apis'
import axios from 'axios'
import Pagination from "@mui/material/Pagination";
import {filterCountrySupported} from "../../../@core/utils/filter-country-supported";
import CustomInput from "@/views/forms/form-elements/pickers/PickersCustomInput";
import Link from "next/link";


const tabsType: any =  {
  EOR: 'EOR',
  PEO: 'Contract'
}
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

interface DicProps{
  entityList: EntityProps[];
  currencyList: CurrencyProps[];
  teamList: TeamProps[];
}

const defaultValue: {url: string,title: string, desc: string}[] = [
  {
    url: '/images/organization/statistics/Frame.png',
    title: '合同/协议 统计报表',
    desc: '查看 TeleHire特聘 中所有的合同和承包商协议',
  },
  {
    url: '/images/organization/statistics/Frame (1).png',
    title: '员工 统计报表',
    desc: '查看 TeleHire特聘 中所有的员工/承包商的报表',
  },
  {
    url: '/images/organization/statistics/Frame (2).png',
    title: '收据/付款 统计报表',
    desc: '查看 TeleHire特聘 中所有的收据/付款的明细报表',
  },
  {
    url: '/images/organization/statistics/Frame (3).png',
    title: '账单概览 统计报表',
    desc: '查看 TeleHire特聘 中所有的账单概览',
  },
]

const VacateList = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [contractCount, setContractCount] = useState<any[]>([]);
  const [params, setParams] = useState<IParams>({ type: [], status: [], date: '' })
  const { direction } = theme

  const infoCard = ({url, title, desc}: {url: string, title: string, desc: string}) => {
    return (
      <Card sx={{mb: 5.5}}>
        <CardContent>
          <Grid container sx={{display: 'flex', alignItems: 'center'}}>
            <Grid item sx={{width: 86, height: 86, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 22, backgroundColor: '#F4F5FA', mr: 5}}>
              <Box component="img" src={url} sx={{width: 50}} />
            </Grid>
            <Grid item sx={{width: 86, height: 86, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: '#3A3541DE' }}>
                {title}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 400, color: '#3A354199' }}>
                {desc}
              </Typography>
            </Grid>
            <Button
              href='/'
              component={Link}
              variant='outlined'
              onClick={() => {}}
              endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}
              sx={{
                margin: 0,
                borderRadius: 4,
                color: '#7C4DFF',
                backgroundColor: '#F4F5FA',
                my: 6
              }}
            >
              {t('查看')}
            </Button>
          </Grid>
        </CardContent>
      </Card>
    )
  }


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
      <Grid container>
        <Grid item xs={5.8}>
          {infoCard(defaultValue[0])}
        </Grid>
        <Grid item xs={0.4} />
        <Grid item xs={5.8}>
          {infoCard(defaultValue[1])}
        </Grid>
        <Grid item xs={5.8}>
          {infoCard(defaultValue[2])}
        </Grid>
        <Grid item xs={0.4} />
        <Grid item xs={5.8}>
          {infoCard(defaultValue[3])}
        </Grid>
      </Grid>
    </Box>
  )
}

export default VacateList
