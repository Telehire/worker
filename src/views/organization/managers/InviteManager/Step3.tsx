// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, SetStateAction, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio'
import Switch from '@mui/material/Switch'

interface Props {
  setValues: Dispatch<SetStateAction<Record<string, any>>>
  setStep: Dispatch<SetStateAction<number>>
}

interface Role {
  id: number
  type: string
  name: string
  description: string
}

const Step3 = ({ setValues, setStep }: Props) => {
  const { t } = useTranslation()
  const [role, setRole] = useState('')
  const [canApprove, setCanApprove] = useState(false)
  const [canControl, setCanControl] = useState(false)

  const roleList: Role[] = [
    {
      id: 1,
      type: 'teamManager',
      name: t('团队管理者'),
      description: t('此角色包括访问所有团队设置，包括添加和删除用户、修改集成、设置默认付款方式和执行付款。')
    },
    {
      id: 2,
      type: 'teamController',
      name: t('团队控制者'),
      description: t('适用于帮助入职、调整付款和执行付款的团队成员。')
    },
    {
      id: 3,
      type: 'teamHR',
      name: t('团队人事经理'),
      description: t('适用于定期帮助用户创建合同和入职但不需要调整付款或执行付款的会员。')
    }
  ]

  const onOk = () => {
    setValues(prev => ({
      ...prev,
      teams: (prev.teams || []).map((item: any) => ({
        ...item,
        role,
        roleName: roleList.filter(roleItem => roleItem.type === role)[0]?.name,
        canApprove,
        canControl
      }))
    }))
    setStep(prev => prev + 1)
  }

  const onCancel = () => {
    setStep(prev => prev - 1)
  }

  return (
    <Card>
      <CardHeader title={t('选择角色')} />

      <CardContent>
        <Box>
          {roleList.map(item => (
            <Stack
              direction='row'
              alignItems='center'
              onClick={() => setRole(item.type)}
              sx={{ height: 68, mt: 2, pl: 1, background: '#F9FAFC', borderRadius: 1, cursor: 'pointer' }}
            >
              <Radio checked={role === item.type} />
              <Box>
                <Typography noWrap variant='subtitle1' color='#303133'>
                  {item.name}
                </Typography>
                <Typography noWrap variant='subtitle2' sx={{ color: 'text.light' }}>
                  {item.description}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Box>

        <Box>
          <Box sx={{ mt: 6, mb: 2 }}>
            <Typography noWrap variant='subtitle1' color='#303133'>
              {t('附加权限')}
            </Typography>
            <Typography noWrap variant='subtitle2' sx={{ color: 'text.light' }}>
              {t('您可以为您的用户添加额外的权限集')}
            </Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              onClick={() => setCanApprove(prev => !prev)}
              sx={{ height: 68, mt: 2, pl: 4, pr: 6, background: '#F9FAFC', borderRadius: 1, cursor: 'pointer' }}
            >
              <Box>
                <Typography noWrap variant='subtitle1' color='#303133'>
                  {t('审批人')}
                </Typography>
                <Typography noWrap variant='subtitle2' sx={{ color: 'text.light' }}>
                  {t('允许该经理批准项目。')}
                </Typography>
              </Box>
              <Switch checked={canApprove} />
            </Stack>

            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              onClick={() => setCanControl(prev => !prev)}
              sx={{ height: 68, mt: 2, pl: 4, pr: 6, background: '#F9FAFC', borderRadius: 1, cursor: 'pointer' }}
            >
              <Box>
                <Typography noWrap variant='subtitle1' color='#303133'>
                  {t('控制器')}
                </Typography>
                <Typography noWrap variant='subtitle2' sx={{ color: 'text.light' }}>
                  {t('允许这位经理调整付款。')}
                </Typography>
              </Box>
              <Switch checked={canControl} />
            </Stack>
          </Box>
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

export default Step3
