// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

interface Manager {
  id: number
  name: string
  email: string
}

const managers: Manager[] = [
  {
    id: 1,
    name: '冯艺莲',
    email: 'j.iiysyslmvw@nohdg.gi'
  },
  {
    id: 2,
    name: '周利云',
    email: 'h.tik@infcj.ws'
  },
  {
    id: 3,
    name: '王民琦',
    email: 'c.wsodh@qtcjgkemn.nr'
  },
  {
    id: 4,
    name: '冯艺莲',
    email: 'j.iiysyslmvw@nohdg.gi'
  },
  {
    id: 5,
    name: '周利云',
    email: 'h.tik@infcj.ws'
  },
  {
    id: 6,
    name: '王民琦',
    email: 'c.wsodh@qtcjgkemn.nr'
  },
  {
    id: 7,
    name: '冯艺莲',
    email: 'j.iiysyslmvw@nohdg.gi'
  },
  {
    id: 8,
    name: '周利云',
    email: 'h.tik@infcj.ws'
  },
  {
    id: 9,
    name: '王民琦',
    email: 'c.wsodh@qtcjgkemn.nr'
  },
  {
    id: 10,
    name: '冯艺莲',
    email: 'j.iiysyslmvw@nohdg.gi'
  }
]

const OrganizationManagersAdd = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [selected, setSelected] = useState<number[]>([])
  const selectedManagers = managers.filter(item => selected.includes(item.id))

  const toggleSelected = (id: number) => {
    let newSelected = []
    if (selected.includes(id)) {
      newSelected = selected.filter(item => item !== id)
    } else {
      newSelected = selected.concat(id)
    }
    setSelected(newSelected)
  }

  const onCancel = () => {
    setSelected([])
  }

  const onOk = () => {
    setOpen(true)
  }

  const onFinish = () => {
    setOpen(false)
  }

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item sm={6} xs={12}>
            <Typography>{t('组织：')}台湾数银实验室</Typography>

            <TextField
              fullWidth
              size='small'
              label={t('搜索经理姓名或者电子邮箱')}
              onChange={e => setKeyword(e.target.value)}
              sx={{ my: 3 }}
            />

            <Typography variant='body2'>共 {managers.length} 个人</Typography>

            <Box sx={{ height: 'calc(100vh - 470px)', overflow: 'auto' }}>
              {managers
                .filter(item => item.name.includes(keyword) || item.email.includes(keyword))
                .map(item => (
                  <Stack
                    direction='row'
                    alignItems='center'
                    onClick={() => toggleSelected(item.id)}
                    sx={{ height: 68, mt: 2, pl: 1, background: '#F9FBFF', borderRadius: 1, cursor: 'pointer' }}
                  >
                    <Checkbox size='small' checked={selected.includes(item.id)} />
                    <CustomAvatar
                      src={`/images/avatars/${item.id}`}
                      sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography noWrap variant='subtitle2' color='#303133'>
                        {item.name}
                      </Typography>
                      <Typography noWrap variant='caption' sx={{ color: 'text.light' }}>
                        {item.email}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
            </Box>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Typography variant='body2' sx={{ mb: 3 }}>
              已选中 {selected.length} 人
            </Typography>
            {selectedManagers.map(item => (
              <Chip
                label={item.name}
                avatar={<Avatar src={`/images/avatars/${item.id}`} />}
                onDelete={() => toggleSelected(item.id)}
                key={item.id}
                sx={{ mr: 3, mb: 2.5, background: '#F2F6FC', borderRadius: 1 }}
              />
            ))}
          </Grid>
        </Grid>

        <Stack direction='row' justifyContent='flex-end' mt={4}>
          <Button variant='outlined' onClick={onCancel}>
            {t('取消')}
          </Button>
          <Button variant='contained' onClick={onOk} disabled={selected.length === 0} sx={{ ml: 3 }}>
            {t('确定')}
          </Button>
        </Stack>
      </CardContent>

      <Dialog open={open} onClose={onFinish}>
        <Stack alignItems='center' justifyContent='center' sx={{ width: 480, height: 320 }}>
          <Box component='img' src='/images/enterprise/check-icon.png' sx={{ width: 48, mt: 5, mb: 10 }} />
          <Typography variant='h6' sx={{ mb: 5 }}>
            {selectedManagers[0]?.name}
            {t(' 等人已经被设置为组织管理员')}
          </Typography>
          <Button variant='contained' onClick={onFinish}>
            {t('知道了')}
          </Button>
        </Stack>
      </Dialog>
    </Card>
  )
}

export default OrganizationManagersAdd
