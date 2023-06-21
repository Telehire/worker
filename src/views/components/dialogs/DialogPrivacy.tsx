// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

export interface PrivacyDialogProps {
  open: boolean
  onClose: (value: boolean) => void
  onApprove: (value: boolean) => void
  onReject: (value: boolean) => void
}

const DialogPrivacy = (props: PrivacyDialogProps) => {
  const { open, onClose, onApprove, onReject } = props

  const handleClose = () => {
    onClose(false)
  }

  const handleApprove = () => {
    onApprove(true)
    onClose(false)
  }

  const handleReject = () => {
    onReject(true)
    onClose(false)
  }

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle id='customized-dialog-title' sx={{ p: 4, mb: 6 }}>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4, mb: 6 }}>
          <Typography gutterBottom>请阅读并同意《服务条款》和《隐私政策》</Typography>
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button variant={'outlined'} onClick={handleReject}>
            拒绝
          </Button>
          <Button variant={'contained'} onClick={handleApprove}>
            同意
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DialogPrivacy
