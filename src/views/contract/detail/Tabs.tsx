// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Imports
import axios from 'axios'
import { useTranslation } from 'react-i18next'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'

enum TabsType {
  Overview,
  Detail,
  Equipment,
  Work,
  Stocks,
  Other
}

const TabMap = {
  [TabsType.Overview]: { label: '概况', children: null },
  [TabsType.Detail]: { label: '合同详情', children: null },
  [TabsType.Equipment]: { label: '设备', children: null },
  [TabsType.Work]: { label: '联合办公', children: null },
  [TabsType.Stocks]: { label: '股票期权', children: null },
  [TabsType.Other]: { label: '股票期权', children: null }
}

const DetailTab = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [tabKey, setTabKey] = useState<TabsType>(TabsType.Overview)

  return (
    <Tabs value={tabKey} onChange={(e, val) => setTabKey(val)}>
      {Object.keys(TabMap).map(item => (

        //@ts-ignore
        <Tab value={item} label={TabMap[item].label} />
      ))}
    </Tabs>
  )
}

export default DetailTab
