// ** React Imports
import { ReactNode } from 'react'

// ** MUI Components Imports
import { Theme, SxProps } from '@mui/material'
import Typography, { TypographyProps } from '@mui/material/Typography'

interface Props extends TypographyProps {
  sx?: SxProps<Theme> & { sm?: SxProps<Theme>; xs?: SxProps<Theme> }
  children: ReactNode
}

const Paragraph = ({ sx, children, ...restProps }: Props) => {
  const { sm, xs, ...restSx } = sx || {}

  return (
    <Typography
      {...restProps}
      sx={theme => ({
        [theme.breakpoints.up('sm')]: { fontSize: 14, fontWeight: 400, lineHeight: '200%', mt: 6, ...sm },
        [theme.breakpoints.down('sm')]: { fontSize: 11, fontWeight: 400, lineHeight: '200%', mt: 3, mb: 6, ...xs },
        ...restSx
      })}
    >
      {children}
    </Typography>
  )
}

export default Paragraph
