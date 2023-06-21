import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import {Icon} from "@iconify/react";
import {useTranslation} from "react-i18next";
import Section from "@/views/home/components/Section";
import Hidden from "@mui/material/Hidden";
import AutoTItle from '../components/auto-title'

const JoinUsWrap = ({onRequestDemo, title}: {onRequestDemo: any, title?: string}) => {
  const { t, i18n } = useTranslation()
  return (
    <Grid item xs={12} sm={12}>
      <Grid item xs={12} sm={12} sx={{backgroundColor: '#F6F5FF', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 14, pb: 5, px: 9}}>
        <AutoTItle title={t(title || 'Answer all your questions about global temporary workers/contractors.')} sx={{mb: 6}} />
        <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A3541DE', mb: 11,textAlign: 'center'}}>
          {t('Want to know how much it costs to set up a physical company? Or how much time it takes? How to handle stock options and intellectual property? Contact us and get all the answers you\'re looking for!')}
        </Typography>
        {
          i18n.language === 'zh_CN' &&  <Box component="img" src="/images/home/case/img.png" width={200} height={200} sx={{mb: 7}} />
        }
        {
          (i18n.language === 'zh_TW' ||  i18n.language === 'jp') &&  <Box component="img" src="/images/home/case/qrcode1.png" width={200} height={200} sx={{mb: 4}} />
        }
        {
          i18n.language === 'en'  &&  (
            <Grid item sx={{width: 482, height: 72, border: '3px solid #7C4DFF', fontSize: 34, backgroundColor: '#fff',color: '#2E2E2E', fontWeight: 500,display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 1.5}}>
            Mailto:Info@telehire.net
          </Grid>
          )
        }
        {
          i18n.language !== 'en' &&         <Typography sx={{fontSize: 14, fontWeight: 400, color :'#3A3541DE', mb: 6,textAlign: 'center'}}>{t('Contact us by scanning the QR code on WeChat')}</Typography>

        }
        <Button
          href='/'
          component={Link}
          variant='outlined'
          onClick={onRequestDemo}
          endIcon={<Icon icon='material-symbols:arrow-right-alt-rounded' />}
          sx={{
            margin: 0,
            borderRadius: 4,
            color: '#fff',
            backgroundColor: '#7C4DFF',
            borderColor: 'transparent',
            my: 6
          }}
        >
          {t('Contact us:')}
        </Button>
      </Grid>
      <Hidden smDown>
        <Section sx={{ background: '#fff'}}>
          <Grid item xs={12} sm={12} sx={{height: 225, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <Grid item sx={{flex: 1}}>
              <Typography sx={{fontSize: 46, fontWeight: 700, color :'#3A3541DE', mb: 2,textAlign: 'center'}}>150 +</Typography>
              <Typography sx={{fontSize: 20, fontWeight: 400, color :'#3A3541DE', mb: 6,textAlign: 'center'}}>{t('Country/region')}</Typography>
            </Grid>
            <Grid item sx={{width: '1px', backgroundColor: '#9155FD80', height: 71}} />
            <Grid item sx={{flex: 1}}>
              <Typography sx={{fontSize: 46, fontWeight: 700, color :'#3A3541DE', mb: 2,textAlign: 'center'}}>100 +</Typography>
              <Typography sx={{fontSize: 20, fontWeight: 400, color :'#3A3541DE', mb: 6,textAlign: 'center'}}>{t('Mainstream currency')}</Typography>
            </Grid>
            <Grid item sx={{width: '1px', backgroundColor: '#9155FD80', height: 71}} />
            <Grid item sx={{flex: 1}}>
              <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography sx={{fontSize: 46, fontWeight: 700, color :'#3A3541DE', mb: 2,textAlign: 'center', mr: 2}}>5</Typography>
                <Typography sx={{fontSize: 20, fontWeight: 400, color :'#3A3541DE',textAlign: 'center'}}>{t('Minutes')}</Typography>
              </Grid>
              <Typography sx={{fontSize: 20, fontWeight: 400, color :'#3A3541DE', mb: 6,textAlign: 'center'}}>{t('SaaS deployment')}</Typography>
            </Grid>
            <Grid item sx={{width: '1px', backgroundColor: '#9155FD80', height: 71}} />
            <Grid item sx={{flex: 1}}>
              <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography sx={{fontSize: 46, fontWeight: 700, color :'#3A3541DE', mb: 2,textAlign: 'center', mr: 2}}>1</Typography>
                <Typography sx={{fontSize: 20, fontWeight: 400, color :'#3A3541DE',textAlign: 'center'}}>{t('Keys')}</Typography>
              </Grid>
              <Typography sx={{fontSize: 20, fontWeight: 400, color :'#3A3541DE', mb: 6,textAlign: 'center'}}>{t('Global compliance')}</Typography>
            </Grid>
          </Grid>
        </Section>
      </Hidden>
      <Hidden smUp>
        <Section sx={{ background: '#fff'}}>
          <Grid item xs={12} sm={12} sx={{height: 150, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <Grid item sx={{flex: 1}}>
              <Typography sx={{fontSize: 36.8, fontWeight: 700, color :'#3A3541DE', mb: 2,textAlign: 'center'}}>150 +</Typography>
              <Typography sx={{fontSize: 16, fontWeight: 400, color :'#3A3541DE', mb: 6,textAlign: 'center'}}>{t('Country/region')}</Typography>
            </Grid>
            <Grid item sx={{width: '1px', backgroundColor: '#9155FD80', height: 71}} />
            <Grid item sx={{flex: 1}}>
              <Typography sx={{fontSize: 36.8, fontWeight: 700, color :'#3A3541DE', mb: 2,textAlign: 'center'}}>100 +</Typography>
              <Typography sx={{fontSize: 16, fontWeight: 400, color :'#3A3541DE', mb: 6,textAlign: 'center'}}>{t('Mainstream currency')}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} sx={{height: 150, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <Grid item sx={{flex: 1}}>
              <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography sx={{fontSize: 36.8, fontWeight: 700, color :'#3A3541DE', mb: 2,textAlign: 'center', mr: 2}}>5</Typography>
                <Typography sx={{fontSize: 16, fontWeight: 400, color :'#3A3541DE',textAlign: 'center'}}>{t('Minutes')}</Typography>
              </Grid>
              <Typography sx={{fontSize: 16, fontWeight: 400, color :'#3A3541DE', mb: 6,textAlign: 'center'}}>{t('SaaS deployment')}</Typography>
            </Grid>
            <Grid item sx={{width: '1px', backgroundColor: '#9155FD80', height: 71}} />
            <Grid item sx={{flex: 1}}>
              <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography sx={{fontSize: 36.8, fontWeight: 700, color :'#3A3541DE', mb: 2,textAlign: 'center', mr: 2}}>1</Typography>
                <Typography sx={{fontSize: 16, fontWeight: 400, color :'#3A3541DE',textAlign: 'center'}}>{t('Keys')}</Typography>
              </Grid>
              <Typography sx={{fontSize: 16, fontWeight: 400, color :'#3A3541DE', mb: 6,textAlign: 'center'}}>{t('Global compliance')}</Typography>
            </Grid>
          </Grid>
        </Section>
      </Hidden>
    </Grid>
  )
}

export default JoinUsWrap
