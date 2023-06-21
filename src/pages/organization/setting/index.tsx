import Grid  from '@mui/material/Grid'
import Select  from '@mui/material/Select'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {GET_CURRENT_USER_ORG_LIST} from "@/apis";
import { useDispatch, useSelector } from 'react-redux'
import {AppDispatch, RootState} from "@/store";
import {setOrgId} from "@/store/apps/org";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useTranslation } from 'react-i18next'

const Setting  = () => {
  const [orgList, setOrgList] = useState<any[]>([])
  useEffect(() => {
    getOrgList()
  }, [])

  const { t } = useTranslation()

  const { orgId } = useSelector((state: RootState) => state.org)

  const dispatch = useDispatch<AppDispatch>()

  const handleToggleOrg = async (val: string) => {
    await dispatch(setOrgId(val))
  }

  const getOrgList = () => {
    axios.get(GET_CURRENT_USER_ORG_LIST, {}).then(res => {
      if(res.data.code === 'SUCCESS') {
        setOrgList(res.data.data)
      }
    })
  }

  return (
    <Grid container md={12} sm={12}>
      <FormControl fullWidth>
        <InputLabel id='invoice-status-select'>{t('Select Organization')}</InputLabel>
        <Select
          fullWidth
          value={orgId}
          sx={{ mr: 4, mb: 2 }}
          label='Invoice Status'
          onChange={(e) => {
            handleToggleOrg(e.target.value)
          }}
          labelId='invoice-status-select'
        >
          {
            orgList.map((v: any) => (
              <MenuItem value={v.orgId} key={v.orgId}>{v.email}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Grid>
  )
}
export default Setting
