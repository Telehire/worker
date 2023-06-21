// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Stack from '@mui/material/Stack'

// ** Components Imports
import Link from 'src/components/link'

interface Props {
  current: string
}

const Tabs = ({ current }: Props) => {
  const { t } = useTranslation()

  const tabs = [
    {
      key: 'basic',
      label: t('基础设置')
    },
    {
      key: 'managers',
      label: t('权限设置')
    },
    {
      key: 'entities',
      label: t('关联实体')
    },
    {
      key: 'team',
      label: t('Team')
    },
    {
      key: 'payment',
      label: t('支付方式')
    },
    {
      key: 'refoud',
      label: t('退款方式')
    }
  ]

  return (
    <Stack direction='row' sx={{ mb: 4 }}>
      {tabs.map(item => (
        <Link
          href={`/organization/${item.key}`}
          sx={{
            mr: 3,
            px: 4,
            py: 1.5,
            fontSize: 14,
            border: '1px solid',
            color: item.key === current ? 'primary.main' : '#606266',
            background: item.key === current ? '#F1F0FF' : '#fff',
            borderColor: item.key === current ? '#D9D7FE' : 'transparent',
            borderRadius: 5,

            // @ts-ignore
            '&:hover': { background: theme => '#F1F0FF' }
          }}
          key={item.key}
        >
          {item.label}
        </Link>
      ))}
    </Stack>
  )
}

export default Tabs
