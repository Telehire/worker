// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { ChangeEvent, forwardRef, Dispatch, SetStateAction, useState, useEffect } from 'react'

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
import Pagination from '@mui/material/Pagination'
import { filterCountrySupported } from '../../../@core/utils/filter-country-supported'

const tabsType: any = {
  EOR: 'EOR',
  PEO: 'Contract'
}
interface Contract {
  contractId: string
  contractStatus: string
  orgId: string
  staffName: string
  staffWorkplaceCountry: string
  jobTitle: string
  salaryAmount: string
  salaryCurrency: string
  salaryFiguredPeriod: 'weekly' | 'monthly' | 'yearly'
  FiguredPeriod: string
  staffWorkplaceCountryInfo: {
    areaCode: string
    hasNext: string
    lng: string
    name: string
    parentCode: string
  }
  teamId: string
  teamName: string
}

const statusMap = {
  DRAFT: '草稿'
}

const durationMap: any = {
  weekly: '每周',
  monthly: '每月',
  yearly: '每年'
}
const pageSizeList = [10, 20, 50, 100]

const columns = [
  {
    field: 'id',
    headerName: '名称',
    minWidth: 314,
    flex: 1,
    renderCell: ({ row }: { row: Contract }) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar src={`/images/avatars/${row.contractId}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
            {row.staffName}-{row.jobTitle}
          </Typography>
          <Typography noWrap variant='caption' sx={{ color: 'text.light' }}>
            {row.teamName}
          </Typography>
        </Box>
      </Box>
    )
  },
  {
    field: 'location',
    headerName: '工作地',
    minWidth: 180,
    columnType: tabsType.EOR,
    renderCell: ({ row }: { row: Contract }) => (
      <Typography sx={{ fontSize: 14, color: '#606266' }}>{(row.staffWorkplaceCountryInfo || {})['name']}</Typography>
    )
  },
  {
    align: 'right',
    field: 'salary',
    headerName: '薪资',
    minWidth: 180,
    type: 'number',
    renderCell: ({ row }: { row: Contract }) => (
      <Stack alignItems='flex-end'>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}>${row.salaryAmount}</Typography>
        <Typography sx={{ fontSize: 12, color: '#909399' }}>{durationMap[row.salaryFiguredPeriod]}</Typography>
      </Stack>
    )
  },
  {
    align: 'right',
    field: 'contractStatus',
    headerName: '合同状态',
    minWidth: 180,
    type: 'number',
    renderCell: ({ row }: { row: Contract }) => (
      <CustomChip rounded label={row.contractStatus} skin='light' color='info' />
    )
  },
  {
    field: 'opration',
    headerName: '操作',
    renderCell: ({ row }: { row: Contract }) => (
      <OptionsMenu options={['Edit', 'Delete']} iconButtonProps={{ size: 'small', sx: { color: 'primary.main' } }} />
    )
  }
]

interface IParams {
  costType?: string[]
  costStatus?: string[]
  time: any
}

interface costTypeItem {
  id: string
  value: string
  count: number
}
interface costStatusItem {
  id: string
  value: string
  count: number
}

interface DicProps {
  costTypeList: costTypeItem[]
  costStatusList: costStatusItem[]
}

const timer: any = null

const ContractList = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [params, setParams] = useState<IParams>({ costType: [], costStatus: [], time: [] })
  const [dic, setDic] = useState<DicProps>({ costTypeList: [], costStatusList: [] })
  const [contractList, setContractList] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentLocale, setCurrentLocale] = useState(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { orgId } = useSelector((state: RootState) => state.org)

  useEffect(() => {
    testGetDic()
  }, [])

  useEffect(() => {
    setCurrentLocale(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  }, [i18n.language])

  // 查询合同列表
  useEffect(() => {
    console.log(params)
    const scopeParams = {
      start: (page - 1) * pageSize,
      rows: pageSize,
      orgId,
      ...deleteEmpty(params)
    }
    axios.post(GET_CONTRACT_LIST, scopeParams).then(res => {
      setContractList(res.data.data.pageList)
      setTotalCount(res.data.data.totalCount)
    })
  }, [page, pageSize, params.costStatus, params.costType])

  // 获取更多查询字典
  const getDic = () => {
    const getCostTypeList = axios.get(GET_TEAM_LIST, { params: { orgId } })
    const getCostStatusList = axios.get(GET_CURRENCY_LIST, {})
    Promise.all([getCostTypeList, getCostStatusList]).then(res => {
      console.log(res[0].data.data)
      console.log(res[1].data.data)
      setDic({
        costTypeList: res[0].data.data,
        costStatusList: res[1].data.data
      })
    })
  }

  const testGetDic = async () => {
    const defaultCostTye = await axios.get('../mock/costMock.json')
    setDic({
      ...defaultCostTye.data
    })
  }

  const handleSearch = async (key: string, val: any) => {
    switch (key) {
      case 'page':
        setPage(val)
        break
      case 'pageSize':
        setPageSize(val)
        setPage(1)
        break
      default:
        setParams({
          ...params,
          [key]: val
        })
        break
    }
  }

  const deleteEmpty = (obj: any) => {
    const a: any = {}
    Object.keys(obj).forEach(v => {
      if (Array.isArray(obj[v])) {
        if (obj[v].length && obj[v].indexOf('All') === -1) {
          a[v] = obj[v]
        }
      } else {
        if (obj[v]) {
          a[v] = obj[v]
        }
      }
    })
    return a
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column'
      }}
    >
      <Grid container sx={{ background: theme.palette.background.paper }}>
        <Grid item xs={12} sx={{ py: 3.5, px: 6 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('费用类型')}</InputLabel>
                <Select
                  size='small'
                  label={t('费用类型')}
                  value={params.costType}
                  className='contract_list_select'
                  multiple
                  renderValue={selected =>
                    selected
                      .map(item => (dic.costTypeList.find(v => Number(v.id) === Number(item)) || {}).value)
                      .join(',')
                  }
                  onChange={e => handleSearch('costType', e.target.value)}
                >
                  {dic.costTypeList.map(v => (
                    <MenuItem style={{ width: '240px', height: '46px' }} disabled={!v.count} key={v.id} value={v.id}>
                      <Checkbox checked={(params.costType || []).indexOf(v.id) > -1} />
                      {t(v.value)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('费用状态')}</InputLabel>
                <Select
                  className='contract_list_select'
                  size='small'
                  autoWidth
                  multiple
                  label={t('费用状态')}
                  value={params.costStatus}
                  renderValue={selected =>
                    selected
                      .map(item => (dic.costStatusList.find(v => Number(v.id) === Number(item)) || {}).value)
                      .join(',')
                  }
                  onChange={e => handleSearch('costStatus', e.target.value)}
                  sx={{ textAlign: 'start', width: '100%' }}
                >
                  {dic.costStatusList.map(v => (
                    <MenuItem style={{ width: '240px', height: '46px' }} key={v.id} value={v.id}>
                      <Checkbox checked={(params.costStatus || []).indexOf(v.id) > -1} />
                      {t(v.value)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            autoHeight
            getRowId={row => row.contractId}
            rowsPerPageOptions={[10, 20, 50, 100]}
            // @ts-ignore
            columns={columns.filter(val => val)}
            rows={contractList}
            hideFooter
          />
        </Grid>
        <Grid container spacing={2} style={{ alignItems: 'center', padding: '20px 0', display: 'flex' }}>
          <Pagination
            defaultPage={1}
            count={Math.ceil(totalCount / pageSize)}
            page={page}
            onChange={(e, val) => {
              handleSearch('page', val)
            }}
          />
          <Select
            value={pageSize}
            size='small'
            onChange={e => handleSearch('pageSize', e.target.value)}
            sx={{ textAlign: 'start' }}
            style={{ width: '100px', marginRight: '10px' }}
          >
            {pageSizeList.map(v => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
          <span>共{totalCount}条</span>
          {/*<Grid item xs={12} sm={3}>*/}
          {/*  */}
          {/*</Grid>*/}
          {/*<Grid item xs={12} sm={3}>*/}
          {/*  */}
          {/*</Grid>*/}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ContractList
