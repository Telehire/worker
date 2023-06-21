import {Grid, Typography, Card, Box} from '@mui/material'
import {SalaryInfoType} from 'src/types/biz/contract'
import Icon from 'src/@core/components/icon'

interface IProps{
  title?: string
  infoMap?: SalaryInfoType[]
  handleEdit: any
  isEmpty?: boolean
  emptyDesc?: string
  canEdit?: boolean
  mulData?: {
    title: string,
    titleDesc?: string,
    infoMap?: SalaryInfoType[],
    isEmpty?: boolean,
    emptyDesc?: string
  }[]
}

export const PreviewInfoCard = (props: IProps) => {
  const {title, infoMap = [], handleEdit, isEmpty = false, emptyDesc = '', mulData, canEdit} = props
  return (
    <Card sx={{borderRadius: 2, py: 6, px: 6,mb: 5}}>
      {
        !mulData && (
          <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
            <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A3541DE'}}>{title}</Typography>
            {
              canEdit && <Box component="img" src='/images/contract/pencil.png' sx={{cursor: 'pointer'}} height={14} onClick={() => {handleEdit(title)}} />
            }
          </Grid>
        )
      }
      <Grid container>
        {
          (!isEmpty && !mulData) && infoMap.map((v: SalaryInfoType, index: number ) => {
           if(v.name) {
             return <Grid key={index} item xs={12} sx={{display: 'flex',alignItems: 'center', py: 2, px: 4, mb: 2, borderBottom: '1px solid #F2F6FC'}}>
               <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199', width: 130}}>{v.name}</Typography>
               <Grid item sx={{display: 'flex',alignItems: 'center', flex: 1}}>
                 <Typography sx={{fontSize: 14, fontWeight: 500, color: '#303133', mr: 4}}>{v.value}</Typography>
                 <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199'}}>{v.desc}</Typography>
               </Grid>
             </Grid>
           } else {
             return  <Typography key={index} sx={{fontSize: 14, fontWeight: 400, color: '#3A354199'}}>{v.desc}</Typography>
           }
         })
        }
        {
          (!isEmpty && mulData) && (
            mulData.map((item: any) => (
              <>
                <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                  <Typography sx={{fontSize: 14, fontWeight: 600, color: '#3A3541DE'}}>{item.title}</Typography>
                  {
                    item.titleDesc && <Typography sx={{fontSize: 12, fontWeight: 400, color: '#FF943E',px:1, py: 0.5, backgroundColor: '#FFF6F0'}}>{item.titleDesc}</Typography>
                  }
                </Grid>
                {
                  item.infoMap && item.infoMap.map((v: SalaryInfoType, index: number ) => {
                    if(v.name) {
                      return <Grid key={index} item xs={12} sx={{display: 'flex',alignItems: 'center', py: 2, px: 4, mb: 2, borderBottom: '1px solid #F2F6FC'}}>
                        <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199', width: 130}}>{v.name}</Typography>
                        <Grid item sx={{display: 'flex',alignItems: 'center', flex: 1, justifyContent: 'space-between'}}>
                          <Typography sx={{fontSize: 14, fontWeight: 500, color: '#303133', mr: 4}}>{v.value}</Typography>
                          <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A354199'}}>{v.desc}</Typography>
                        </Grid>
                      </Grid>
                    } else {
                      return  <Typography key={index} sx={{fontSize: 14, fontWeight: 400, color: '#3A354199'}}>{v.desc}</Typography>
                    }
                  })
                }
              </>
            ))
          )
        }
        {
          isEmpty && <Typography sx={{fontSize: 14, fontWeight: 400, color: '#3A3541DE', display: 'flex', alignItems: 'center', pl: 3}}><Icon icon="material-symbols:info-outline" style={{height: 18, width: 18, color: '#3A354199', marginRight: 10}} />{emptyDesc}</Typography>
        }
      </Grid>
    </Card>
  )
}
