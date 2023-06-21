import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import axios from 'axios'
import { GET_CURRENT_USER_ORG_LIST } from '../../apis'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { setOrgId, setOrgName } from '../../store/apps/org'
import { ListItemAvatar } from '@mui/material'

interface Organization {
  contact: string
  controllerId: string
  creator: string
  email: string
  founderId: string
  gmtCreate: number
  gmtModified: number
  id: number
  kycStatus: number
  modifier: string
  orgId: string
  orgName: string
  orgSite: string
  role: string
  status: number
}
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    marginLeft: '30px!important',
    marginTop: '55px !important'
  }
}))

// const BadgeContentSpan = styled('span')(({ theme }) => ({
//   width: 8,
//   height: 8,
//   borderRadius: '50%',
//   backgroundColor: theme.palette.success.main,
//   boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
// }))

const Organization = () => {
  const { t } = useTranslation()

  const dispatch = useDispatch<AppDispatch>()
  const [selectedIndex, setSelectedIndex] = useState(1)
  const [orgList, setOrgList] = useState<Organization[]>([])
  const { orgName, orgId } = useSelector((state: RootState) => state.org)

  // 切换组织
  const handleListItemClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    org: { orgId: string; orgName: string }
  ) => {
    setSelectedIndex(index)
    await dispatch(setOrgId(org.orgId))
    await dispatch(setOrgName(org.orgName))
  }

  const fetchOrgList = () => {
    axios.get(GET_CURRENT_USER_ORG_LIST, {}).then(async res => {
      if (res.data.code === 'SUCCESS') {
        setOrgList(res.data?.data || [])
      }
    })
  }

  useEffect(() => {
    fetchOrgList()
  }, [])

  useEffect(() => {
    const index = orgList?.findIndex(org => org.orgId === orgId)
    if (index !== -1) setSelectedIndex(index)
  }, [orgList, orgName])

  return (
    <Box
      sx={{
        py: 2,
        pl: 1.375,
        mb: 2.5,
        ml: '18px',
        mr: '1.125rem',
        border: '1px solid rgba(58, 53, 65, 0.12)',
        borderRadius: '8px',
        height: '68px'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          >
            <Avatar src='/images/organization/nologo.png' alt='John Doe' sx={{ width: '2.5rem', height: '2.5rem' }} />
          </Badge>
          <Box sx={{ ml: 3, display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#3A354161' }}>{t('组织名称')}</Typography>
            <Typography variant='body2' sx={{ fontSize: '14px', fontWeight: 500, color: '#3A3541DE' }}>
              {orgName}
            </Typography>
          </Box>
        </Box>
        <LightTooltip
          placement='right'
          title={
            <Box sx={{ py: 3, px: 2 }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#3A354161' }}>{t('组织名称')}</Typography>
              <List component='nav' aria-label='main mailbox folders' sx={{ width: 260 }}>
                {orgList?.map((org, index) => (
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={event => handleListItemClick(event, index, org)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src='/images/organization/nologo.png'
                        alt='John Doe'
                        sx={{ width: '2.5rem', height: '2.5rem' }}
                      />
                    </ListItemAvatar>
                    <ListItemText primary={org.orgName}></ListItemText>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          }
        >
          <Box sx={{ pr: 3, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Icon icon='mdi:more-vert'></Icon>
          </Box>
        </LightTooltip>
      </Box>
    </Box>
  )
}

export default Organization
