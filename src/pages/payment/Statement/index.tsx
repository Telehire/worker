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

const rows = [
  {
    id: '1',
    name: '王丽娜',
    teamName: '所属团队名称',
    startTime: '开始：2023/03/01 09:00（GMT+08:00）',
    endTime: '结束：2023/03/01 18:00（GMT+08:00）',
    type: '年假',
    createTime: '2023/03/02 12:00:00',
    status: '待审批'
  },
  {
    id: '2',
    name: '王丽娜',
    teamName: '所属团队名称',
    startTime: '开始：2023/03/01 09:00（GMT+08:00）',
    endTime: '结束：2023/03/01 18:00（GMT+08:00）',
    type: '年假',
    createTime: '2023/03/02 12:00:00',
    status: '待审批'
  },
  {
    id: '3',
    name: '王丽娜',
    teamName: '所属团队名称',
    startTime: '开始：2023/03/01 09:00（GMT+08:00）',
    endTime: '结束：2023/03/01 18:00（GMT+08:00）',
    type: '年假',
    createTime: '2023/03/02 12:00:00',
    status: '待审批'
  },
  {
    id: '4',
    name: '王丽娜',
    teamName: '所属团队名称',
    startTime: '开始：2023/03/01 09:00（GMT+08:00）',
    endTime: '结束：2023/03/01 18:00（GMT+08:00）',
    type: '年假',
    createTime: '2023/03/02 12:00:00',
    status: '待审批'
  },

]

