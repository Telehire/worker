// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const ButtonStyled = styled(Button)<{ light?: boolean }>(({ light, theme }) => ({
  marginTop: 24,
  borderRadius: 24,
  color: theme.palette.primary.main,
  background: light ? '#f1f0ff' : '#d9d7fe',
  borderColor: 'transparent',
  boxShadow: 'none'
}))

export default ButtonStyled
