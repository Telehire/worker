// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, SetStateAction, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

interface Team {
  id: number
  name: string
}

const organization = {
  name: '杭州钉学'
}

const teamList: Team[] = [
  {
    id: 1,
    name: '团队名称1'
  },
  {
    id: 2,
    name: '团队名称2'
  },
  {
    id: 3,
    name: '团队名称3'
  },
  {
    id: 4,
    name: '团队名称4'
  },
  {
    id: 5,
    name: '团队名称5'
  },
  {
    id: 6,
    name: '团队名称6'
  },
  {
    id: 7,
    name: '团队名称7'
  },
  {
    id: 8,
    name: '团队名称8'
  },
  {
    id: 9,
    name: '团队名称9'
  },
  {
    id: 10,
    name: '团队名称10'
  }
]

interface Props {
  setValues: Dispatch<SetStateAction<Record<string, any>>>
  setStep: Dispatch<SetStateAction<number>>
}

const Step2 = ({ setValues, setStep }: Props) => {
  const { t } = useTranslation()
  const [teams, setTeams] = useState<Team[]>([])

  const toggleAll = () => {
    setTeams(teams.length === teamList.length ? [] : teamList)
  }

  const toggleSelected = (id: number) => {
    let newSelected = []
    if (teams.some(item => item.id === id)) {
      newSelected = teams.filter(item => item.id !== id)
    } else {
      newSelected = teams.concat(teamList.filter(item => item.id === id)[0])
    }
    setTeams(newSelected)
  }

  const onOk = () => {
    setValues(prev => ({
      ...prev,
      teams
    }))
    setStep(prev => prev + 1)
  }

  const onCancel = () => {
    setStep(prev => prev - 1)
  }

  return (
    <Card>
      <CardHeader title={t('分配团队')} />

      <CardContent>
        <Alert severity='info'>
          {t('将经理分配给团队，赋予他们特定的角色和权限。没有团队的经理将无法访问组织中的团队。团队可以随时分配。')}
        </Alert>

        <Stack
          direction='row'
          alignItems='center'
          onClick={() => toggleAll()}
          sx={{ height: 68, mt: 4, mb: 2, pl: 1, background: '#F9FBFF', borderRadius: 1, cursor: 'pointer' }}
        >
          <Checkbox size='small' checked={teams.length === teamList.length} />
          <Box>
            <Typography noWrap variant='subtitle1' color='#303133'>
              {t('组织：')}
              {organization.name}
            </Typography>
            <Typography noWrap variant='subtitle2' sx={{ color: 'text.light' }}>
              {teams.length}/{teamList.length} {t('个团队被选中')}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ height: 'calc(100vh - 470px)', overflow: 'auto', mb: 3 }}>
          {teamList.map(item => (
            <Stack
              direction='row'
              alignItems='center'
              onClick={() => toggleSelected(item.id)}
              sx={{ height: 68, mt: 2, pl: 1, background: '#F9FBFF', borderRadius: 1, cursor: 'pointer' }}
            >
              <Checkbox size='small' checked={teams.some(teamItem => teamItem.id === item.id)} />
              <CustomAvatar src={`/images/avatars/${item.id}`} sx={{ ml: 2, mr: 2, width: '2rem', height: '2rem' }} />
              <Typography noWrap variant='subtitle2' color='#303133'>
                {item.name}
              </Typography>
            </Stack>
          ))}
        </Box>

        <Grid item xs={12}>
          <Grid container justifyContent='flex-end'>
            <Button size='large' variant='outlined' onClick={onCancel}>
              {t('上一步')}
            </Button>

            <Button size='large' variant='contained' onClick={onOk} sx={{ ml: 3 }}>
              {t('继续')}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Step2
