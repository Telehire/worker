// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

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
    manageScope: '团队名称1、团队名称2'
  },
  {
    id: 2,
    employee: {
      name: '周利云',
      email: 'h.tik@infcj.ws'
    },
    manageScope: '团队名称1、团队名称2...'
  },
  {
    id: 3,
    employee: {
      name: '王民琦',
      email: 'c.wsodh@qtcjgkemn.nr'
    },
    manageScope: '团队名称1'
  }
]

const TeamManagers = () => {
  const { t } = useTranslation()

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
      minWidth: 312,
      field: 'manageScope',
      headerName: '管理范围',
      renderCell: ({ row }: { row: Manager }) => (
        <Typography sx={{ fontSize: 14, color: '#606266' }}>{row.manageScope}</Typography>
      )
    },
    {
      minWidth: 122,
      field: 'opration',
      align: 'center',
      headerName: '操作',
      renderCell: ({ row }: { row: Manager }) => (
        <>
          <Button>{t('编辑')}</Button>
          <Button disabled>{t('移除')}</Button>
        </>
      )
    }
  ]

  return (
    <Box sx={{ position: 'relative' }}>
      <ButtonStyled
        LinkComponent={Link}
        href='/organization/managers/invite'
        variant='outlined'
        size='small'
        sx={{ position: 'absolute', right: 0, top: -50 }}
      >
        {t('邀请经理')}
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
    </Box>
  )
}

export default TeamManagers
