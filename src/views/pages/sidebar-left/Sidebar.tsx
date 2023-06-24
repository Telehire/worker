// ** I18n Imports
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { common } from '@mui/material/colors'
import { SxProps, Theme } from '@mui/material'
import Hidden from '@mui/material/Hidden'
import LogoWithSlogan from 'src/components/svg/LogoWithSlogan'
import LogoText from 'src/components/svg/LogoText'
import Link from 'next/link'

// ** Styled Components
const RegisterIllustration = styled('div')(({ theme }) => ({
  width: '360px',
  textAlign: 'left',
  display: 'flex',
  padding: '24px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const RegisterIllustrationImg = styled('img')(({ theme }) => ({
  width: 'calc(100% + 48px)',
  marginBottom: 250,
  // 274 = 250 + 父元素 padding 24，贴到底边
  transform: 'translate(-24px, 274px)'
}))

const TypographyStyled2 = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '1.3rem',
  fontWeight: 600,
  textAlign: 'left',
  color: common.white,
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 400,
  textAlign: 'left',
  color: common.white,
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

export interface SidebarProps {
  title?: string
  hidden?: boolean
  hiddenExceptLogo?: boolean
  hiddenSlogan?: boolean
  sx?: SxProps<Theme> & { background?: string; sm?: SxProps<Theme>; xs?: SxProps<Theme> }
}

const Sidebar = (sidebarProps: SidebarProps) => {
  const { title, sx, hiddenSlogan, hidden, hiddenExceptLogo } = sidebarProps
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const imageSource = 'register-illustration'

  if (!hidden) {
    return (

      // @ts-ignore
      <RegisterIllustration
        {...sx}
        sx={{
          backgroundColor: sx?.background ?? theme.palette.primary.dark
        }}
        className={'register-sidebar'}
      >
        <Box
          sx={{
            ' svg': {
              color: common.white
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
        {!hiddenSlogan && (
          <Box>
            <TypographyStyled2>{title ?? t('Register.Welcome_to_register')}</TypographyStyled2>
            <TypographyStyled>{t('Register.Ad_full_text')}</TypographyStyled>
          </Box>
        )}
        <RegisterIllustrationImg
          alt='register-illustration'
          src={`/images/register/${imageSource}-${theme.palette.mode}.png`}
        />
      </RegisterIllustration>
    )
  } else {
    if (hiddenExceptLogo) {
      return (
        <Box
          sx={{
            position: 'absolute',
            left: '2.5rem',
            top: '1rem',
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
      )
    }
  }
  return <></>
}

export default Sidebar
