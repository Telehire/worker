// ** I18n Imports
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Icon from "@/@core/components/icon";

const ButtonStyled = styled(Button)(() => ({
  padding: '6px 20px !important',
  fontSize: 14,
  color: '#7C4DFF',
  background: '#F1F0FF',
  borderColor: 'transparent',
  boxShadow: 'none'
}))

interface Manager {
  id: number
  employee: {
    name: string
    email: string
  }
  manageScope: string
}

const rows: Manager[] = [
  {
    id: 1,
    employee: {
      name: '冯艺莲',
      email: 'j.iiysyslmvw@nohdg.gi'
    },
    manageScope: '全组织'
  },
  {
    id: 2,
    employee: {
      name: '周利云',
      email: 'h.tik@infcj.ws'
    },
    manageScope: '全组织'
  },
  {
    id: 3,
    employee: {
      name: '王民琦',
      email: 'c.wsodh@qtcjgkemn.nr'
    },
    manageScope: '全组织'
  }
]

const OrganizationManagers = () => {
  const { t } = useTranslation()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [editingRow, setEditingRow] = useState<any>({})
  const columns = [
    {
      field: 'id',
      flex: 1,
      minWidth: 321,
      headerName: '姓名',
      renderCell: ({ row }: { row: Manager }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar src={`/images/avatars/${row.id}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
              {row.employee.name}
            </Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.light' }}>
              {row.employee.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      minWidth: 176,
      field: 'manageScope',
      headerName: '管理范围',
      renderCell: ({ row }: { row: Manager }) => (
        <>
          <Typography sx={{ fontSize: 14, color: '#606266' }}>{row.manageScope}</Typography>
          {row.id === 1 ? (
            <Box component='img' src='/images/organization/crown.png' sx={{ width: 20, ml: 2.5 }} />
          ) : null}
        </>
      )
    },
    {
      minWidth: 122,
      field: 'opration',
      align: 'center',
      headerName: '操作',
      renderCell: ({ row }: { row: Manager }) => (
        <>
          <Button onClick={() => {editRow(row)}}>{t('编辑')}</Button>
          <Button disabled>{t('移除')}</Button>
        </>
      )
    }
  ]

  const editRow = (row: Manager) => {
    console.log(123123)
    setEditingRow(row);
    setShowDialog(true)
    console.log(row)
  }

  const handleCloseEditDialog = () => {
    setShowDialog(false)
  }

  const dialogInside = () => {

    return (
      <Grid container md={12} sx={{display: 'flex', py: 6, px: 6}}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 5,
            width: '100%'
          }}
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box component='img' src='/images/organization/nologo.png' sx={{ width: 56, mr: 3 }} />
            <Grid item sx={{flex: 1}}>
              <Typography sx={{fontSize: 14, fontWeight: 500, color: '#3A3541DE'}}>{editingRow.name || '冯艺莲'}</Typography>
              <Typography sx={{fontSIze: 12, fontWeight: 400, color: '#3A354199'}}>{editingRow.email || 'j.iiysyslmvw@nohdg.gi'}</Typography>
            </Grid>
          </Box>
          <IconButton
            size='small' onClick={() => {setShowDialog(false)}}
          >
            <Icon icon='mdi:close' style={{color: '#6E41C0'}} />
          </IconButton>
        </Box>
        <Typography sx={{fontSize: 12, color: '#3A3541DE'}}>管理的团队(3)</Typography>
        <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', py:2.5, px: 4, backgroundColor: '#F9FAFC', mb: 2}}>
          <Box component='img' src='/images/organization/nologo.png' sx={{ width: 40, mr: 2 }} />
          <Typography sx={{fontSize: 12, color: '#3A3541DE',flex: 1}}>团队名称</Typography>
          <Icon icon="material-symbols:edit-square-outline" width={20} />
        </Grid>
        <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', py:2.5, px: 4, backgroundColor: '#F9FAFC', mb: 2}}>
          <Box component='img' src='/images/organization/nologo.png' sx={{ width: 40, mr: 2 }} />
          <Typography sx={{fontSize: 12, color: '#3A3541DE',flex: 1}}>团队名称</Typography>
          <Icon icon="material-symbols:edit-square-outline" width={20} />
        </Grid>
        <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', py:2.5, px: 4, backgroundColor: '#F9FAFC', mb: 2}}>
          <Box component='img' src='/images/organization/nologo.png' sx={{ width: 40, mr: 2 }} />
          <Typography sx={{fontSize: 12, color: '#3A3541DE',flex: 1}}>团队名称</Typography>
          <Icon icon="material-symbols:edit-square-outline" width={20} />
        </Grid>
      </Grid>
    )
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <ButtonStyled
        LinkComponent={Link}
        href='/organization/managers/add'
        variant='outlined'
        size='small'
        sx={{ position: 'absolute', right: 0, top: -50 }}
      >
        {t('添加组织管理员')}
      </ButtonStyled>

      <Box sx={{ height: (rows.length + 1) * 64 }}>
        <DataGrid

          // @ts-ignore
          columns={columns}
          rows={rows.slice(0, 10)}
          rowHeight={64}
          headerHeight={48}
          sx={{ '& .MuiDataGrid-footerContainer': { display: 'none' } }}
        />
        <Typography variant='body2'>共{rows.length}个人</Typography>
      </Box>
      <Dialog
        open={showDialog}
        onClose={handleCloseEditDialog}
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
        {dialogInside()}
      </Dialog>
    </Box>
  )
}

export default OrganizationManagers
