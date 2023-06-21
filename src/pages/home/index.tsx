// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Components
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** View Imports
import Tips from 'src/views/home/Tips'
import Nav from 'src/views/home/Nav'
import Banner from 'src/views/home/Banner'
import Feature from 'src/views/home/Feature'
import HRService from 'src/views/home/HRService'
import HRPlan from 'src/views/home/HRPlan'
import HRIntroduction from 'src/views/home/HRIntroduction'
import HRTool from 'src/views/home/HRTool'
import Law from 'src/views/home/Law'
import Partner from 'src/views/home/Partner'
import Subscribe from 'src/views/home/Subscribe'
import FooterBanner from 'src/views/home/FooterBanner'
import Footer from 'src/views/home/Footer'
import DialogRequestDemo from 'src/views/components/dialogs/DialogRequestDemo'

const Home = () => {
  const [showRequestDemoDialog, setShowRequestDemoDialog] = useState(false)

  const handleCloseRequestDemoDialog = (show: boolean | ((prevState: boolean) => boolean)) => {
    setShowRequestDemoDialog(show)
  }

  const handleRequestDemo = () => {
    setShowRequestDemoDialog(true)
  }
  console.log('v1.0')

  return (
    <Box
      sx={theme => ({
        '.layout-page-content': { [theme.breakpoints.up('sm')]: { padding: '0 48px' } },
        '& img': { display: 'block', maxWidth: '100%' }
      })}
    >
      <Tips />
      <Nav onRequestDemo={handleRequestDemo} />
      <Banner onRequestDemo={handleRequestDemo} />
      <Feature onRequestDemo={handleRequestDemo} />
      <HRService onRequestDemo={handleRequestDemo} />
      <HRPlan onRequestDemo={handleRequestDemo} />
      <HRIntroduction onRequestDemo={handleRequestDemo} />
      <HRTool onRequestDemo={handleRequestDemo} />
      <Law onRequestDemo={handleRequestDemo} />
      <Partner onRequestDemo={handleRequestDemo} />
      <Subscribe onRequestDemo={handleRequestDemo} />
      <FooterBanner onRequestDemo={handleRequestDemo} />
      <Footer onRequestDemo={handleRequestDemo} />
      <DialogRequestDemo show={showRequestDemoDialog} onClose={handleCloseRequestDemoDialog} />
    </Box>
  )
}

Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Home.authGuard = false
Home.guestGuard = false

export default Home
