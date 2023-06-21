// ** React Imports
import { Ref, useState, forwardRef, ReactElement, Fragment, MouseEvent, ReactNode, ElementType, useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import LoadingButton from '@mui/lab/LoadingButton'
import TabContext from '@mui/lab/TabContext'
import IconButton from '@mui/material/IconButton'
import Typography, { TypographyProps } from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

import { useTranslation } from 'react-i18next'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link'
import LogoWithSlogan from '../../../components/svg/LogoWithSlogan'
import LogoText from '../../../components/svg/LogoText'
import Icon from '../../../@core/components/icon'
import { common } from '@mui/material/colors'
import LanguageDropdown from '../language/LanguageDropdown'
import { useSettings } from '../../../@core/hooks/useSettings'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

export interface DialogProps {
  show: boolean
  onClose: (value: boolean) => void
}

interface MenuItemProps {
  children: ReactNode
  linkUrl: string
  showArrow?: boolean
  onHandle?: () => void
}

const MenuItem = (props: MenuItemProps) => {
  const { children, linkUrl, showArrow = true, onHandle } = props
  return (
    <LinkStyled href={linkUrl}>
      <Box
        sx={theme => ({
          width: '100%',
          height: '70px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid #DBE8EF`,
          color: theme.palette.primary.dark
        })}
        onClick={onHandle ? onHandle : () => {}}
      >
        {children}
        {showArrow && <Icon icon='material-symbols:keyboard-arrow-right' />}
      </Box>
    </LinkStyled>
  )
}

const LanguageOptions = [
  {
    key: 'zh_CN',
    text: '中文-简体'
  },
  {
    key: 'zh_TW',
    text: '中文-繁体'
  },
  {
    key: 'en',
    text: 'English'
  },
  {
    key: 'jp',
    text: '日本語'
  }
]

const platformList = [
  {
    key: '/platform/full-time',
    text: 'Staff.Full_time_employee'
  },
  {
    key: '/platform/part-time',
    text: 'Staff.Part_time_employee'
  },
  {
    key: '/globalEmploy',
    text: 'Career'
  }

]

const chooseUsList = [
  {
    key: '/home/chooseUs',
    text: 'Why TeleHire',
  },
  {
    key: '/home/platform/virtual-currency',
    text: 'Virtual currency',
    except: 'zh_CN'
  }
]

const ShowPlatformSelect = (props: { onClose: () => void }) => {
  const { onClose } = props
  const { i18n, t } = useTranslation()
  const theme = useTheme()

  const onSelect = (key: string) => {
    onClose()
  }
  return (
    <Box sx={{ mx: 2 }}>
      <Box
        sx={theme => ({
          width: '100%',
          height: '50px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          cursor: 'pointer',
          color: theme.palette.secondary.dark
        })}
        onClick={onClose}
      >
        <Icon icon='material-symbols:arrow-back-rounded' />
        <Typography color={theme.palette.secondary.dark} fontSize={14} sx={{ ml: 4 }}>
          {t('Platform')}
        </Typography>
      </Box>
      {
        platformList.filter((v: any) => v.except !== i18n.language).map(item => (
          <MenuItem linkUrl={`/home/${item.key}`} key={item.key}>{t(`${item.text}`)}</MenuItem>
        ))
      }
    </Box>
  )
}
const ShowChooseUsSelect = (props: { onClose: () => void }) => {
  const { onClose } = props
  const { i18n, t } = useTranslation()
  const theme = useTheme()

  const onSelect = (key: string) => {
    onClose()
  }
  return (
    <Box sx={{ mx: 2 }}>
      <Box
        sx={theme => ({
          width: '100%',
          height: '50px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          cursor: 'pointer',
          color: theme.palette.secondary.dark
        })}
        onClick={onClose}
      >
        <Icon icon='material-symbols:arrow-back-rounded' />
        <Typography color={theme.palette.secondary.dark} fontSize={14} sx={{ ml: 4 }}>
          {t('Platform')}
        </Typography>
      </Box>
      {
        chooseUsList.filter(v => v.except !== i18n.language).map(item => (
          <MenuItem linkUrl={item.key} key={item.key}>{t(`${item.text}`)}</MenuItem>
        ))
      }
    </Box>
  )
}

const ShowLanguageSelect = (props: { onClose: () => void }) => {
  const { onClose } = props
  const { i18n, t } = useTranslation()
  const theme = useTheme()

  const onSelect = (key: string) => {
    // if(key === 'zh_CN') {
    //   location.href = `https://www.telehire.cn?language=${key}`
    // } else {
    //   location.href = `https://www.telehire.net?language=${key}`
    // }
    location.search = `language=${key}`

    // i18n.changeLanguage(key)
    // if(!location.search) {
    //   location.href = location.href + `?language=${key}`
    // } else {
    //   const search = location.search
    //   const searchArr = search.split('&');
    //   const tempIndex = searchArr.findIndex(v => v.indexOf('language=')>0);
    //   if(tempIndex !== -1) {
    //     if(tempIndex === 0) {
    //       searchArr.splice(tempIndex, 1, `/?language=${key}`)
    //     }else {
    //       searchArr.splice(tempIndex, 1, `language=${key}`)
    //     }
    //     location.href = location.origin + searchArr.join('&')
    //   } else {
    //     location.href = location.href + `&language=${key}`
    //   }
    // }
    onClose()
  }
  return (
    <Box sx={{ mx: 2 }}>
      <Box
        sx={theme => ({
          width: '100%',
          height: '50px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          cursor: 'pointer',
          color: theme.palette.secondary.dark
        })}
        onClick={onClose}
      >
        <Icon icon='material-symbols:arrow-back-rounded' />
        <Typography color={theme.palette.secondary.dark} fontSize={14} sx={{ ml: 4 }}>
          {t('Change Language')}
        </Typography>
      </Box>
      {
        LanguageOptions.map(item => (
          <Box
            sx={theme => ({
              width: '100%',
              height: '70px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid #DBE8EF`,
              cursor: 'pointer',
              color: theme.palette.primary.dark
            })}
            onClick={() => onSelect(item.key)}
          >
            {item.text}
          </Box>
        ))
      }
    </Box>
  )
}

const DialogMobileNav = (dialogProps: DialogProps) => {
  const { show, onClose } = dialogProps
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { settings, saveSettings } = useSettings()
  const [showDialogLanguageSelect, setDialogLanguageSelect] = useState(false);
  const [showPlatformSelect, setShowPlatformSelect] = useState(false);
  const [showChooseUsSelect, setShowChooseUsSelect] = useState(false);
  const handleClose = () => {
    onClose(false)
  }

  const showHome = useMemo(() => !showDialogLanguageSelect && !showPlatformSelect && !showChooseUsSelect, [showDialogLanguageSelect, showPlatformSelect, showChooseUsSelect])
  return (
    <Card>
      <Dialog
        fullWidth
        sx={{
          '.MuiDialog-container': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          },
          '.MuiPaper-root': {
            minHeight: '76%',
            margin: '0!important',
            width: '100%!important',
            maxWidth: '100%!important',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32
          },
          '.MuiPaper-root:not(.MuiDialog-paperFullScreen)': {
            maxWidth: '100%!important'
          }
        }}
        open={show}
        scroll='body'
        maxWidth='md'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            p: 6
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                ' svg': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <LinkStyled
                href='/'
                sx={{
                  '& svg': {
                    width: 160
                  }
                }}
              >
                {i18n.language.startsWith('zh_') ? <LogoWithSlogan /> : <LogoText />}
              </LinkStyled>
            </Box>

            <IconButton size='small' onClick={handleClose}>
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>

          <Box sx={{ mx: 2, display: showHome ? 'block' : 'none' }}>
            <MenuItem linkUrl={'javascript:void(0);'} onHandle={() => {  setShowPlatformSelect(true) }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  mr: 6,
                  '& svg': { mr: 1.5, width: '18px', color: theme.palette.primary.dark }
                }}
              >
                <Typography color={theme.palette.primary.dark} fontSize={14}>
                  {t('Platform')}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem linkUrl={'/home/case'}>{t('Use Cases')}</MenuItem>
            {
              i18n.language !== 'zh_CN' && <MenuItem linkUrl={'javascript:void(0);'} onHandle={() => {  setShowChooseUsSelect(true) }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    mr: 6,
                    '& svg': { mr: 1.5, width: '18px', color: theme.palette.primary.dark }
                  }}
                >
                  <Typography color={theme.palette.primary.dark} fontSize={14}>
                    {t('Why TeleHire')}
                  </Typography>
                </Box>
              </MenuItem>
            }
            {
              i18n.language === 'zh_CN' && <MenuItem linkUrl={'/home/chooseUs'}>{t('Why TeleHire')}</MenuItem>
            }
            <MenuItem linkUrl={'/home/price'}>{t('Pricing')}</MenuItem>
            <MenuItem linkUrl={'/home/resource'}>{t('Resources')}</MenuItem>
            {
              i18n.language === 'zh_CN' && <MenuItem linkUrl={'javascript:void(0);'} showArrow={false}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    mr: 6,
                    '& svg': { mr: 1.5, width: '18px', color: theme.palette.primary.dark }
                  }}
                >
                  <Icon icon='material-symbols:phone-in-talk-outline' />
                  <Typography color={theme.palette.primary.dark} fontSize={14}>
                    400-0390-660
                  </Typography>
                </Box>
              </MenuItem>
            }
            <MenuItem linkUrl={'javascript:void(0);'} onHandle={() => {  setDialogLanguageSelect(true) }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  mr: 6,
                  '& svg': { mr: 1.5, width: '18px', color: theme.palette.primary.dark }
                }}
              >
                <Icon icon='material-symbols:language' />
                <Typography color={theme.palette.primary.dark} fontSize={14}>
                  {t('Nav Current Language')}
                </Typography>
              </Box>
            </MenuItem>
          </Box>
          {
            showDialogLanguageSelect && <ShowLanguageSelect onClose={() => setDialogLanguageSelect(false)}/>
          }
          {
            showPlatformSelect && <ShowPlatformSelect onClose={() => setShowPlatformSelect(false)}/>
          }
          {
            showChooseUsSelect && <ShowChooseUsSelect onClose={() => setShowChooseUsSelect(false)}/>
          }
        </DialogContent>

      </Dialog>

    </Card>
  )
}

export default DialogMobileNav
