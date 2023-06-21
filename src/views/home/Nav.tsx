import { useState, useRef } from 'react'
// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'

// ** Next Import
import Link from 'next/link'

// ** MUI Components Imports
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Hidden from '@mui/material/Hidden'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import RealMenu from '@mui/material/Menu'
import RealMenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'

// ** View Components Imports
import LanguageDropdown from 'src/views/components/language/LanguageDropdown'

// ** Page Components Imports
import Section from './components/Section'
import LogoText from 'src/components/svg/LogoText'
import LogoWithSlogan from 'src/components/svg/LogoWithSlogan'
import { common } from '@mui/material/colors'

import { Icon } from '@iconify/react'
import LogoWithI18n from '../components/logo/LogoWithI18n'
import DialogMobileNav from '../components/dialogs/DialogMobileNav'
import axios from 'axios'
import Popper from '@mui/material/Popper'
import useClickOutside from '../../@core/hooks/useClickOutside'

const Content = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '72px',
  fontSize: '14px',
  [theme.breakpoints.down('lg')]: {
    backgroundPositionX: 'center'
  },
  [theme.breakpoints.down('sm')]: {
    position: 'fixed',
    width: '100%',
    left: 0,
    paddingLeft: '1rem',
    background: 'rgb(124, 77, 255)',
    zIndex: 99
  }
}))

const Menu = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginLeft: 76,
  position: 'relative',
  zIndex: 10,
  [theme.breakpoints.down('lg')]: {
    display: 'none'
  }
}))

const MenuItem = styled(Link)(() => ({
  display: 'flex',
  marginRight: 42,
  fontSize: 14,
  color: '#fff',
  textDecoration: 'none',
  alignItems: 'center',
  cursor: 'pointer'
}))

export interface NavProps {
  onRequestDemo: (value: boolean) => void
}

