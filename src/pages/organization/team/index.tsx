// ** I18n Imports
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { styled, useTheme, lighten, darken } from '@mui/material/styles'

// ** React Imports
import { useEffect, useState } from 'react'

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
import {CREATE_TEAM} from "@/apis";
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

const pageSizeList = [10, 20, 50, 100];

const Teams = () => {
  const [teamList, setTeamList] = useState<any[]>([]);
  const { orgId } = useSelector((state: RootState) => state.org)
  const [totalCount,setTotalCount] = useState<number>(0);
  const [showEditDialog,setShowEditDialog] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1)
  const [params, setParams] = useState<any>({})
  const [pageSize, setPageSize] = useState<number>(10)
  useEffect(() => {
    if(orgId){
      getTeamList()
    }
  }, [orgId])

  const columns = [
    {
      field: 'teamName',
      headerName: '团队名称',
      minWidth: 350,
      renderCell: ({ row }: { row: any }) => (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
              {row.teamName}
            </Typography>
          </Box>
      )
    },
    {
      field: 'contact',
      headerName: '团队经理',
      minWidth: 350,
      renderCell: ({ row }: { row: any }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography noWrap variant='body2'>
            {`${row.teamName}`}
          </Typography>
        </Box>
      )
    },
    {
      field: 'account',
      headerName: '合同数量',
      minWidth: 350,
      renderCell: ({ row }: { row: any }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
            {`${row.teamName}`}
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

  const defaultValues = {
    name: '',
    orgId
  }

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

  const getTeamList = () => {
    axios.get(GET_ORG_TEAM_LIST, {params: {orgId}}).then(res => {
      if(res.data.code === 'SUCCESS') {
        setTeamList(res.data.data)
      }
    })
  }

  const handleSubmit = async () => {
    const valid = await trigger(['name']);
    if(valid) {
      const params = {
        orgId,
        teamName: getValues('name')
      };
      axios.post(CREATE_TEAM, params).then(res => {
        if(res.data.code === 'SUCCESS') {
          console.log('成功')
          toast.success('创建成功')
          setShowEditDialog(false)
        }
      })
    }
  }
  const openDialog = () => {
    setShowEditDialog(true)
  }


  const {
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors }
  } = useForm<{name: string, orgId: string}>({ defaultValues })

  return (
    <Grid container>
      <Button variant='contained' onClick={openDialog} sx={{mb: 8}}>创建团队</Button>
      <Grid item xs={12}>
        <DataGrid
          autoHeight

          // @ts-ignore
          columns={columns.filter(val => !val.columnType || val.columnType === tabKey)}
          rows={teamList.slice(0, 10)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          getRowId={(row: any) => row.teamId}
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
      </Grid>
      <Dialog
        open={showEditDialog}
        onClose={() => {setShowEditDialog(false)}}
        sx={{
          '.MuiPaper-root': {
            width: { xs: '100%', md:  450 },
            '&::-webkit-scrollbar': {
              width: 4,
              borderRadius: 8
            },
            minWidth: { xs: '100%', md: 450 },
            '&::-webkit-scrollbar-thumb': {
              background: '#d9d9d9',
              borderRadius: 8
            }
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            mb: 6,
          }}
        >
          {/*<Box component='img' src='/images/contract/wework-logo.png' sx={{ height: 24 }}></Box>*/}
          <Typography sx={{fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
            创建团队
          </Typography>
          <IconButton
            size='small' onClick={() => {setShowEditDialog(false)}} sx={{color: '#7C4DFF'}}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>
        <Grid item sx={{px: 6, py: 8}}>
          <FormControl fullWidth>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  sx={{mb: 4}}
                  label="团队名称"
                  placeholder="团队名称"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.name)}
                  aria-describedby='name'
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }} id='certificateType'>
                {errors.name.message}
              </FormHelperText>
            )}
          </FormControl>
          <Grid item sx={{width: '100%',display: 'flex', justifyContent: 'flex-end'}}>
            <Button variant='contained' onClick={handleSubmit}>创建团队</Button>
          </Grid>
        </Grid>
      </Dialog>
    </Grid>
  )
}
export default Teams;
