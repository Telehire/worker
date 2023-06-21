// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import axios from 'axios'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { styled, useTheme, lighten, darken } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { fetchAllOrg, fetchAllTeam } from 'src/store/apps/org'
import {
  deleteCustomJobScope,
  fetchCustomJobScope,
  fetchJobScope,
  fetchJobTitle,
  saveCustomJobScope,
  fetchCustomJobDesc,
  fetchStandardCustomJobDesc
} from '../../../store/apps/job'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { common } from '@mui/material/colors'
import { Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material'
import {saveEorContract, saveContractDetail, getContractDetailById} from '../../../store/apps/contract'
import Chip from '@mui/material/Chip'
import toast from 'react-hot-toast'
import IconButton from "@mui/material/IconButton";
import {CREATE_TEAM} from '@/apis/org'

interface Props {
  setStep: Dispatch<SetStateAction<number>>
  orgId: string
  contractId: string
  afterCreateTeam: any
}

interface FormInputs {
  contractingEntity: string
  contractingTeam: string
  jobTitle: string
  jobScope: string
}

interface TeamProps {
  teamName: string
}

interface DialogFormInputs {
  customJobScopeTitle: string
}

interface JobTitleOption {
  categoryCode?: string
  categoryName?: string
  titleKey?: string
  titleName?: string
  inputValue?: string
}

type TitleOptionType = {
  categoryCode?: string
  categoryName?: string
  titleKey?: string
  titleName?: string
  inputValue?: string
}

const filter = createFilterOptions<JobTitleOption>()

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  textAlign: 'left',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  paddingLeft: 15,
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const schema = yup.object().shape({
  contractingEntity: yup.string().required(),
  contractingTeam: yup.string().required(),
  jobTitle: yup.string().required(),
  jobScope: yup.string().required()
})

const schemaDialog = yup.object().shape({
  customJobScopeTitle: yup.string().required()
})

const FormCard1 = ({ title, control, errors, orgId, currentContract, setValue, toCreateTeam }: any) => {
  const { t } = useTranslation()

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const { organizations, teams } = useSelector((state: RootState) => state.org)

  useEffect(() => {
    dispatch(
      fetchAllOrg({
        orgId
      })
    )
    dispatch(
      fetchAllTeam({
        orgId
      })
    )
  }, [dispatch, orgId])

  useEffect(() => {
    console.log('currentContract', currentContract.entiryId)
    setValue('contractingEntity', currentContract.entiryId)
    setValue('contractingTeam', currentContract.teamId)
  }, [currentContract])

  return (
    <Card sx={{ mb: 5 }}>
      <CardHeader sx={{ ml: 2 }} title={title} />

      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel error={Boolean(errors.contractingEntity)} htmlFor='contractingEntity'>
                {t('Entity')}
              </InputLabel>
              <Controller
                name='contractingEntity'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label={t('Entity')}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.contractingEntity)}
                    aria-describedby='employeeNationality'
                  >
                    {organizations.map((o: any) => (
                      <MenuItem value={o.entiryId}>{o.entiryName}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.contractingEntity && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.contractingEntity.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel error={Boolean(errors.contractingTeam)} htmlFor='contractingTeam'>
                {t('Team')}
              </InputLabel>
              <Controller
                name='contractingTeam'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label={t('Team')}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.contractingTeam)}
                    aria-describedby='contractingTeam'
                  >
                    {teams.map((o: any) => (
                      <MenuItem value={o.teamId}>{o.teamName}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              {
                teams.length === 0 && (
                  <Grid container>
                    <TypographyStyled>您还没有团队，现在</TypographyStyled>
                    <TypographyStyled sx={{cursor: 'pointer', color: '#7C4DFF'}} onClick={toCreateTeam}>创建一个</TypographyStyled>
                  </Grid>
                )
              }
              {errors.contractingTeam && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.contractingTeam.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const FormCard2 = ({ title, control, errors, orgId, getValues, setValue, trigger, currentContract }: any) => {
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const [jobTitleOptions, setJobTitleOptions] = useState<TitleOptionType[]>([])
  const [jobTitle, setJobTitle] = useState<JobTitleOption | null>(null)
  const [showJobScopeList, setShowJobScopeList] = useState(false)
  const [showCustomJobScopeList, setShowCustomJobScopeList] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [showJobScopeAddDialog, setShowJobScopeAddDialog] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    jobTitleList: { basicJobTitleTree, popularJobTitles },
    jobScopeList,
    customJobScopeList
  } = useSelector((state: RootState) => state.job)

  useEffect(() => {
    dispatch(fetchJobTitle({}))
    dispatch(fetchCustomJobScope({ orgId }))
  }, [dispatch])

  useEffect(() => {
    if (basicJobTitleTree) {
      const titles: TitleOptionType[] = popularJobTitles.map((pj: { rkey: any; rvalue: any }) => {
        return {
          categoryCode: '',
          categoryName: t('经常使用'),
          titleKey: pj.rkey,
          titleName: pj.rvalue,
          inputValue: ''
        }
      })

      basicJobTitleTree.forEach((a: any) => {
        a.jobTitles.forEach((j: any) => {
          const jt = {
            categoryCode: a.categoryCode,
            categoryName: a.categoryName,
            titleKey: j.rkey,
            titleName: j.rvalue,
            inputValue: ''
          }
          titles.push(jt)
        })
      })
      setJobTitleOptions(titles)
    }
  }, [basicJobTitleTree])

  useEffect(() => {
    setJobTitle(currentContract.jobTitle)
    setValue('jobScope', currentContract.jobDuty)
    setValue('jobTitle', currentContract.jobTitle)
  }, [currentContract])

  const GroupHeader = styled('div')(({ theme }) => ({
    padding: '4px 10px',
    color: theme.palette.primary.main
  }))

  const GroupItems = styled('ul')({
    padding: 0
  })

  const handleSaveJobScope = () => {
    if (getValues('jobScope')) {
      setShowJobScopeAddDialog(true)
      resetFieldDialog('customJobScopeTitle')
    }
  }

  const handleClickPresetJobScope = async (jobId: string) => {
    //获取标签详情描述
    const {
      payload: { data }
    } = await dispatch(fetchCustomJobDesc({orgId, jobId}))
    setValue('jobScope', data.descriptions[0]?.content)
  }

  const handleClickPresetStandardJobScope = async (jobId: string) => {
    //获取标签详情描述
    const {
      payload: { data }
    } = await dispatch(fetchStandardCustomJobDesc({ orgId, jobId }))
    setValue('jobScope', data.descriptions[0]?.content)
  }

  const handleDeletePresetJobScope = async (jobId: string) => {
    const {
      payload: { code }
    } = await dispatch(deleteCustomJobScope({ orgId, jobId }))

    if (code === 'SUCCESS') {
      await dispatch(fetchCustomJobScope({ orgId }))
    } else {
      toast.error(t('删除自定义职位范围失败') || '', { position: 'top-center' })
    }
  }

  const handleJobScopeDialogClose = () => {
    setShowJobScopeAddDialog(false)
  }

  const onCustomJobScopeSubmit = async () => {
    const params = {
      code: getValuesDialog('customJobScopeTitle'),
      orgId,
      jobTitles: [
        {
          bizType: 'JOB_TITLE',
          lng: i18n.language,
          content: getValuesDialog('customJobScopeTitle')
        }
      ],
      descriptions: [
        {
          bizType: 'JOB_DESC',
          lng: i18n.language,
          content: getValues('jobScope')
        }
      ],
    }
    const {
      payload: { code }
    } = await dispatch(
      saveCustomJobScope(params)
    )
    if (code === 'SUCCESS') {
      setShowJobScopeAddDialog(false)
      await dispatch(fetchCustomJobScope({ orgId }))
    } else {
      toast.error(t('自定义职位范围保存失败') || '', { position: 'top-center' })
    }
  }

  const defaultValues = {
    customJobScopeTitle: ''
  }

  const {
    control: controlDialog,
    getValues: getValuesDialog,
    handleSubmit: handleSubmitDialog,
    resetField: resetFieldDialog,
    formState: { errors: errorsDialog }
  } = useForm<DialogFormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schemaDialog) })

  return (
    <Card sx={{ mb: 5 }}>
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Autocomplete
                freeSolo
                clearOnBlur
                value={jobTitle}
                selectOnFocus
                handleHomeEndKeys
                options={jobTitleOptions}
                groupBy={(option: any) => option.categoryName}
                renderGroup={params => (
                  <li className={'job-title'} key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                  </li>
                )}
                renderInput={params => <TextField {...params} label={t('Staff.Employee_job_title')} />}
                getOptionLabel={option => {
                  if (typeof option === 'string') {
                    return option || ''
                  }
                  if ((option as JobTitleOption).inputValue as string) {
                    return ((option as JobTitleOption).inputValue as string) || ''
                  }

                  return (option.titleName as string) || ''
                }}
                onChange={async (event, newValue) => {
                  if (typeof newValue === 'string') {
                    setJobTitle({
                      titleName: newValue
                    })
                    setValue('jobTitle', newValue)
                    dispatch(fetchJobScope({ keywords: newValue }))
                    setShowJobScopeList(true)
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setJobTitle({
                      titleName: newValue.titleName
                    })
                    setValue('jobTitle', newValue.titleName)
                    setShowJobScopeList(false)
                  } else {
                    setJobTitle({
                      titleName: newValue?.titleName
                    })
                    setValue('jobTitle', newValue?.titleName)
                    dispatch(fetchJobScope({ keywords: newValue?.titleName }))
                    setShowJobScopeList(true)
                  }

                  await trigger('jobTitle')
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params)
                  const { inputValue } = params

                  // Suggest the creation of a new value
                  const isExisting = options.some(option => inputValue === option.titleName)
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({
                      inputValue: `${t('Adding')} "${inputValue}"`,
                      titleName: inputValue,
                      titleKey: '',
                      categoryCode: '',
                      categoryName: ''
                    })
                  }
                  return filtered
                }}
              />
              {errors.jobTitle && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.jobTitle.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <CardHeader sx={{ ml: -4, pb: 0 }} title={title} />

        <TypographyStyled sx={{ pl: 0 }} variant={'body2'}>
          {t('The scope of work description of the employee will be included in the employment agreement, please fill out the formal')}
        </TypographyStyled>

        <Grid container spacing={5}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel error={Boolean(errors.jobScope)} htmlFor='jobScope'></InputLabel>
              <Controller
                name='jobScope'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Box sx={{ position: 'relative' }}>
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
                    <Button
                      onClick={handleSaveJobScope}
                      startIcon={<Icon width={16} icon='icon-park-outline:doc-success' />}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        color: theme.palette.grey.A400,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: theme.palette.primary.main
                        }
                      }}
                    >
                      {t('Scope of Work Statement Archive')}
                    </Button>
                  </Box>
                )}
              />
              {errors.jobScope && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.jobScope.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {showJobScopeList && Array.isArray(jobScopeList) && jobScopeList.length > 0 && (
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 4,
                  p: 4,
                  border: '2px dashed #EBEEF5',
                  borderRadius: '8px',
                  backgroundColor: theme.palette.grey['50']
                }}
              >
                <TypographyStyled sx={{ pl: 0, mb: 4, color: theme.palette.info.main }} variant={'body2'}>
                  {t('按照你填写的职称为你推荐的职位描述')}
                </TypographyStyled>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 4
                  }}
                >
                  {(jobScopeList.filter(v => v.jobTitles && v.jobTitles.length))?.map((s: any) => (
                    <Chip variant='outlined' label={s.jobTitles[0].content} onClick={()=>handleClickPresetStandardJobScope(s.jobId)} />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Box
              sx={{
                mt: 4,
                p: 4,
                border: '2px dashed #EBEEF5',
                borderRadius: '8px',
                backgroundColor: theme.palette.grey['50'],
                position: 'relative'
              }}
            >
              <Box
                onClick={() => setShowCustomJobScopeList(!showCustomJobScopeList)}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '50%'
                }}
              >
                <TypographyStyled sx={{ pl: 0, color: theme.palette.info.main, mr: 1 }} variant={'body2'}>
                  {t('Select saved scope of work descriptions')}
                </TypographyStyled>
                {showCustomJobScopeList ? (
                  <Icon width={20} color={theme.palette.info.main} icon='material-symbols:keyboard-arrow-up-rounded' />
                ) : (
                  <Icon
                    width={20}
                    color={theme.palette.info.main}
                    icon='material-symbols:keyboard-arrow-down-rounded'
                  />
                )}
              </Box>

              <TypographyStyled
                onClick={() => setDeleteMode(!deleteMode)}
                sx={{ position: 'absolute', cursor: 'pointer', top: 20, right: 20, color: theme.palette.info.main }}
                variant={'body2'}
              >
                {deleteMode ? t('Complete') : t('Manage')}
              </TypographyStyled>

              <Collapse in={showCustomJobScopeList} timeout='auto' unmountOnExit>
                {Array.isArray(customJobScopeList) && customJobScopeList.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 4,
                      mt: 4
                    }}
                  >
                    {(customJobScopeList.filter(v => v.jobTitles && v.jobTitles.length))?.map((s: any) => (
                      <Button
                        variant='outlined'
                        sx={theme => ({
                          color: theme.palette.secondary.light,
                          borderRadius: 4,
                          borderColor: theme.palette.secondary.light,
                          py: 1,
                          px: 2.5
                        })}
                        endIcon={deleteMode ? <Icon icon='typcn:delete' /> : undefined}
                        onClick={deleteMode ? () => handleDeletePresetJobScope(s.jobId) : () => handleClickPresetJobScope(s.jobId)}
                      >
                        {/*{s.descn ?? s.jobTitle}*/}
                        {s.jobTitles[0].content }
                      </Button>
                    ))}
                  </Box>
                )}
              </Collapse>
            </Box>

            <Dialog
              open={showJobScopeAddDialog}
              onClose={handleJobScopeDialogClose}
              sx={{ ' .MuiDialogContent-root': { paddingTop: 4, mt: 2 } }}
            >
              <form noValidate autoComplete='off'>
                <DialogTitle>{t('添加一个职位范围')}</DialogTitle>
                <DialogContent
                  sx={{
                    width: '400px',
                    height: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <FormControl fullWidth>
                    <Controller
                      name='customJobScopeTitle'
                      control={controlDialog}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          label={t('职位范围标题')}
                          placeholder={t('职位范围标题') || ''}
                          value={value}
                          onChange={onChange}
                          error={Boolean(errorsDialog.customJobScopeTitle)}
                          aria-describedby='customJobScopeTitle'
                        />
                      )}
                    />
                    {errorsDialog.customJobScopeTitle && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errorsDialog.customJobScopeTitle.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleJobScopeDialogClose}>{t('取消')}</Button>
                  <Button type='button' onClick={handleSubmitDialog(onCustomJobScopeSubmit)}>
                    {t('Adding')}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const Step2 = ({ setStep, orgId, contractId, afterCreateTeam }: Props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const [createTeamDialog, setCreateTeamDialog] = useState<boolean>(false)
  const {
    currentContract
  } = useSelector((state: RootState) => state.contract)

  const defaultValues = {
    contractingEntity: '',
    contractingTeam: '',
    jobTitle: '',
    jobScope: ''
  }

  const teamDefaultValues = {
    teamName: ''
  }

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  const {
    control: teamControl,
    handleSubmit: teamHandleSubmit,
    getValues: teamGetValues,
    setValue: teamSetValue,
    trigger: teamTrigger,
    formState: { errors: teamErrors }
  } = useForm<TeamProps>({ defaultValues: teamDefaultValues })

  const onSubmit = async () => {
    const {
      payload: { code, error }
    } = await dispatch(
      saveEorContract({
        action: 'JOB-TITLE',
        contractId,
        orgId,
        teamId: getValues('contractingTeam'),
        type: 'EOR',
        jobTitle: {
          entiryId: getValues('contractingEntity'),
          teamId: getValues('contractingTeam'),
          jobTitle: getValues('jobTitle'),
          jobDuty: getValues('jobScope')
        }
      })
    )
    if (code === 'SUCCESS') {
      await dispatch(getContractDetailById({orgId: orgId, contractId}));
      setStep(prev => prev + 1)

    } else {
      toast.error(error, { position: 'top-right' })
    }
  }

  const toCreateTeam = () => {
    setCreateTeamDialog(true)
  }

  const handleCreateTeam = async () => {
    const valid = await teamTrigger(['teamName'] as any);
    if(valid) {
      const params = {
        orgId,
        teamName: teamGetValues('teamName')
      }
      axios.post(CREATE_TEAM, params).then(res => {
        if(res.data.code === 'SUCCESS') {
          setCreateTeamDialog(false)
          setValue('contractingTeam', res.data.data.teamId)
          afterCreateTeam()
        }
      })
    }
  }

  return (
    <Box sx={{ my: 5 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCard1 title={t('Job Information')} control={control} errors={errors} orgId={orgId} setValue={setValue} currentContract={currentContract} toCreateTeam={toCreateTeam}/>

        <FormCard2
          title={t('Scope of work')}
          control={control}
          errors={errors}
          orgId={orgId}
          getValues={getValues}
          setValue={setValue}
          trigger={trigger}
          currentContract={currentContract}
        />
        <Grid item xs={12}>
          <Button size='large' type='submit' variant='contained' sx={{ width: '100%' }}>
            {t('Next step')}
          </Button>
        </Grid>
        <Dialog
          open={createTeamDialog}
          onClose={() => {setCreateTeamDialog(false)}}
          sx={{
            '.MuiPaper-root': {
              width: { xs: '100%', md: 400 },
              '&::-webkit-scrollbar': {
                width: 4,
                borderRadius: 8
              },
              minWidth: { xs: '100%', md: 500 },
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
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mb: 6,
              mt:4
            }}
          >
            {/*<Box component='img' src='/images/contract/wework-logo.png' sx={{ height: 24 }}></Box>*/}
            <Typography sx={{fontSize: 20, fontWeight: 500, textAlign: 'center', flex: 1, color: '#3A3541DE' }}>
              创建团队
            </Typography>
            <IconButton
              size='small' onClick={() => {setCreateTeamDialog(false)}} sx={{color: '#7C4DFF'}}
            >
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>
          <Grid item sx={{px: 6, py: 5}}>
            <FormControl fullWidth>
              <Controller
                name={'teamName'}
                control={teamControl}
                rules={{ required: true}}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label={t('团队名称')}
                    placeholder={t('团队名称') || ''}
                    value={value}
                    onChange={onChange}
                    error={Boolean(teamErrors.teamName)}
                    aria-describedby='teamName'
                  />
                )}
              />
              {teamErrors.teamName && (
                <FormHelperText sx={{ color: 'error.main' }}>{teamErrors.teamName.message}</FormHelperText>
              )}
            </FormControl>
            <Grid item sx={{textAlign: 'right',mt: 6}}>
              <Button variant='outlined' onClick={() => {setCreateTeamDialog(false)}} sx={{mr:6}}>取消</Button>
              <Button variant='contained' onClick={() => {handleCreateTeam()}}>确定</Button>
            </Grid>
          </Grid>
        </Dialog>
      </form>
    </Box>
  )
}

export default Step2
