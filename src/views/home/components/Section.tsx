// ** React Imports
import { ReactNode, CSSProperties } from 'react'

// ** MUI Components Imports
import { Theme, SxProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

const MainContentWrapper = styled(Box)<BoxProps>({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  minWidth: 0
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

interface Props {
  sx?: SxProps<Theme> & { background?: string; sm?: SxProps<Theme>; xs?: SxProps<Theme> }
  style?: CSSProperties
  children: ReactNode
}

const Section = ({ sx, style, children }: Props) => {
  const { sm = {}, xs = {}, background = '#fff', ...restSx } = sx || {}

  return (
    <MainContentWrapper
      className='layout-content-wrapper'
      style={style}
      sx={theme => ({
        [theme.breakpoints.up('sm')]: { background, ...sm },
        [theme.breakpoints.down('sm')]: { background, ...xs },
        ...restSx
      })}
    >
      <ContentWrapper
        className='layout-page-content'
        sx={{
          mx: 'auto',
          '@media (min-width:1280px)': { maxWidth: 1280 },
          '@media (min-width:1200px)': { maxWidth: '100%' }
        }}
      >
        {children}
      </ContentWrapper>
    </MainContentWrapper>
  )
}

export default Section
