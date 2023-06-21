// ** Next Import
import NextLink from 'next/link'

// ** MUI Imports
import { styled } from '@mui/material/styles'

const Link = styled(NextLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

export default Link
