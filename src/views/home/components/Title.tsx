// ** React Imports
import { ReactNode } from 'react'

// ** MUI Components Imports
import { Theme, SxProps } from '@mui/material'
import Typography, { TypographyProps } from '@mui/material/Typography'

interface Props extends TypographyProps {
  sx?: SxProps<Theme> & { sm?: SxProps<Theme>; xs?: SxProps<Theme> }
  children: ReactNode
}

const Title = ({ sx, children, ...restProps }: Props) => {
  const { sm, xs, ...restSx } = sx || {}

  return (
    <Typography
      color='primary.dark'
      {...restProps}
      sx={theme => ({
        [theme.breakpoints.up('sm')]: { fontSize: 32, fontWeight: 600, lineHeight: '140%', ...sm },
        [theme.breakpoints.down('sm')]: { fontSize: 22, fontWeight: 600, lineHeight: '140%', ...xs },
        ...restSx
      })}
    >
      {children}
    </Typography>
  )
}

export default Title
