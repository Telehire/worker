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
import { fetchCurrentOrgList } from '@/store/apps/org'
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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
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
  GET_TEAM_LIST,
  GET_CURRENT_USER_ORG_LIST,
  DELETE_CONTRACT
} from 'src/apis'
import axios from 'axios'
import Pagination from "@mui/material/Pagination";
import {filterCountrySupported} from "../../../@core/utils/filter-country-supported";


const tabsType: any =  {
  EOR: 'EOR',
  PEO: 'Contract'
}
interface Contract {
  contractId: string,
  contractStatus: string,
  orgId: string,
  staffName: string,
  staffWorkplaceCountry: string,
  jobTitle: string,
  salaryAmount: string;
  salaryCurrency: string;
  salaryFiguredPeriod: 'weekly' | 'monthly' | 'yearly';
  FiguredPeriod: string;
  staffWorkplaceCountryInfo: {
    areaCode: string,
    hasNext: string,
    lng: string,
    name: string,
    parentCode: string
  },
  teamId: string,
  teamName: string
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
  contractStatus?: string[]
  staffWorkplaceCountry: string
  keywords: string
  entiryIds: string[]
  currencies: string[]
  teamIds: string[]
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

let timer: any= null


const ContractList = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [contractCount, setContractCount] = useState<any[]>([]);
  const [tabKey, setTabkey] = useState<any>('EOR')
  const [params, setParams] = useState<IParams>({ contractStatus: [], staffWorkplaceCountry: '', keywords: '', entiryIds: [], currencies: [], teamIds: [] })
  const [contractStatusList, setContractStatusList] = useState<any[]>([])
  const [contractList, setContractList] = useState<any[]>([])
  const [totalCount,setTotalCount] = useState<number>(0);
  const [countryList, setCountryList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [showMoreSearch, setShowMoreSearch] = useState<boolean>(false)
  const [currentLocale, setCurrentLocale] = useState(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  const [dic, setDic] = useState<DicProps>({entityList: [], currencyList: [], teamList: []})
  const router = useRouter()
  const { orgId } = useSelector((state: RootState) => state.org)
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
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}>{`${row.salaryCurrency || '$'} ${Number(row.salaryAmount) / 1000 || 0}`}</Typography>
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
        <CustomChip rounded label={row.contractStatus} skin='light' color={row.contractStatus === 'UNPAID' ? 'error' : 'info'} />
      )
    },
    {
      field: 'opration',
      headerName: '操作',
      renderCell: ({ row }: { row: Contract }) => {
        const menuArr = [
          {
            text: 'Detail',
            menuItemProps: {
              onClick: () => {handleOperation('Detail', row)}
            }
          }
        ]
        
        //已支付待入职
        if(row.contractStatus !== 'PENDING-ENTRY') {
          menuArr.unshift(  {
            text: 'Delete',
            menuItemProps: {
              onClick: () => {handleOperation('Delete', row)}
            }
          })
          menuArr.unshift( {
            text: 'Edit',
            menuItemProps: {
              onClick: () => {handleOperation( 'Edit', row)}
            }
          })
        }

        if(row.contractStatus === 'UNPAID') {
          menuArr.unshift(  {
            text: 'To Pay',
            menuItemProps: {
              onClick: () => {handleOperation('Pay', row)}
            }
          })
        }
        return <OptionsMenu options={menuArr} iconButtonProps={{ size: 'small', sx: { color: 'primary.main' } }} />
      }
    }
  ]

  useEffect(() => {
    if(orgId) {
      fetchCountries();
      getContractStatusList();
      getContractCountByType()
      getDic()
      getUserOrgList()
    }
  }, [orgId])

  useEffect(() => {
    setCurrentLocale(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  }, [i18n.language])

 // 查询合同列表
  useEffect(() => {
    if(!orgId) return
    fetchList();
  }, [page, pageSize, params.contractStatus, params.staffWorkplaceCountry, params.entiryIds, params.currencies, params.teamIds, orgId])

  // 查询合同列表
  useEffect(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fetchList();
    }, 500)
  }, [params.keywords])

  const fetchList = () => {
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
  }

 // 获取国家列表
  const fetchCountries = () => {
    axios.get(GET_COUNTRY_LIST, {params: {parent: 0}})
      .then(res => {
        console.log(res);
        setCountryList(res.data.data)
      })
  }

  const getUserOrgList = () => {
    if(!orgId) {
      dispatch(fetchCurrentOrgList({}))
    }
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

  const toggleShowMoreSearch = (val: boolean) => {
    setShowMoreSearch(val);
    if(!val) {
      setParams({
        ...params,
        entiryIds: [],
        currencies: [],
        teamIds: [],
      })
    }
  }

  const handleOperation = ( type: string, obj: any) => {
    switch (type) {
      case 'Edit' :
        router.push(`/contract/create/full-time/?contractId=${obj.contractId}&type=edit`)
        break;
      case 'Detail':
        if(obj.contractStatus === 'PENDING-ENTRY') {
          router.push(`/contract/detail/?contractId=${obj.contractId}`)
        }else{
          router.push(`/contract/create/full-time/?contractId=${obj.contractId}&type=detail`)
        }
        break;
      case 'Delete':
        deleteContract(obj.contractId);
        break;
      case 'Pay':
        router.push(`/contract/create/full-time/?contractId=${obj.contractId}&type=detail`)
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

  const deleteContract = async (contractId:string) => {
    const tempParams = {
      orgId,
      contractId,
    }
    const res = await axios.delete(DELETE_CONTRACT, {params:tempParams})
    fetchList();
    return res
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column'
      }}
    >
      <Grid container sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6}>
          <Tabs value={tabKey} onChange={(e, val) => setTabkey(val)}>
            {
              Object.keys(tabsType).map(v => (
                <Tab key={v} value={v} label={t(tabsType[v]) + t('Staff') +`${contractCount.find(item => item.contractType === v)?.count || 0}`} />
              ))
            }
            {/*<Tab value={TabsType.EOR} label='EOR员工（56）' />*/}
            {/*<Tab value={TabsType.Contract} label='合同工（104）' />*/}
          </Tabs>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'end', color: theme.palette.common.white }} style={{display: 'flex',justifyContent: 'flex-end',alignItems: 'center'}}>
          <TextField
            size='small'
            id="outlined-basic"
            value={params.keywords}
            label={t('搜索员工/合同')}
            variant="outlined"
            style={{width: '420px',marginRight: '18px'}}
            onChange={(e) => handleSearch('keywords', e.target.value)}
            InputProps={{
              startAdornment: <Icon icon='basil:search-outline' />,
            }}
          />
          <Button size='large' variant='contained' onClick={() => router.push('/contract/create/')}>
            <Icon icon='basil:user-plus-outline' />
            <Typography sx={{ whiteSpace: 'noWrap', fontSize: 15, ml: 2.5, color: theme.palette.common.white }}>
              {t('Create Contract')}
            </Typography>
          </Button>
        </Grid>
      </Grid>

      <Grid container sx={{ background: theme.palette.background.paper }}>
        <Grid item xs={12} sx={{ py: 3.5, px: 6 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('合同状态')}</InputLabel>
                <Select
                  size='small'
                  label={t('合同状态')}
                  value={params.contractStatus}
                  className="contract_list_select"
                  multiple
                  renderValue={(selected) => selected.join(', ')}
                  onChange={e => handleSearch('contractStatus', e.target.value)}
                >
                  {
                    contractStatusList.map(v => (
                      <MenuItem style={{width: '240px',height: '46px'}} disabled={!v.count} key={v.count} value={v.status}>
                        <Checkbox checked={(params.contractStatus || []).indexOf(v.status) > -1} />
                        {t(v.status)}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('员工工作地')}</InputLabel>
                <Select
                  className="contract_list_select"
                  size='small'
                  autoWidth
                  label={t('员工工作地')}
                  value={params.staffWorkplaceCountry}
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
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <Button size='medium' variant='text' style={{backgroundColor: 'white'}} onClick={() => toggleShowMoreSearch(!showMoreSearch)}>
                  {t(showMoreSearch ? '收起':'更多筛选')}
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        {
          showMoreSearch && (
            <Grid item xs={12} sx={{ py: 3.5, px: 6 }}>
              <Grid container sx={{ background: theme.palette.background.paper }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel size='small'>{t('企业实体')}</InputLabel>
                    <Select
                      className="contract_list_select"
                      size='small'
                      autoWidth
                      multiple
                      label={t('企业实体')}
                      value={params.entiryIds}
                      onChange={e => handleSearch('entiryIds', e.target.value)}
                      sx={{ textAlign: 'start', width: '100%' }}
                    >
                      {
                        dic.entityList.map(v => (
                          <MenuItem style={{width: '240px',height: '46px'}} key={v.entiryId} value={v.entiryId}>
                            <Checkbox checked={(params.entiryIds || []).indexOf(v.entiryId) > -1} />
                            {t(v.entiryName)}
                          </MenuItem>))
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel size='small'>{t('合同货币')}</InputLabel>
                    <Select
                      className="contract_list_select"
                      size='small'
                      autoWidth
                      multiple
                      label={t('合同货币')}
                      value={params.currencies}
                      onChange={e => handleSearch('currencies', e.target.value)}
                      sx={{ textAlign: 'start', width: '100%' }}
                    >
                      {
                        dic.currencyList.map(v => (
                          <MenuItem style={{width: '240px',height: '46px'}} key={v.currencyId} value={v.currencyId}>
                            <Checkbox checked={(params.currencies || []).indexOf(v.currencyId) > -1} />
                            {t(v.currencyName)}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel size='small'>{t('归属团队')}</InputLabel>
                    <Select
                      className="contract_list_select"
                      size='small'
                      autoWidth
                      multiple
                      label={t('归属团队')}
                      value={params.teamIds}
                      onChange={e => handleSearch('teamIds', e.target.value)}
                      sx={{ textAlign: 'start', width: '100%' }}
                    >
                      {
                        dic.teamList.map(v => (
                          <MenuItem style={{width: '240px',height: '46px'}} key={v.teamId} value={v.teamId}>
                            <Checkbox checked={(params.teamIds || []).indexOf(v.teamId) > -1} />
                            {t(v.teamName)}
                          </MenuItem>))
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            </Grid>
          )
        }
        <Grid item xs={12}>
          <DataGrid
            autoHeight
            rowHeight={70}
            getRowId={(row) => row.contractId }
            rowsPerPageOptions={[10, 20, 50, 100]}

            // @ts-ignore
            columns={columns.filter(val => !val.columnType || val.columnType === tabKey)}
            rows={contractList}
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

export default ContractList
