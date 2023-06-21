// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** View Imports
import Header from 'src/views/organization/components/Header'
import Tabs from 'src/views/organization/components/Tabs'
import Basic from 'src/views/organization/basic'

const BasicSetting = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Header title={t('基本设置')} />
      <Tabs current='basic' />
      <Basic />
    </Box>
  )
}

export default BasicSetting
