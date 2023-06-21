// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Components
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'

// ** View Imports
import Header from 'src/views/organization/components/Header'
import OrganizationManagersAdd from 'src/views/organization/managers/OrganizationManagersAdd'

const OrganizationManagerAdd = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Header title={t('添加组织管理员')} backUrl='/organization/managers' />
      <Alert severity='info'>
        {t('只有组织现有的团队经理，才能添加为组织管理员。要邀请新的经理，请转到 “团队经理” 的页面')}
      </Alert>

      <OrganizationManagersAdd />
    </Box>
  )
}

export default OrganizationManagerAdd
