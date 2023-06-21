import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Section from "@/views/home/components/Section";
import {Icon} from "@iconify/react";
import Hidden from '@mui/material/Hidden'
import { useTranslation } from 'react-i18next'

interface cardInfoType {
  url: string,
  index: string,
  title: string,
  desc: string
}

const FlowPath = (props: {cardInfo: cardInfoType[]}) => {
  const {cardInfo} = props;
  const { t } = useTranslation()

  const infoCard = (url: string, index: string, title: string, desc: string) => {
    return (
      <Grid item sx={{flex: 1,display: 'flex',alignItems: 'center', flexDirection: 'column', px: 5.5, pt: 10, pb: 6,height: 400, border: '1px solid #3A35411F', backgroundColor: '#F9FAFC', borderRadius: 3, mx: 0.3}}>
        <Box component="img" src={url} width={72} sx={{mb: 8}} />
        <Typography sx={{fontSize: 20, fontWeight: 700, color :'#909399', mb: 2.5}}>{index}</Typography>
        <Typography sx={{fontSize: 20, fontWeight: 500, color :'#564A96', mb: 2.5, lineHeight: '140%'}}>{t(title || '')}</Typography>
        <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A354199', textAlign: 'center'}}>{t(desc || '')}</Typography>
      </Grid>
    )
  }
  const infoCardSm = (url: string, index: string, title: string, desc: string) => {
    return (
      <Grid item sm={12} xs={5} sx={{display: 'flex',alignItems: 'center', flexDirection: 'column', px: 5.5, pt: 7, pb: 6,height: 400, border: '1px solid #3A35411F', backgroundColor: '#F9FAFC', borderRadius: 3, mb: 2}}>
        <Box component="img" src={url} width={62} sx={{mb: 4}} />
        <Typography sx={{fontSize: 20, fontWeight: 700, color :'#909399', mb: 2.5}}>{index}</Typography>
        <Typography sx={{fontSize: 16, fontWeight: 500, color :'#564A96', mb: 2.5, lineHeight: '140%'}}>{t(title || '')}</Typography>
        <Typography sx={{fontSize: 12, fontWeight: 400, color :'#3A354199', textAlign: 'center'}}>{t(desc || '')}</Typography>
      </Grid>
    )
  }
  return (
    <Section sx={{ background: '#fff' }}>
      <Hidden smDown>
        <Grid item xs={12} sm={12} sx={{display: 'flex', alignItems: 'center', mb: 30}}>
          {
            cardInfo.map((v: cardInfoType, index: number) => {
              return (
                <>
                  {infoCard(v.url, v.index, v.title, v.desc)}
                  {
                    (index !== cardInfo.length - 1 ) && <Icon icon="material-symbols:chevron-right-rounded" style={{width: 35, height: 35, color: '#3A354161'}} />
                  }
                </>
              )
            })
          }
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Grid container md={12} sm={12}>
          {
            cardInfo.map((v: cardInfoType, index: number) => {
              return (
                <>
                  {infoCardSm(v.url, v.index, v.title, v.desc)}
                  {
                    (index !== cardInfo.length - 1  )&& <Grid item xs={1} sx={{display: 'flex', alignItems: 'center'}}><Icon icon="material-symbols:chevron-right-rounded" style={{width: 35, height: 35, color: '#3A354161'}} /></Grid>
                  }
                </>
              )
            })
          }
        </Grid>
      </Hidden>
    </Section>
  )
}
export default FlowPath
