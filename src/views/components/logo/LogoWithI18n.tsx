// ** React Imports
import { Fragment } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Box from '@mui/material/Box'
import LogoWithSlogan from '../../../components/svg/LogoWithSlogan'
import { common } from '@mui/material/colors'
import LogoText from '../../../components/svg/LogoText'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const LogoWithI18n = ({ color }: any) => {
  const { t, i18n } = useTranslation()
  return (
    <Fragment>
      <Link href='/'>
        <Box>
          {i18n.language.startsWith('zh_') ? (
            <LogoWithSlogan color={color ?? common.white} />
          ) : (
            <LogoText width={140} color={color ?? common.white} />
          )}
        </Box>
      </Link>
    </Fragment>
  )
}

export default LogoWithI18n
