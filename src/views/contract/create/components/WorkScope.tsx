import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {Controller, useForm} from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import {yupResolver} from "@hookform/resolvers/yup";
import {useTranslation} from "react-i18next";
import {styled, useTheme} from "@mui/material/styles";
import * as yup from "yup";
import {Switch, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Icon from "@/@core/components/icon";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {Alert} from "@mui/lab";
import FormControlLabel from "@mui/material/FormControlLabel";
import CleaveWrapper from "@/@core/styles/libs/react-cleave";
import DatePicker from "react-datepicker";
import CustomInput from "@/views/forms/form-elements/pickers/PickersCustomInput";
import {TypographyProps} from "@mui/material/Typography";
import { useEffect, useState } from 'react'
import Cleave from "cleave.js/react";
import {common} from "@mui/material/colors";
import Button from "@mui/material/Button";
import {getContractDetailById, saveEorContract} from "@/store/apps/contract";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";

interface DialogFormInputs {
  jobDuty: string,
}

interface Iprops{
  handleClose: any
  defaultInfo: any
}


const SalaryForm = ({handleClose, defaultInfo}:Iprops) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const schemaDialog = yup.object().shape({
    customJobScopeTitle: yup.string().required()
  })

  const defaultValues = {
    jobDuty: ''
  }

  useEffect(() => {
    setValue('jobDuty', defaultInfo.jobDuty)
  },[defaultInfo])


  const {
    control,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<DialogFormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schemaDialog) })

  const handleSubmit = async () => {
      const {
        payload: { code, error }
      } = await dispatch(
        saveEorContract({
          action: 'PREVIEW-SAVE',
          contractId: defaultInfo.contractId,
          orgId: defaultInfo.orgId,
          teamId: defaultInfo.teamId,
          type: 'EOR',
          jobTitle: {
            entiryId: defaultInfo.entiryId,
            teamId: defaultInfo.teamId,
            jobTitle: defaultInfo.jobTitle,
            jobDuty: getValues('jobDuty')
          }
        })
      )
    if (code === 'SUCCESS') {
      await dispatch(getContractDetailById({orgId: '1', contractId: defaultInfo.contractId}));
      handleClose()
    } else if(code === 'INVALID_PARAMETER') {
      toast.error(error, { position: 'top-right' })
    }
  }


  return (
    <Grid item xs={12} sx={{py: 4.5, px: 6}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 6,
        }}
      >
        {/*<Box component='img' src='/images/contract/wework-logo.png' sx={{ height: 24 }}></Box>*/}
        <Typography sx={{fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
          编辑工作范围说明
        </Typography>
        <IconButton
          size='small' onClick={handleClose} sx={{color: '#7C4DFF'}}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <form autoComplete='off' >
        <Grid item sm={12} xs={12}>
          <FormControl fullWidth>
            <Controller
              name={'jobDuty'}
              control={control}
              rules={{ required: true}}
              render={({ field: { value, onChange } }) => (
                <TextField
                  sx={{
                    backgroundColor: common.white,
                    width: '100%',
                    '.MuiInputBase-root': {
                      backgroundColor: common.white,
                      pr: 45
                    }
                  }}
                  placeholder={t('Scope of Work Statement') || ''}
                  rows={4}
                  value={value}
                  onChange={onChange}
                  multiline
                  variant='outlined'
                />
              )}
            />
            {errors.jobDuty && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.jobDuty.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid container justifyContent='flex-end'>
          <Button size='large' variant='outlined' onClick={handleClose}>
            {t('取消')}
          </Button>
          <Button size='large' variant='contained' sx={{ ml: 3 }} onClick={() => {handleSubmit()}}>
            {t('继续')}
          </Button>
        </Grid>
      </form>

    </Grid>
  )
}
export default SalaryForm

