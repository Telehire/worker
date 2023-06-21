// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

const ContractsToBeSigned = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent sx={{ px: 6, py: 5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 6.5 }}>{t('待签署合同')}</Typography>

        <Stack flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Stack flexDirection='row' alignItems='center'>
            <Box component='img' src='/images/dashboards/contract.png' sx={{ width: 48, mr: 4 }} />
            <Stack flexDirection='row' alignItems='baseline'>
              <Typography sx={{ fontSize: 32, fontWeight: 700 }}>4</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#909399', ml: 2 }}>个</Typography>
            </Stack>
          </Stack>

          <CustomChip rounded label={t('去签署')} skin='light' color='info' />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ContractsToBeSigned
