// ** React Imports
import { useState } from 'react'

// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'

// ** View Imports
import Header from 'src/views/organization/components/Header'
import Tabs from 'src/views/organization/components/Tabs'
import OrganizationManagers from 'src/views/organization/managers/OrganizationManagers'
import TeamManagers from 'src/views/organization/managers/TeamManagers'

const Managers = () => {
  const { t } = useTranslation()
  const [current, setCurrent] = useState<string>('1')

  const handleChange = (event: any, newCurrent: string) => {
    setCurrent(newCurrent)
  }

  return (
    <Box>
      <Header title={t('权限配置')} />
      <Tabs current='managers' />

      <Card sx={{ width: '100%', my: 5 }}>
        <CardContent sx={{ py: 3 }}>
          <TabContext value={current}>
            <TabList onChange={handleChange} aria-label='simple tabs example'>
              <Tab value='1' label={t('组织管理员')} sx={{ mr: 10 }} />
              <Tab value='2' label={t('团队经理')} />
            </TabList>

            <TabPanel value='1' sx={{ px: 0 }}>
              <OrganizationManagers />
            </TabPanel>

            <TabPanel value='2' sx={{ px: 0 }}>
              <TeamManagers />
            </TabPanel>
          </TabContext>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Managers
