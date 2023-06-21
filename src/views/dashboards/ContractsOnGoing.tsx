// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

interface Contract {
  id: number
  employee: {
    name: string
    title: string
  }
  team: {
    name: string
  }
  contractStatus: string
  contractType: string
  salary: number
  salaryPeriod: string
}

const rows: Contract[] = [
  {
    id: 1,
    employee: {
      name: '王学兵',
      title: '前端工程师'
    },
    team: {
      name: '所属团队名称'
    },
    contractStatus: '审核中',
    contractType: '全职',
    salary: 100000,
    salaryPeriod: '每月'
  },
  {
    id: 2,
    employee: {
      name: '赵丽娜',
      title: '高级产品经理'
    },
    team: {
      name: '所属团队名称'
    },
    contractStatus: '待客户签字',
    contractType: '外包-固定费用',
    salary: 120000,
    salaryPeriod: '每月'
  },
  {
    id: 3,
    employee: {
      name: 'Abraham Daniel',
      title: '财务核算师'
    },
    team: {
      name: '所属团队名称'
    },
    contractStatus: '待客户签字',
    contractType: '外包-现收现付',
    salary: 240000,
    salaryPeriod: '双周'
  }
]

const columns = [
  {
    field: 'id',
    minWidth: 321,
    headerName: '名称',
    renderCell: ({ row }: { row: Contract }) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar src={`/images/avatars/${row.id}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography noWrap variant='body2' sx={{ color: 'primary.main' }}>
            {row.employee.name}-{row.employee.title}
          </Typography>
          <Typography noWrap variant='caption' sx={{ color: 'text.light' }}>
            {row.team.name}
          </Typography>
        </Box>
      </Box>
    )
  },
  {
    minWidth: 134,
    field: 'contractType',
    headerName: '合同类型',
    renderCell: ({ row }: { row: Contract }) => (
      <Typography sx={{ fontSize: 14, color: '#606266' }}>{row.contractType}</Typography>
    )
  },
  {
    minWidth: 109,
    align: 'right',
    field: 'salary',
    headerName: '薪资',
    renderCell: ({ row }: { row: Contract }) => (
      <Stack alignItems='flex-end'>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#303133' }}>${row.salary / 100}.00</Typography>
        <Typography sx={{ fontSize: 12, color: '#909399' }}>{row.salaryPeriod}</Typography>
      </Stack>
    )
  },
  {
    minWidth: 156,
    align: 'right',
    field: 'contractStatus',
    headerName: '合同状态',
    renderCell: ({ row }: { row: Contract }) => (
      <CustomChip rounded label={row.contractStatus} skin='light' color='info' />
    )
  },
  {
    minWidth: 36,
    field: 'opration',
    headerName: '操作',
    renderCell: ({ row }: { row: Contract }) => (
      <OptionsMenu options={['Edit', 'Delete']} iconButtonProps={{ size: 'small', sx: { color: 'primary.main' } }} />
    )
  }
]

const ContractsOnGoing = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent sx={{ px: 6, py: 5 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{t('进行中的合同')}</Typography>
          <Link href='#' sx={{ fontSize: 14, fontWeight: 400, color: 'info.main' }}>
            {t('更多 >')}
          </Link>
        </Stack>

        <Box sx={{ height: 205 }}>
          <DataGrid

            // @ts-ignore
            columns={columns}
            rows={rows.slice(0, 10)}
            sx={{ '& .MuiDataGrid-footerContainer': { display: 'none' } }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default ContractsOnGoing
