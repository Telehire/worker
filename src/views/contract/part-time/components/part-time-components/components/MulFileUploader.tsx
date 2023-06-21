// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from '@/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'

interface FileProp {
  name: string
  type: string
  size: number
}

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

interface IProps {
  needFileList: boolean
  handleChangFiles: any
  faFiles: any[]
}

const MulFileUploader = (props: IProps) => {
  const { t } = useTranslation()
  const {needFileList,  handleChangFiles, faFiles} = props

  // ** State
  const [files, setFiles] = useState<File[]>([])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 1000000,
    maxFiles: 5,
    onDrop: (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles.map((file: File) => Object.assign(file))])
    },
    onDropRejected: () => {
      toast.error(t('') as string, {
        duration: 2000
      })
    }
  })

  useEffect(() => {
    console.log(faFiles.length, files.length)
    if(faFiles.length !== files.length) {
      handleChangFiles(files)
    }
  }, [files])

  useEffect(() => {
    console.log(faFiles.length, files.length)
    if(faFiles.length !== files.length) {
      setFiles(faFiles)
    }
  }, [faFiles])

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }


  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Grid sx={{ width: '100%' }}>
      <Grid item xs={12} sx={{backgroundColor: '#F4F5FA', color: '#7C4DFF', py: 2}} textAlign='center'>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Button
            sx={{ backgroundColor: '#F4F5FA', height: '34px', fontWeight: 400 }}
          >
            <Icon icon='ic:sharp-add' width={16} />
            {t('Adding')}
          </Button>
        </div>
      </Grid>
      { (!!files.length && needFileList)  &&  (
        <Grid item xs={12} sx={{backgroundColor: '#F4F5FA', color: '#7C4DFF', py: 2}} textAlign='center'>
          {
            files.map((file: FileProp) => (
              <ListItem key={file.name} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div className='file-details'>
                  <div>
                    <Typography className='file-name' sx={{color: '#7C4DFF'}}>{file.name}</Typography>
                  </div>
                </div>
                <IconButton onClick={() => handleRemoveFile(file)}>
                  <Icon icon='ph:trash' fontSize={20} />
                </IconButton>
              </ListItem>
            ))
          }
        </Grid>
      )}
    </Grid>
  )
}

export default MulFileUploader