const VacateList = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [contractCount, setContractCount] = useState<any[]>([]);
  const [params, setParams] = useState<IParams>({ type: [], status: [], date: '' })
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [contractStatusList, setContractStatusList] = useState<any[]>([])
  const [contractList, setContractList] = useState<any[]>([])
  const [totalCount,setTotalCount] = useState<number>(0);
  const [countryList, setCountryList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentLocale, setCurrentLocale] = useState(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  const [dic, setDic] = useState<DicProps>({entityList: [], currencyList: [], teamList: []})
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  //TODO
  const columns = [
    {
      field: 'id',
      headerName: '名称',
      minWidth: 314,
      flex: 1,
      renderCell: ({ row }: { row: Contract }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar src={`/images/avatars/${row.id}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
              {row.name}
            </Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.light' }}>
              {row.teamName}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'duration',
      headerName: '请假起止时间',
      minWidth: 380,
      flex: 1,
      columnType: tabsType.EOR,
      renderCell: ({ row }: { row: Contract }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontSize: 14, color: '#606266' }}>{`开始: ${row.startTime}`}</Typography>
          <Typography sx={{ fontSize: 14, color: '#606266' }}>{`结束: ${row.endTime}`}</Typography>
        </Box>
      )
    },
    {
      field: 'type',
      headerName: '请假类型',
      minWidth: 180,
      type: 'number',
      renderCell: ({ row }: { row: Contract }) => (
        <Stack alignItems='flex-end'>
          <Typography sx={{ fontSize: 12, color: '#909399' }}>{row.type}</Typography>
        </Stack>
      )
    },
    {
      field: 'createTime',
      headerName: '提交时间',
      minWidth: 180,
      type: 'number',
      renderCell: ({ row }: { row: Contract }) => (
        <Stack alignItems='flex-end'>
          <Typography sx={{ fontSize: 12, color: '#909399' }}>{row.createTime}</Typography>
        </Stack>
      )
    },
    {
      align: 'right',
      field: 'status',
      headerName: '状态',
      minWidth: 180,
      type: 'number',
      renderCell: ({ row }: { row: Contract }) => (
        <CustomChip rounded label={row.status} skin='light' color='info' />
      )
    },
    {
      field: 'opration',
      headerName: '操作',
      renderCell: ({ row }: { row: Contract }) => (
        <OptionsMenu options={[
          {
            text: 'Edit',
            menuItemProps: {
              onClick: () => {handleOperation( 'Edit', row)}
            }
          },
          {
            text: 'Delete',
            menuItemProps: {
              onClick: () => {handleOperation('Delete', row)}
            }
          },
          {
            text: 'Detail',
            menuItemProps: {
              onClick: () => {handleOperation('Detail', row)}
            }
          }
        ]} iconButtonProps={{ size: 'small', sx: { color: 'primary.main' } }} />
      )
    }
  ]
  const orgId = '1'
  useEffect(() => {
    fetchCountries();
    getContractStatusList();
    getContractCountByType()
    getDic()
  }, [])

  useEffect(() => {
    setCurrentLocale(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  }, [i18n.language])

  // 查询合同列表
  useEffect(() => {
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
  }, [page, pageSize, params])


  // 获取国家列表
  const fetchCountries = () => {
    axios.get(GET_COUNTRY_LIST, {params: {parent: 0}})
      .then(res => {
        console.log(res);
        setCountryList(res.data.data)
      })
  }

  // 获取更多查询字典
  const getDic = () => {
    const getTeam = axios.get(GET_TEAM_LIST, {params: {orgId}});
    const getCurrency = axios.get(GET_CURRENCY_LIST, {});
    const getEntity = axios.get(GET_ENTITY_LIST, {params: {orgId}});
    Promise.all([getEntity, getCurrency, getTeam]).then(res => {
      console.log(res[0].data.data)
      console.log(res[1].data.data)
      console.log(res[2].data.data)
      setDic({
        entityList: res[0].data.data,
        currencyList: res[1].data.data,
        teamList: res[2].data.data,
      })
    })
  }

  const getContractStatusList = () => {
    axios.get(GET_CONTRACT_STATUS_MAP, {params: {orgId}}).then(res => {
      const tempArr = [{
        count: 1,
        status: 'All'
      }, ...res.data.data]
      setContractStatusList(tempArr)
    })
  }

  const getContractCountByType = () => {
    axios.get(GET_CONTRACT_COUNT_BY_TYPE, {params: {orgId, teamId: '1'}}).then(res => {
      setContractCount(res.data.data)
    })
  }


  const handleSearch = async (key:string, val: any) => {
    switch(key) {
      case 'page':
        setPage(val);
        break;
      case 'pageSize':
        setPageSize(val);
        setPage(1);
        break;
      default:
        setParams({
          ...params,
          [key]: val
        });
        break;
    }
  }

  const handleOperation = ( type: string, obj: any) => {
    switch (type) {
      case 'Edit' :
        router.push(`/contract/create/full-time/?contractId=${obj.contractId}&type=edit`)
        break;
      case 'Detail':
        router.push(`/contract/create/full-time/?contractId=${obj.contractId}&type=detail`)
        break;
      case 'Delete':
        console.log('Delete')
        break;
      default:
        break
    }
  }



  const deleteEmpty = (obj: any) => {
    const a:any = {};
    Object.keys(obj).forEach(v => {
      if(Array.isArray(obj[v])) {
        if(obj[v].length && obj[v].indexOf('All') === -1) {
          a[v] = obj[v]
        }
      } else {
        if(obj[v]) {
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
                <InputLabel size='small'>{t('请假状态')}</InputLabel>
                <Select
                  size='small'
                  label={t('请假状态')}
                  value={params.status}
                  className="contract_list_select"
                  multiple
                  renderValue={(selected) => selected.join(', ')}
                  onChange={e => handleSearch('contractStatus', e.target.value)}
                >
                  {
                    contractStatusList.map(v => (
                      <MenuItem style={{width: '240px',height: '46px'}} disabled={!v.count} key={v.count} value={v.status}>
                        <Checkbox checked={(params.status || []).indexOf(v.status) > -1} />
                        {t(v.status)}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('请假类型')}</InputLabel>
                <Select
                  className="contract_list_select"
                  size='small'
                  autoWidth
                  label={t('请假类型')}
                  value={params.type}
                  onChange={e => setParams(pre => ({ ...pre, staffWorkplaceCountry: e.target.value }))}
                  sx={{ textAlign: 'start', width: '100%' }}
                >
                  {
                    countryList.map(v => (
                      <MenuItem key={v.areaCode} className="contract_list_menuItem" value={v.areaCode}>{t(v.name)}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DatePickerWrapper
                  className="custom-react-datepicker-wrapper"
                >
                  <DatePicker
                    selected={params.date}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    onChange={(date) => {
                      setParams({
                        ...params,
                        date
                      })
                    }}
                    placeholderText='支付日期'
                    customInput={<CustomInput size="small" label='支付日期' />}
                  />
                </DatePickerWrapper>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            autoHeight
            rowsPerPageOptions={[10, 20, 50, 100]}

            // @ts-ignore
            columns={columns}
            rows={rows}
            hideFooter
          />
        </Grid>
        <Grid container spacing={2} style={{alignItems: 'center', padding: '20px 0',display: 'flex'}}>
          <Pagination
            defaultPage={1}
            count={Math.ceil(totalCount / pageSize)}
            page={page}
            onChange={(e, val) => {
              handleSearch('page' ,val)
            }}
          />
          <Select
            value={pageSize}
            size='small'
            onChange={(e) =>  handleSearch('pageSize', e.target.value)}
            sx={{ textAlign: 'start' }}
            style={{width: '100px', marginRight: '10px'}}
          >
            {
              pageSizeList.map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))
            }
          </Select>
          <span>
            共{totalCount}条
          </span>
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

export default VacateList
