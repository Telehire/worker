// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Checkbox from "@mui/material/Checkbox";
import Stack from '@mui/material/Stack'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Box from "@mui/material/Box";
import {BillPropsType} from 'src/types/biz/bill'

interface IProps extends BillPropsType{
  checked: boolean;
  handleChange: any;
  faIndex: number;
}

const billTypeMap: any = {
  overTime: '逾期未交'
}

const invoiceTypeMap: {[key: string]: string} = {
  'GUARANTEE_DEPOSIT': '押金'
}

const BillItem = (props: IProps) => {
  const {staffName, jobTitle, billType, invoiceTotalValue,billStatus, checked = false, faIndex, handleChange = () => {}, personImgUrl, invoiceId, currency, invoiceType } = props
  const handleChangeCheck = (val: boolean) => {
    handleChange(invoiceId, val, faIndex)
  }
  return (
    <Grid container xs={12} sx={{backgroundColor: '#F9FBFF',borderRadius: '8px', display: 'flex', alignItems: 'center', mb: 3,pr: 3,height: 64}}>
      <Checkbox checked={checked} onChange={(e, val) => handleChangeCheck(val)} />
      <Grid item sx={{flex: 1}}>
        <Grid item sx={{display: 'flex'}}>
          <Box component='img' src={personImgUrl} sx={{ mr: 4, width: 32, height: 32, display: 'flex', alignItems: 'center' }} />
          <Grid item>
            <Grid>
              <Typography sx={{fontSize: 14}}>{`${staffName}-${jobTitle}`}</Typography>
              <Typography sx={{color: '#909399', fontSize: 12}}>{billType}</Typography>
            </Grid>
            <Typography sx={{fontSize: 14}}>{invoiceTypeMap[invoiceType]}</Typography>
          </Grid>
        </Grid>

      </Grid>
      <Grid item>
        <Typography sx={{fontSize: 14}}>{`${currency} ${Number(invoiceTotalValue) / 1000}`}</Typography>
        {billStatus === 'overTime' && <Typography sx={{color: '#F56C6C', fontSize: 12}}>{billTypeMap[billStatus]}</Typography>}
      </Grid>
    </Grid>
  )
}

export default BillItem
