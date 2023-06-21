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
import GlobalEmployContainer from 'src/views/home/GlobalEmploy'
import Footer from 'src/views/home/Footer'
import DialogRequestDemo from 'src/views/components/dialogs/DialogRequestDemo'

const Case = () => {
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
        '.layout-page-content': { [theme.breakpoints.up('sm')]: { padding: '0' } },
        '& img': { display: 'block', maxWidth: '100%' },
        backgroundColor: '#fff'
      })}
    >
      <Tips />
      <Nav onRequestDemo={handleRequestDemo} />
      <GlobalEmployContainer onRequestDemo={handleRequestDemo} />
      <Footer onRequestDemo={handleRequestDemo} />
      <DialogRequestDemo show={showRequestDemoDialog} onClose={handleCloseRequestDemoDialog} />
    </Box>
  )
}

Case.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Case.authGuard = false
Case.guestGuard = false

export default Case
