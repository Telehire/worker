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
import Dialog from '@mui/material/Dialog'
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
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
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
  GET_CURRENT_USER_ORG_LIST,
  GET_ENTITY_LIST,
  GET_TEAM_LIST,
  VACATION_QUERY,
  VACATION_CREATE,
  VACATION_UPDATE,
  VACATION_APPROVE,
  VACATION_CANCEL,
  VACATION_LOAD
} from 'src/apis'
import axios from 'axios'
import Pagination from '@mui/material/Pagination'
import CustomInput from '@/views/forms/form-elements/pickers/PickersCustomInput'
import moment, { Moment } from 'moment'
import InputAdornment from '@mui/material/InputAdornment'
import toast from 'react-hot-toast'

const tabsType: any = {
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
  DRAFT: '草稿'
}

const durationMap: any = {
  weekly: '每周',
  monthly: '每月',
  yearly: '每年'
}
const pageSizeList = [10, 20, 50, 100]

interface IParams {
  status: string[] | string
  type: string[] | string
  date: any
  page?: number
  pageSize?: number
}

interface EntityProps {
  entiryCountry: string
  entiryEnName: string
  entiryId: string
  entiryName: string
  kycStatus: number
  orgId: string
  status: number
}

interface CurrencyProps {
  countryCode: string
  countryName: string
  currencyId: string
  currencyName: string
  currencySymbol: string
  currencyUnit: string
  lng: string
}

interface TeamProps {
  creator: string
  founderId: string
  gmtCreate?: any
  gmtModified?: any
  id: number
  modifier: string
  orgId: string
  orgName: string
  role: string
  status: number
  teamId: string
  teamName: string
}

interface DicProps {
  entityList: EntityProps[]
  currencyList: CurrencyProps[]
  teamList: TeamProps[]
}

const STATUS_LIST = [
  { status: '待处理', count: 1, key: 'PENDING' },
  { status: '已批准', count: 1, key: 'APPROVED' },
  { status: '已拒绝', count: 1, key: 'REJECTED' },
  { status: '已验证', count: 1, key: 'VALIDATED' },
  { status: '已结束', count: 1, key: 'ENDED' },
  { status: '已取消', count: 1, key: 'CANCELED' }
]

const TYPE_LIST = [
  { key: 'ANNUAL', label: '年假' },
  { key: 'ABSENCE', label: '事假' },
  { key: 'SICK', label: '病假' },
  { key: 'OTHER', label: '其他' }
]

const MESSAGE_LIST = ['不同意', '拒绝', '作废', '重复提交', '未解决', '请核实', '请补充材料']

const defaultValues = {
  teamName: '',
  contractId: '',
  reason: '',
  vacationDays: '',
  vacationHours: '',
  vacationType: '',
  gmtStartDate: '',
  gmtStartTime: '',
  gmtEndDate: '',
  gmtEndTime: ''
}

