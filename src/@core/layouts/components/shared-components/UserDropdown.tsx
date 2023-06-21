// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect, useLayoutEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { Hidden } from '@mui/material'
import LanguageDropdown from './LanguageDropdown'
import { useTranslation } from 'react-i18next'
import { getUserData } from '@/services/user'
import { UserData } from '@/types/biz/user'
import user from '../../../../store/apps/user'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings, saveSettings } = props
  const { t, i18n } = useTranslation()

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [lngAnchorEl, setLngAnchorEl] = useState<any>(null)
  const [userData, setUserData] = useState<UserData | null>()

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  useEffect(() => {
    ;(async () => {
      const userData = await getUserData()
      setUserData(userData)
    })()
  }, [])

  useEffect(() => {
    if (!anchorEl) {
      setLngAnchorEl(null)
    }
  }, [anchorEl])

  const handleLanguageDropdownOpen = (event: SyntheticEvent) => {
    setLngAnchorEl(event.currentTarget as HTMLElement)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Box onClick={handleDropdownOpen} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Badge
          overlap='circular'
          sx={{ ml: 2, cursor: 'pointer' }}
          badgeContent={<BadgeContentSpan />}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <Avatar
            alt='John Doe'
            sx={{ width: 36, height: 36, ml: 2 }}
            src={userData?.accountIcon || '/images/avatars/1.png'}
          />
        </Badge>
        <Hidden smDown>
          <Typography sx={{ ml: 2, mr: 0.5, fontSize: 12, color: '#303133' }}>{userData?.nickname}</Typography>
          <Icon icon='mdi:chevron-down' fontSize={18} color='#909399' />
        </Hidden>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar
                alt={userData?.nickname}
                src={userData?.accountIcon || '/images/avatars/1.png'}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{userData?.nickname}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {t('管理员')}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/faq')}>
          <Box sx={styles}>
            <Icon icon='mdi:help-circle-outline' />
            {t('帮助中心')}
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/user-profile/profile')}>
          <Box sx={styles}>
            <Icon icon='ph:book-open' />
            {t('新手引导')}
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/email')}>
          <Box sx={styles}>
            <Icon icon='ri:customer-service-line' />
            {t('在线客服')}
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/chat')}>
          <Box sx={styles}>
            <Icon icon='mdi:message-outline' />
            {t('意见反馈')}
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/account-settings/account')}>
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            {t('账号设置')}
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={handleLanguageDropdownOpen}>
          <Box
            sx={{
              ...styles,
              button: {
                padding: 0,
                mr: 0
              }
            }}
          >
            <LanguageDropdown
              closeUserDropdown={handleDropdownClose}
              lngAnchorEl={lngAnchorEl}
              settings={settings}
              saveSettings={saveSettings}
            />
            {t('切换语言')}
            <Box sx={{ position: 'absolute', right: '1rem' }}>
              <Icon width={12} icon='material-symbols:arrow-forward-ios-rounded' />
            </Box>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          {t('退出')}
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
