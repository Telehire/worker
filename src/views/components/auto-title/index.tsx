import Typography from "@mui/material/Typography";
import Hidden from '@mui/material/Hidden'

const AutoTitle = (props: {title: string, sx?: any}) => {
  const {title, sx} = props
  return (
   <>
     <Hidden smDown>
       <Typography sx={{fontSize: 32, fontWeight: 600, color :'#564A96', mb: 16,textAlign: 'center', ...sx}}>{title}</Typography>
     </Hidden>
     <Hidden smUp>
       <Typography sx={{fontSize: 22, fontWeight: 600, color :'#564A96', mb: 16,textAlign: 'center', ...sx}}>{title}</Typography>
     </Hidden>
   </>
  )
}
export default AutoTitle
