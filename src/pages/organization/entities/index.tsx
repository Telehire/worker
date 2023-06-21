// ** I18n Imports
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { styled, useTheme, lighten, darken } from '@mui/material/styles'

// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** View Imports
import { useDispatch, useSelector } from 'react-redux'
import {RootState} from "@/store";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {CREATE_TEAM, GET_ORG_ENTITY_LIST} from "@/apis";
import DatePickerWrapper from "@/@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";
import CustomInput from "@/views/forms/form-elements/pickers/PickersCustomInput";
import {DataGrid} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import { GET_ORG_TEAM_LIST } from '@/apis'
import Box from "@mui/material/Box";
import OptionsMenu from "@/@core/components/option-menu";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Icon from "@/@core/components/icon";
import toast from 'react-hot-toast'
import CustomChip from "@/@core/components/mui/chip";
import Header from "@/views/organization/components/Header";
import Tabs from "@/views/organization/components/Tabs";
import Basic from "@/views/organization/basic";

const pageSizeList = [10, 20, 50, 100];

const statusMap = {
    0: '未提交',
    1: '初始化',
    2: '资料待补充',
    3: '待审核',
    4: '审核失败',
    5: '审核通过',
    9: '审核不通过，不允许继续',
  }

const Teams = () => {
  const { t } = useTranslation()
  const [entityList, setEntityList] = useState<any[]>([{type: 'add'}]);
  const { orgId } = useSelector((state: RootState) => state.org)
  const [totalCount,setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1)
  const [params, setParams] = useState<any>({})
  const [pageSize, setPageSize] = useState<number>(10)
  const router = useRouter()
  useEffect(() => {
    if(orgId){
      getEntityList()
    }
  }, [orgId])

  const columns = [
    {
      field: 'entiryName',
      headerName: '团队名称',
      minWidth: 350,
      renderCell: ({ row }: { row: any }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
            {row.entiryName}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: '认证状态',
      minWidth: 350,
      renderCell: ({ row }: { row: any }) => (
        <CustomChip rounded label={(statusMap as any)[row.kycStatus]} skin='light' color='info' />
      )
    },
    {
      field: 'account',
      headerName: '合同数量',
      minWidth: 350,
      renderCell: ({ row }: { row: any }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
            {`${row.entiryName}`}
          </Typography>
        </Box>
      )
    },
    {
      field: 'opration',
      headerName: '操作',
      renderCell: ({ row }: { row: any }) => {
        const options = [
          {
            text: '编辑',
            menuItemProps: {
              onClick: () => {toEdit(row)}
            }
          },
          {
            text: '删除',
            menuItemProps: {
              onClick: () => {toDelete(row)}
            }
          },
        ]
        return <OptionsMenu
          options={options}
          iconButtonProps={{ size: 'small', sx: { color: 'primary.main' } }}
        />
      }
    },
  ]

  const toEdit = (row: any) => {
    console.log(row)
  }

  const toDelete = (row: any) => {
    console.log(row)
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

  const getEntityList = () => {
    axios.get(GET_ORG_ENTITY_LIST, {params: {orgId}}).then(res => {
      if(res.data.code === 'SUCCESS') {
        setEntityList([...entityList, ...res.data.data])
      }
    })
  }

  const openDialog = () => {
    router.push('/enterprise/certification')
  }


  // const {
  //   control,
  //   setValue,
  //   getValues,
  //   trigger,
  //   formState: { errors }
  // } = useForm<{name: string, orgId: string}>({ defaultValues })

  return (
    <Box>
      <Header title={t('基本设置')} />
      <Tabs current='entities' />
      <Grid container>
        <Grid container md={12} sx={{display: 'flex', alignItems: 'center'}}>
          {
            entityList.map(v => (
              <Grid
                item
                sx={{
                  height: 172,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 1,
                  boxShadow: ' 0px 2px 8px -4px rgba(58, 53, 65, 0.04), 0px 2px 12px rgba(58, 53, 65, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '24%',
                  mr: '1%',
                  px: 5,
                  py: 5,
                  mb: 3
                }}>
                {
                  v.type === 'add' && (
                    <>
                      <Icon icon="material-symbols:add-circle-outline" style={{width: 40, height: 40, color: '#3A354199'}} onClick={openDialog} />
                      <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE', mb: 2, mt: 4}}>添加实体</Typography>
                      <Typography sx={{fontSize: 12, fontWeight: 400, color: '##3A354199'}}>从世界任何地方添加新实体</Typography>
                    </>
                  )
                }
                {
                  v.type !== 'add' && (
                    <>
                      <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                        <Box component="img" src={v.url} width={48} height={48}  />
                        <Grid sx={{ml: 3, mb: 2}}>
                          <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE', mb: 1}}>{v.entiryName}</Typography>
                          <Typography sx={{fontSize: 12, fontWeight: 400, color: '##3A354199'}}>{v.entiryCountry}</Typography>
                        </Grid>
                      </Grid>
                      <Grid sx={{height: '1px', backgroundColor: '#3A35411F',width: '100%', mt: 5, mb: 3}} />
                      <Grid sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                        <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE'}}>合同数量{v.entiryCountry}</Typography>
                        <Button variant="text">详情</Button>
                      </Grid>
                    </>
                  )
                }
              </Grid>
              )
            )
          }
        </Grid>
    </Grid>
    </Box>
  )
}
export default Teams;
