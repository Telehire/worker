// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Link from 'next/link'
import Typography from '@mui/material/Typography'

// ** Page Components Imports
import Section from './components/Section'
import { Hidden, useTheme } from '@mui/material'
import LogoWithSlogan from '../../components/svg/LogoWithSlogan'
import { common } from '@mui/material/colors'
import LogoText from '../../components/svg/LogoText'
import LogoWithI18n from '../components/logo/LogoWithI18n'
import {styled} from "@mui/material/styles";

const MenuItem = styled(Link)(() => ({
  display: 'flex',
  marginRight: 42,
  fontSize: 14,
  color: '#fff',
  textDecoration: 'none',
  cursor: 'pointer'
}))

export interface FooterProps {
  onRequestDemo: (value: boolean) => void
}

const Footer = (footerProps: FooterProps) => {
  const { onRequestDemo } = footerProps
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const socialList = [
    {
      icon: '/images/home/social1.png',
      url: ''
    },
    {
      icon: '/images/home/social2.png',
      url: t('Facebook'),
    },
    {
      icon: '/images/home/social3.png',
      url: ''
    },
    {
      icon: '/images/home/social4.png',
      url: ''
    }
  ]

  const fastLinkList = [
    {
      title: t('About Us'),
      url: '/home/aboutUs'
    },
    {
      title: t('News & Media'),
      url: ''
    },
    {
      title: t('Career'),
      url: '/home/globalEmploy'
    },
    {
      title: t('Contacts'),
      url: '',
      onClick: onRequestDemo
    }
  ]

  const otherList = [
    {
      title: t('Sitemap'),
      url: ''
    },
    {
      title: t('Editorial Info'),
      url: ''
    },
    {
      title: t('Privacy Policy'),
      url: ''
    },
    {
      title: t('Terms & Conditions'),
      url: ''
    }
  ]

  const toBeiAnNet = () => {
    window.open('https://beian.miit.gov.cn/')
  }

  return (
    <Section sx={{ background: theme.palette.primary.main }}>
      <Box
        sx={theme => ({
          [theme.breakpoints.up('sm')]: { display: 'flex', justifyContent: 'space-between', mt: 10, mb: 12 },
          [theme.breakpoints.down('sm')]: { mt: 9, mb: 5 }
        })}
      >
        <Stack justifyContent='flex-start' alignItems='flex-start' mr={8}>
          <LogoWithI18n />

          <Box mt={{ sm: 6, xs: 4 }} mb={8}>
            {socialList.map(item => (
              <Link href={item.url}>
                <Box
                  component='img'
                  src={item.icon}
                  sx={theme => ({
                    [theme.breakpoints.up('sm')]: { width: 48, mr: 8 },
                    [theme.breakpoints.down('sm')]: { width: 36, mr: 4 }
                  })}
                  style={{ display: 'inline-block' }}
                />
              </Link>
            ))}
          </Box>

          <Hidden smDown>
            <Typography variant='body2' color='#D9D7FE' fontSize={14} lineHeight='1.4' onClick={() => {toBeiAnNet()}} style={{cursor: 'pointer'}}>
              {t('Copyright © 2022 HangZhou LeTan Technology Co., Ltd')}
            </Typography>
          </Hidden>
        </Stack>

        <Stack flexDirection='row' flexWrap='wrap' justifyContent='flex-start' alignItems='flex-start'>
          <Box mr={{ sm: 10, xs: i18n.language === 'en' ? 4 : 10 }} ml={2}>
            <Typography variant='subtitle1' color='#fff' mb={3}>
              {t('Quick Links')}
            </Typography>
            <Stack>
              <ul style={{paddingLeft: 20, color: '#fff', margin: 0}}>
                {fastLinkList.map(item => (
                  <li style={{marginBottom: 8}}>
                    {
                      !item.onClick && (
                        <MenuItem href={item.url} color='#D9D7FE'>
                          {item.title}
                        </MenuItem>
                      )
                    }
                    {
                      item.onClick && (
                        <MenuItem href="javascript:void(0);" color='#D9D7FE' onClick={item.onClick}>
                          {item.title}
                        </MenuItem>
                      )
                    }
                  </li>
                ))}
              </ul>
            </Stack>
          </Box>

          <Box mr={{ sm: 10, xs: i18n.language === 'en' ? 4 : 10 }} mb={4} flexWrap={'nowrap'}>
            <Typography variant='subtitle1' color='#fff' mb={3}>
              {t('Other')}
            </Typography>
            <Stack>
              <ul style={{paddingLeft: 20, color: '#fff', margin: 0}}>
                {otherList.map(item => (
                  <li style={{marginBottom: 8}}>
                    <MenuItem href={item.url} color='#D9D7FE'>
                      {item.title}
                    </MenuItem>
                  </li>
                ))}
              </ul>
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}
          >
            <Box mb={2} mr={4}>
              <Box component='img' src='/images/home/linkin-qrcode.png' width={100} mb={2} />
              <Typography variant='body2' color='#fff' fontSize={12} lineHeight='1.4'>
                {t('Follow our LinkedIn')}
              </Typography>
            </Box>
            <Box mb={2} mr={4}>
              <Box component='img' src='/images/home/tiktok-qrcode.png' width={100} mb={2} />
              <Typography variant='body2' color='#fff' fontSize={12} lineHeight='1.4'>
                {t('Follow our Tiktok')}
              </Typography>
            </Box>
            <Box mb={2} mr={4}>
              <Box component='img' src='/images/home/wechat-qrcode.png' width={100} mb={2} />
              <Typography variant='body2' color='#fff' fontSize={12} lineHeight='1.4'>
                {t('Follow our WeChat')}
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Hidden smUp>
          <Typography
            sx={{
              mt: 5,
              pt: 4,
              fontSize: 14,
              color: '#D9D7FE',
              textAlign: 'center',
              borderColor: '#D9D7FE',
              cursor: 'pointer'
            }}
            onClick={() => {toBeiAnNet()}}
          >
            {t('Copyright © 2022 HangZhou LeTan Technology Co., Ltd')}
          </Typography>
        </Hidden>
      </Box>
    </Section>
  )
}

export default Footer