const Nav = (navProps: NavProps) => {
  const { onRequestDemo } = navProps
  const { t, i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const theme = useTheme()
  const { logout } = useAuth()
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const buttonRef = useRef(null)

  const ref = useClickOutside(undefined, event => {
    if (openPopover) {
      setOpenPopover(false)
    }
  })

  const search = window.location.search || location.hash.replace('#', '')
  if (search) {
    const searchArr = search.split('&')
    const temp = searchArr.find(v => v.indexOf('language=') > 0)
    if (temp) {
      const realLanguage = temp.split('language=')[1]
      if (realLanguage !== i18n.language) {
        i18n.changeLanguage(realLanguage)
        let key = 'zh_CN'
        switch (realLanguage) {
          case 'en':
            key = 'us_EN'
            break
          case 'jp':
            key = 'ja-JP'
            break
          case 'zh_CN':
            key = 'zh_CN'
            break
          case 'zh_TW':
            key = 'zh_TW'
            break
          default:
            break
        }
        axios.defaults.headers['lng'] = key
      }
    }
  } else {
    if (location.href.indexOf('.net') > -1 && i18n.language === 'zh_CN') {
      location.href = 'https://www.telehire.net?language=zh_TW'
    }
  }

  const handleShowMobileMenu = () => {
    setShowMobileMenu(true)
  }

  const handleCloseMobileMenu = () => {
    setShowMobileMenu(false)
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const open1 = Boolean(anchorEl1)
  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick1 = (e: any) => {
    setAnchorEl1(e.currentTarget)
  }
  const handleClose1 = () => {
    setAnchorEl1(null)
  }
  const gotoLogIn = () => {
    logout()
  }

  return (
    <Section style={{ background: theme.palette.primary.main }}>
      <Content>
        <LogoWithI18n />
        <Menu sx={{ whiteSpace: 'nowrap', flex: 1, display: 'flex', justifyContent: 'space-around' }}>
          <MenuItem href='#'>
            <Typography
              sx={{ color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center' }}
              id='fade-button'
              aria-controls={open ? 'fade-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              {t('Platform')}
              <Icon icon='material-symbols:keyboard-arrow-down-rounded' />
            </Typography>
            <RealMenu
              id='fade-menu'
              MenuListProps={{
                'aria-labelledby': 'fade-button'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
              className='custom-menu-popover'
            >
              {/*<RealMenuItem onClick={handleClose}>加密货币</RealMenuItem>*/}
              <MenuItem href='/home/platform/full-time' sx={{ mx: 3 }}>
                {t('Staff.Full_time_employee')}
              </MenuItem>
              <MenuItem href='/home/platform/part-time' sx={{ mx: 3 }}>
                {t('Staff.Part_time_employee')}
              </MenuItem>
              <MenuItem href='/home/globalEmploy' sx={{ mx: 3 }}>
                {t('Career')}
              </MenuItem>
            </RealMenu>
          </MenuItem>
          <MenuItem href='/home/case'>{t('Use Cases')}</MenuItem>
          <MenuItem href='#'>
            <Typography
              sx={{ color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center' }}
              id='fade1-button'
              aria-controls={open1 ? 'fade1-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open1 ? 'true' : undefined}
              onClick={handleClick1}
            >
              {t('Why TeleHire')}
              <Icon icon='material-symbols:keyboard-arrow-down-rounded' />
            </Typography>
            <RealMenu
              id='fad1e-menu'
              MenuListProps={{
                'aria-labelledby': 'fade1-button'
              }}
              anchorEl={anchorEl1}
              open={open1}
              onClose={handleClose1}
              TransitionComponent={Fade}
              className='custom-menu-popover'
            >
              <MenuItem href='/home/chooseUs' sx={{ mx: 3 }}>
                {t('Why TeleHire')}
              </MenuItem>
              {i18n.language !== 'zh_CN' && (
                <MenuItem href='/home/platform/virtual-currency' sx={{ mx: 3 }}>
                  {t('Virtual currency')}
                </MenuItem>
              )}
            </RealMenu>
          </MenuItem>
          <MenuItem href='/home/price'>{t('Pricing')}</MenuItem>
          <MenuItem href='/home/resource'>{t('Resources')}</MenuItem>
          <Hidden smDown>
            <LanguageDropdown settings={settings} saveSettings={saveSettings}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: i18n.language === 'zh_CN' ? 2 : 10,
                  '& svg': { mr: 1.5, width: '18px', color: common.white }
                }}
              >
                <Icon icon='material-symbols:language' />
                <Typography fontSize={14} color='#fff'>
                  {t('Nav Current Language')}
                </Typography>
              </Box>
            </LanguageDropdown>
          </Hidden>
        </Menu>

        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={theme => ({
            [theme.breakpoints.down('sm')]: { position: 'fixed', right: '1rem' }
          })}
        >
          {i18n.language === 'zh_CN' && (
            <Hidden mdDown>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  mr: 6,
                  '& svg': { mr: 1.5, width: '18px', color: common.white }
                }}
              >
                <Icon icon='material-symbols:phone-in-talk-outline' />
                <Typography fontSize={14} color='#fff'>
                  400-0390-660
                </Typography>
              </Box>
            </Hidden>
          )}
          <Hidden mdDown>
            <Button
              variant='outlined'
              component={Link}
              href='/auth/login'
              sx={theme => ({
                color: '#fff',
                whiteSpace: 'nowrap',
                height: 38.8,
                background: 'rgba(255, 30, 201, 0.4)',
                transition: 'transform 0.1s ease',
                '&:hover': {
                  transform: 'scale(1.15)',
                  background: 'rgba(255, 30, 201, 0.4)',
                  'box-shadow': '3px 4px 8px rgba(130, 8, 102, 0.4)'
                },
                [theme.breakpoints.up('sm')]: { px: 7.75, py: 1, fontSize: 14, borderRadius: 5 },
                [theme.breakpoints.down('sm')]: { px: 5, py: 1, fontSize: 12, borderRadius: 4 }
              })}
            >
              {t('Enterprise Login')}
            </Button>
          </Hidden>
          <Hidden mdUp>
            <div ref={ref}>
              <IconButton
                ref={buttonRef}
                onClick={() => setOpenPopover(v => !v)}
                sx={theme => ({
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  height: 38.8,
                  background: 'rgba(255, 30, 201, 0.4)',
                  transition: 'transform 0.1s ease',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    background: 'rgba(255, 30, 201, 0.4)',
                    'box-shadow': '3px 4px 8px rgba(130, 8, 102, 0.4)'
                  },
                  ...(openPopover
                    ? {
                        transform: 'scale(1.15)',
                        background: 'rgba(255, 30, 201, 0.4)',
                        'box-shadow': '3px 4px 8px rgba(130, 8, 102, 0.4)',
                        '> svg': {
                          transform: 'rotate(180deg)'
                        }
                      }
                    : {}),
                  [theme.breakpoints.up('sm')]: {
                    paddingLeft: 6,
                    paddingRight: 5,
                    py: 1,
                    fontSize: 14,
                    borderRadius: 5
                  },
                  [theme.breakpoints.down('sm')]: {
                    paddingLeft: 5,
                    paddingRight: 4,
                    py: 1,
                    fontSize: 12,
                    borderRadius: 4
                  }
                })}
              >
                {t('LoginBtn')}
                <Icon icon='mdi:chevron-down' style={{ marginLeft: '10px', fontSize: '20px' }}></Icon>
              </IconButton>
              <Popper id='popoverLogin' open={openPopover} anchorEl={buttonRef.current}>
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, .1)',
                    borderRadius: '14px',
                    minWidth: '105px',
                    marginTop: '19px',
                    height: '80px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Button
                    component={Link}
                    href='/auth/login'
                    sx={{
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      height: '24px',
                      marginBottom: '9px',
                      '&:hover': {
                        background: 'rgba(255, 30, 201, 0.4)'
                      }
                    }}
                  >
                    {t('Enterprise Login')}
                  </Button>
                  <Button
                    component={Link}
                    href='/auth/login'
                    onClick={gotoLogIn}
                    sx={{
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      height: '24px',
                      marginBottom: '9px',
                      '&:hover': {
                        background: 'rgba(255, 30, 201, 0.4)'
                      }
                    }}
                  >
                    {t('Employee Login')}
                  </Button>
                </Box>
              </Popper>
            </div>
          </Hidden>
          <Hidden mdDown>
            <Button
              variant='outlined'
              component={Link}
              href='/auth/login'
              // onClick={onRequestDemo}
              onClick={gotoLogIn}
              sx={{
                whiteSpace: 'nowrap',
                height: 38.8,
                ml: 3,
                px: 7.75,
                py: 1,
                fontSize: 14,
                color: '#fff',
                borderRadius: 5,
                background: 'rgba(255, 30, 201, 0.4)',
                transition: 'transform 0.1s ease',
                '&:hover': {
                  transform: 'scale(1.15)',
                  background: 'rgba(255, 30, 201, 0.4)',
                  'box-shadow': '3px 4px 8px rgba(130, 8, 102, 0.4)'
                }
              }}
            >
              {t('Employee Login')}
            </Button>
          </Hidden>
          <Hidden lgUp>
            <Button
              variant='outlined'
              component={Link}
              href='#'
              onClick={handleShowMobileMenu}
              sx={theme => ({
                color: common.white,
                ml: 4
              })}
            >
              <Icon width={48} icon='ion:menu-outline' />
            </Button>
          </Hidden>
        </Box>
      </Content>

      <DialogMobileNav show={showMobileMenu} onClose={handleCloseMobileMenu} />
    </Section>
  )
}

export default Nav
