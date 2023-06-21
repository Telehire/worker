// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Icon from '@/@core/components/icon'
import axios from 'axios'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'


interface IProps {
  onClose: () => void
  onSure: any
  list: listItem[]
  show: boolean;
  toShowMore?: any
}

import { listItem } from '@/types/biz/contract'



const durationMap: any = {
  monthly: '每月支付',
  weekly: '每周支付',
  oneTime: '一次性',
}

const Img = styled('img')(({ theme }) => ({}))

export const ReferenceCheck = (props: IProps) => {
  const { t, i18n } = useTranslation()
  const { onClose, onSure, list = [], show, toShowMore } = props
  const [checkedList, setCheckedList] = useState<any[]>([])

  const handleChangeCheck  = (id: any, val: boolean) => {
    if(val) {
      setCheckedList([...checkedList, id])
    } else {
      const temp = [...checkedList];
      temp.splice(temp.indexOf(id))
      setCheckedList([...temp])
    }
  }

  const handleToShowMore = (key: number | string) => {
    if(toShowMore) {
      toShowMore(key)
    }
    console.log(key)
  }


  return (
    <Dialog
      open={show}
      onClose={onClose}
      fullWidth
      sx={{
        '.MuiPaper-root': {
          width: { xs: '100%', md: 600 },
          '&::-webkit-scrollbar': {
            width: 4,
            borderRadius: 8
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#d9d9d9',
            borderRadius: 8
          }
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 6,
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 5,
          }}
        >
          <Box>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
            {t('选择背景调查服务')}
          </Typography>
          <IconButton
            size='small' onClick={onClose}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, }}>
          {t('请选择以下服务为新入职员工做背景调查')}
        </Typography>
        <Box
          sx={{
            mb: 6,
          }}
        >
          {
            list.map(v => (
              <Grid key={v.productId} container sx={{ mt: 4, backgroundColor: '#F9FAFC', borderRadius: '5px', padding: '16px 0' }} style={{display: 'flex', alignItems: 'center'}}>
                <Checkbox size="small" checked={checkedList.indexOf(v.productId) > -1} onChange={(e, val) => {handleChangeCheck(v.productId, val)}} />
                {
                  v.supplierIconUrl && <Img sx={{maxWidth: '60px', maxHeight: '60px'}} alt="" src={v.supplierIconUrl} />
                }
                <Grid item style={{flex: 1}}>
                  <Grid item style={{paddingLeft: '12px', fontSize: '16px', fontWeight: 600}}>
                    {v.lngSupplierName.find(item => (item.lng === i18n.language || item.lng.indexOf(i18n.language) !== -1))?.rvalue}
                  </Grid>
                  <Button sx={{pt: 1, pb: 1, fontSize: 3,height: '12px', color: '#16B1FF'}} variant="text" size="small" onClick={() => {handleToShowMore(v.supplierId)}}>
                    {t('了解更多')}
                    <Icon fontSize={12} icon='material-symbols:arrow-outward' />
                  </Button>
                </Grid>
                <Grid item xs={2} sm={2} style={{textAlign: 'right'}} sx={{pr: 2}}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.15' }}>
                    <span style={{marginRight: '5px'}}>{v.productNextCurrency}</span>
                    {`${v.productNextPriceStr}`}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, }}>
                    {durationMap[v.productPriceMode]}
                  </Typography>
                </Grid>
              </Grid>
            ))
          }
        </Box>


        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant='contained' onClick={() => {onSure(checkedList)}} sx={{ ml: 3, width: '112px' }}>{t('确定')}</Button>
        </Box>
      </Box>
    </Dialog>
  )
}