const VacateList = () => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [contractList, setContractList] = useState<any[]>([])
  const [orgId, setOrgId] = useState<string>()
  const [params, setParams] = useState<IParams>({ type: [], status: [], date: '' })
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const [totalCount, setTotalCount] = useState<number>(0)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showRefuseDialog, setShowRefuseDialog] = useState<boolean>(false)
  const [showVacateDialog, setShowVacateDialog] = useState<boolean>(false)

  const [currentRow, setCurrentRow] = useState<any>({})
  const [detailRow, setDetailRow] = useState<any>()
  const [operationType, setOperationType] = useState<'check' | 'detail'>()

  const [countryList, setCountryList] = useState<any[]>([])
  const [rows, setRows] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentLocale, setCurrentLocale] = useState(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  const [dic, setDic] = useState<DicProps>({ entityList: [], currencyList: [], teamList: [] })
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const { reset, control, handleSubmit } = useForm({
    defaultValues,
    mode: 'onChange'
    // resolver: yupResolver(schema)
  })

  const {
    control: refuseControl,
    reset: resetRefuse,
    setValue,
    handleSubmit: handleRefuseControl
  } = useForm({
    defaultValues: { memo: '' },
    mode: 'onChange'
    // resolver: yupResolver(schema)
  })

  //TODO
  const columns = [
    {
      field: 'id',
      headerName: '名称',
      minWidth: 314,
      flex: 1,
      renderCell: ({ row }: { row: any }) => (
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
      renderCell: ({ row }: { row: any }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontSize: 14, color: '#606266' }}>{`开始: ${moment(row.gmtStart).format(
            'YYYY-MM-DD HH:mm:ss'
          )}`}</Typography>
          <Typography sx={{ fontSize: 14, color: '#606266' }}>{`结束: ${moment(row.gmtEnd).format(
            'YYYY-MM-DD HH:mm:ss'
          )}`}</Typography>
        </Box>
      )
    },
    {
      field: 'vacationType',
      headerName: '请假类型',
      minWidth: 180,
      type: 'number',
      renderCell: ({ row }: { row: any }) => (
        <Stack alignItems='flex-end'>
          <div>{t(TYPE_LIST?.find(item => item.key === row.vacationType)?.label || '-')}</div>
        </Stack>
      )
    },
    {
      field: 'createTime',
      headerName: '提交时间',
      minWidth: 180,
      type: 'number',
      renderCell: ({ row }: { row: any }) => (
        <Stack alignItems='flex-end'>
          <Typography sx={{ fontSize: 12, color: '#909399' }}>
            {moment(row.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
          </Typography>
        </Stack>
      )
    },
    {
      align: 'right',
      field: 'status',
      headerName: '状态',
      minWidth: 180,
      type: 'number',
      renderCell: ({ row }: { row: any }) => (
        <CustomChip
          rounded
          label={t(STATUS_LIST?.find(item => item.key === row.status)!.status)}
          skin='light'
          color={row.status === 'REJECTED' ? 'error' : 'info'}
        />
      )
    },
    {
      field: 'operation',
      headerName: '操作',
      renderCell: ({ row }: { row: any }) => {
        const options = [
          {
            text: '详情',
            menuItemProps: {
              onClick: () => {
                handleOperation('detail', row)
              }
            }
          }
        ]
        if (row.status === 'PENDING') {
          options.unshift({
            text: '审批',
            menuItemProps: {
              onClick: () => {
                handleOperation('check', row)
              }
            }
          })
        }
        return <OptionsMenu options={options} iconButtonProps={{ size: 'small', sx: { color: 'primary.main' } }} />
      }
    }
  ]

  const rowNameList: { value: string; name: string; render?: (row: any) => any }[] = [
    {
      value: 'staffName',
      name: '申请人'
    },
    {
      value: 'teamName',
      name: '所属团队'
    },
    {
      value: 'vacationType',
      name: '请假类型',
      render: row => t(TYPE_LIST.find(item => item.key === row.vacationType)?.label || '-')
    },
    {
      value: 'status',
      name: '状态',
      render: row => {
        const status = STATUS_LIST?.find(item => item.key === row.status)?.status
        return (
          <CustomChip
            rounded
            label={t(status || '-')}
            skin='light'
            color={row.status === 'REJECTED' ? 'error' : 'info'}
          />
        )
      }
    },
    {
      value: 'gmtStart',
      name: '开始时间',
      render: row => moment(row?.gmtStart).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      value: 'gmtEnd',
      name: '结束时间',
      render: row => moment(row?.gmtEnd).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      value: 'duration',
      name: '时长',
      render: row => `${row.vacationDays || '-'}天${row.vacationHours || '-'}小时`
    },
    {
      value: 'reason',
      name: '请假事由'
    }
  ]
  useEffect(() => {
    getOrgList()
  }, [])

  useEffect(() => {
    getRows()
  }, [params])

  useEffect(() => {
    getRows()
  }, [orgId])

  const getOrgList = async () => {
    const res = await axios.get(GET_CURRENT_USER_ORG_LIST, {})
    if (res.data.code === 'SUCCESS') {
      const _orgId = res.data.data[0].orgId
      getDic(_orgId)
      setOrgId(_orgId)
    }
  }

  useEffect(() => {
    setCurrentLocale(i18n.language.startsWith('zh_') ? 'cn' : i18n.language)
  }, [i18n.language])

  // 获取国家列表
  const fetchCountries = () => {
    axios.get(GET_COUNTRY_LIST, { params: { parent: 0 } }).then(res => {
      setCountryList(res.data.data)
    })
  }

  // 获取更多查询字典
  const getDic = (orgId: string) => {
    const getTeam = axios.get(GET_TEAM_LIST, { params: { orgId } })
    const getCurrency = axios.get(GET_CURRENCY_LIST, {})
    const getEntity = axios.get(GET_ENTITY_LIST, { params: { orgId } })
    Promise.all([getEntity, getCurrency, getTeam]).then(res => {
      setDic({
        entityList: res[0].data.data,
        currencyList: res[1].data.data,
        teamList: res[2].data.data
      })
    })
  }

  // const getContractStatusList = () => {
  //   axios.get(GET_CONTRACT_STATUS_MAP, {params: {orgId}}).then(res => {
  //     const tempArr = [{
  //       count: 1,
  //       status: 'All'
  //     }, ...res.data.data]
  //     setContractStatusList(tempArr)
  //   })
  // }

  const getContractList = (teamId: string) => {
    axios.post(GET_CONTRACT_LIST, { params: { orgId, teamId: [teamId], start: 0, rows: 99999 } }).then(res => {
      setContractList(res.data.data?.pageList || [])
    })
  }

  const getRows = () => {
    const currentParams = {
      ...params,
      orgId,
      start: (page - 1) * pageSize,
      rows: pageSize
    }

    axios.post(VACATION_QUERY, { ...deleteEmpty(currentParams) }).then(res => {
      res.data.data.pageList.forEach((row: any) => {
        row.id = row.vacationId
      })
      setRows(res.data.data.pageList)
      setTotalCount(res.data.data?.totalCount || 0)
    })
  }

  const vacationApprove = (v: any, status: string) => {
    const currentParams = {
      ...v,
      status
    }
    axios.post(VACATION_APPROVE, { ...currentParams }).then(res => {
      if (res.data.code === 'SUCCESS') {
        setShowDialog(false)
        setShowRefuseDialog(false)
        getRows()
        resetRefuse()
      }
    })
  }

  const handleSearch = async (key: string, val: any) => {
    switch (key) {
      case 'page':
        setPage(val)
        setParams({
          ...params,
          [key]: val
        })
        break
      case 'pageSize':
        setPageSize(val)
        setPage(1)
        setParams({
          ...params,
          [key]: val
        })
        break
      default:
        setParams({
          ...params,
          [key]: val
        })
        break
    }
  }

  const getDetail = (obj: any) => {
    axios.get(VACATION_LOAD, { params: { orgId, vacationId: obj.vacationId } }).then(res => {
      if (res.data.code === 'SUCCESS') {
        setDetailRow(res.data.data)
      }
    })
  }

  const handleOperation = (type: string, obj: any) => {
    switch (type) {
      case 'check':
        setOperationType('check')
        setShowDialog(true)
        setCurrentRow(obj)
        break

      case 'detail':
        setOperationType('detail')
        setShowDialog(true)
        getDetail(obj)
        break

      default:
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

  const formatTimestamp = (date: DateType, time: DateType) => {
    const tmpDate = moment(date)
    const tmpTime = moment(time)
    tmpDate.set({
      hour: tmpTime.get('hour'),
      minute: tmpTime.get('minute'),
      second: tmpTime.get('second')
    })
    return tmpDate.valueOf()
  }

  const onSubmit = async (data: any) => {
    data.teamName = undefined
    data.gmtStart = formatTimestamp(data.gmtStartDate, data.gmtStartTime)
    data.gmtEnd = formatTimestamp(data.gmtEndDate, data.gmtEndTime)
    delete data.gmtStartDate
    delete data.gmtStartTime
    delete data.gmtEndDate
    delete data.gmtEndTime
    const params = deleteEmpty(data)
    const res = await axios.post(VACATION_CREATE, params)
    if (res.data?.code === 'SUCCESS') {
      setShowVacateDialog(false)
      reset()
      getRows()
      toast.success('提交成功')
    }
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
          <Grid container spacing={1}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('请假状态')}</InputLabel>
                <Select
                  size='small'
                  label={t('请假状态')}
                  //@ts-ignore
                  value={params.status}
                  className='contract_list_select'
                  multiple
                  renderValue={(selected: string[]) => {
                    const labelList = selected?.map(item => STATUS_LIST.find(status => status.key === item)?.status)
                    return labelList.join(', ')
                  }}
                  onChange={e => handleSearch('status', e.target.value)}
                >
                  {STATUS_LIST.map(v => (
                    <MenuItem
                      style={{ width: '240px', height: '46px' }}
                      disabled={!v.count}
                      key={v.count}
                      value={v.key}
                    >
                      <Checkbox checked={(params.status || []).indexOf(v.key) > -1} />
                      {t(v.status)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel size='small'>{t('请假类型')}</InputLabel>
                <Select
                  className='contract_list_select'
                  size='small'
                  autoWidth
                  label={t('请假类型')}
                  // @ts-ignore
                  value={params.type}
                  onChange={e => handleSearch('type', e.target.value)}
                  renderValue={(selected: string) => {
                    return TYPE_LIST.find(status => status.key === selected)?.label
                  }}
                  sx={{ textAlign: 'start', width: '100%' }}
                >
                  {TYPE_LIST.map(v => (
                    <MenuItem key={v.key} className='contract_list_menuItem' value={v.key}>
                      {t(v.label)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <DatePickerWrapper className='custom-react-datepicker-wrapper'>
                  <DatePicker
                    selected={params.date}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    onChange={date => {
                      setParams({
                        ...params,
                        date
                      })
                    }}
                    placeholderText='提交时间'
                    customInput={<CustomInput size='small' label='提交时间' />}
                  />
                </DatePickerWrapper>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box pl={20}>
                <Button variant='contained' onClick={() => setShowVacateDialog(true)}>
                  {t('提交请假')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            autoHeight
            rowsPerPageOptions={[10, 20, 50, 100]}
            // @ts-ignore
            columns={columns}
            rowHeight={70}
            rows={rows}
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
        </Grid>
      </Grid>

      {/* 请假审批 */}
      <Dialog
        open={showVacateDialog}
        onClose={() => {
          setShowVacateDialog(false)
        }}
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md: 600 },
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
        <Grid sx={{ pt: 6, px: 6 }}>
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
            <Typography sx={{ fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
              提交请假
            </Typography>
            <IconButton size='small' onClick={() => setShowVacateDialog(false)} sx={{ color: '#7C4DFF' }}>
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>
        </Grid>
        <Grid sx={{ px: 6, pb: 6 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, flex: 1, color: '#3A3541DE' }}>请填写请假明细</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#3A354199' }}>
            您工作地所在的时间是 {moment().format('YYYY/MM/DD HH:mm')}
          </Typography>
        </Grid>
        <Box sx={{ px: 5, pb: 5 }}>
          <form autoComplete='off' noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} mb={3}>
              <Grid item sm={6} xl={6}>
                <FormControl fullWidth>
                  <InputLabel>选择团队</InputLabel>
                  <Controller
                    name='teamName'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        fullWidth
                        label='选择团队'
                        inputProps={{ placeholder: '选择团队' }}
                        onChange={e => {
                          getContractList(e.target.value as string)
                        }}
                      >
                        {dic.teamList?.map(item => (
                          <MenuItem value={item.teamId}>{item.teamName}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={6} xl={6}>
                <FormControl fullWidth>
                  <InputLabel>选择员工</InputLabel>
                  <Controller
                    name='contractId'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        fullWidth
                        label='选择员工'
                        inputProps={{ placeholder: '选择员工' }}
                        onChange={e => {
                          onChange(e.target.value)
                        }}
                      >
                        {contractList?.map(item => (
                          <MenuItem value={item.contractId}>{item.staffName}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='plan-select'>{t('请假类型')}</InputLabel>
              <Controller
                name='vacationType'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    fullWidth
                    id='select-plan'
                    label='Select Plan'
                    labelId='plan-select'
                    inputProps={{ placeholder: 'Select Plan' }}
                    onChange={onChange}
                  >
                    {TYPE_LIST.map(v => (
                      <MenuItem key={v.key} value={v.key}>
                        {t(v.label)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <Grid container spacing={2} mb={3}>
              <Grid item sm={6} xl={6}>
                <FormControl fullWidth>
                  <Controller
                    name='gmtStartDate'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePickerWrapper className='custom-react-datepicker-wrapper'>
                        <DatePicker
                          // @ts-ignore
                          selected={value}
                          id='start-date'
                          popperPlacement={'top-start'}
                          onChange={onChange}
                          placeholderText='开始日期'
                          customInput={<CustomInput label='开始日期' />}
                        />
                      </DatePickerWrapper>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={6} xl={6}>
                <FormControl fullWidth>
                  <Controller
                    name='gmtStartTime'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePickerWrapper className='custom-react-datepicker-wrapper'>
                        <DatePicker
                          // @ts-ignore
                          selected={value}
                          id='start-time'
                          popperPlacement={popperPlacement}
                          onChange={onChange}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={5}
                          timeCaption='Time'
                          dateFormat='h:mm aa'
                          placeholderText='开始时间'
                          customInput={<CustomInput label='开始时间' />}
                        />
                      </DatePickerWrapper>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={3}>
              <Grid item sm={6} xl={6}>
                <FormControl fullWidth>
                  <Controller
                    name='gmtEndDate'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePickerWrapper className='custom-react-datepicker-wrapper'>
                        <DatePicker
                          // @ts-ignore
                          selected={value}
                          id='start-date'
                          popperPlacement={popperPlacement}
                          onChange={onChange}
                          placeholderText='结束日期'
                          customInput={<CustomInput label='结束日期' />}
                        />
                      </DatePickerWrapper>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={6} xl={6}>
                <FormControl fullWidth>
                  <Controller
                    name='gmtEndTime'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePickerWrapper className='custom-react-datepicker-wrapper'>
                        <DatePicker
                          // @ts-ignore
                          selected={value}
                          id='end-time'
                          popperPlacement={popperPlacement}
                          onChange={onChange}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={5}
                          timeCaption='Time'
                          dateFormat='h:mm aa'
                          placeholderText='结束时间'
                          customInput={<CustomInput label='结束时间' />}
                        />
                      </DatePickerWrapper>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container mb={3} alignItems='center' spacing={2}>
              <Grid item sm={4} xl={4}>
                <Typography
                  component='span'
                  sx={{ fontSize: 14, fontWeight: 500, flex: 1, alignSelf: 'center', color: '#3A354199' }}
                >
                  请输入请假时长
                </Typography>
              </Grid>
              <Grid item sm={4} xl={4}>
                <FormControl>
                  <Controller
                    name='vacationDays'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='number'
                        onChange={onChange}
                        InputProps={{
                          endAdornment: <InputAdornment position='end'>{t('天')}</InputAdornment>
                        }}
                      ></TextField>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={4} xl={4}>
                <FormControl>
                  <Controller
                    name='vacationHours'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='number'
                        onChange={onChange}
                        InputProps={{
                          endAdornment: <InputAdornment position='end'>{t('小时')}</InputAdornment>
                        }}
                      ></TextField>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid mb={3}>
              <FormControl fullWidth>
                <Controller
                  name='reason'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      multiline
                      minRows={4}
                      label='请假事由'
                      onChange={onChange}
                      placeholder='请假事由'
                    ></TextField>
                  )}
                />
              </FormControl>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button size='large' variant='outlined' color='secondary' onClick={() => setShowVacateDialog(false)}>
                {t('取消')}
              </Button>
              <Button size='large' type='submit' variant='contained' sx={{ ml: 3 }}>
                {t('确定提交')}
              </Button>
            </Box>
          </form>
        </Box>
      </Dialog>
      {/* 详情 */}

      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false)
          setDetailRow(undefined)
        }}
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md: 600 },
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
        <Grid sx={{ py: 6, px: 6 }}>
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
              请假{operationType === 'check' ? '审批' : '详情'}
            </Typography>
            <IconButton
              size='small'
              onClick={() => {
                setShowDialog(false)
                setDetailRow(undefined)
              }}
              sx={{ color: '#7C4DFF' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>

          {rowNameList.map(v => (
            <Grid
              item
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 3,
                pl: 4,
                pr: 14,
                backgroundColor: '#F9FAFC',
                borderRadius: 1,
                mb: 5
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#3A354199', width: 130 }}>{v.name}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE' }}>
                {v?.render?.(detailRow || currentRow) || detailRow?.[v.value] || currentRow?.[v.value]}
              </Typography>
            </Grid>
          ))}
          {detailRow?.status === 'REJECTED' && (
            <Grid
              item
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 3,
                pl: 4,
                pr: 14,
                backgroundColor: '#F9FAFC',
                borderRadius: 1,
                mb: 5
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#3A354199', width: 130 }}>
                {t('拒绝理由')}
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, flex: 1, color: '#3A3541DE' }}>
                {detailRow?.memo || '-'}
              </Typography>
            </Grid>
          )}
          {operationType === 'check' && (
            <Grid sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pr: 4, mt: 4 }}>
              <Button
                onClick={() => setShowRefuseDialog(true)}
                sx={{ fontSize: 14, color: '#FF4C51', border: '1px solid #FF4C51', py: 1.5, px: 6, mr: 5 }}
              >
                拒绝
              </Button>
              <Button
                onClick={() => vacationApprove(currentRow, 'APPROVED')}
                sx={{
                  fontSize: 14,
                  color: '#fff',
                  border: '1px solid #7C4DFF',
                  backgroundColor: '#7C4DFF',
                  py: 1.5,
                  px: 6
                }}
              >
                同意
              </Button>
            </Grid>
          )}
        </Grid>
      </Dialog>
      {/* 拒绝 */}
      <Dialog
        open={showRefuseDialog}
        onClose={() => {
          setShowRefuseDialog(false)
          resetRefuse()
        }}
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md: 600 },
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
        <Grid sx={{ pt: 6, px: 6 }}>
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
            <Typography sx={{ fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
              {t('审批拒绝意见')}
            </Typography>
            <IconButton size='small' onClick={() => setShowRefuseDialog(false)} sx={{ color: '#7C4DFF' }}>
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>
        </Grid>
        <Box sx={{ px: 5, py: 5 }}>
          <form
            autoComplete='off'
            onSubmit={handleRefuseControl(data => vacationApprove({ ...currentRow, ...data }, 'REJECTED'))}
          >
            <FormControl fullWidth>
              <Controller
                name='memo'
                control={refuseControl}
                render={({ field: { value, onChange } }) => (
                  <TextField multiline minRows={4} value={value} onChange={onChange}></TextField>
                )}
              />
            </FormControl>
            <Grid mt={3}>
              <Typography
                component='span'
                sx={{ fontSize: 14, fontWeight: 500, textAlign: 'center', color: '#3A354199' }}
              >
                {t('推荐回复')}
              </Typography>
            </Grid>
            <Grid>
              {MESSAGE_LIST?.map(item => (
                <Typography
                  component='span'
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    px: 2,
                    py: 1,
                    mr: 3,
                    color: '#3A3541DE',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(58, 53, 65, 0.08)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setValue('memo', item)}
                >
                  {item}
                </Typography>
              ))}
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button size='large' variant='outlined' color='secondary' onClick={() => setShowRefuseDialog(false)}>
                {t('取消')}
              </Button>
              <Button size='large' type='submit' variant='contained' sx={{ ml: 3 }}>
                {t('确定')}
              </Button>
            </Box>
          </form>
        </Box>
      </Dialog>
    </Box>
  )
}

export default VacateList
