// ** I18n Imports
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { ApexOptions } from 'apexcharts'

const series = [
  {
    name: '全职员工',
    data: [90, 120, 55, 100, 80, 125, 175]
  },
  {
    name: '外包员工',
    data: [85, 100, 30, 40, 95, 90, 30]
  }
]

const columnColors = {
  bg: 'transparent',
  series1: '#3296fa',
  series2: '#d9ecff'
}

const WeeklyPaid = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      offsetX: -10,
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    fill: { opacity: 1 },
    dataLabels: { enabled: false },
    colors: [columnColors.series1, columnColors.series2],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      labels: { colors: theme.palette.text.secondary },
      markers: {
        offsetY: 1,
        offsetX: -3
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    stroke: {
      show: true,
      colors: ['transparent']
    },
    plotOptions: {
      bar: {
        columnWidth: '25%',
        colors: {
          backgroundBarRadius: 10,
          backgroundBarColors: [columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg]
        }
      }
    },
    grid: {
      show: false
    },
    yaxis: {
      show: false,
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      categories: ['01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18'],
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '35%'
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardContent sx={{ px: 6, py: 5 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{t('近7天已支付')}（ $9087.00）</Typography>
        </Stack>

        <ReactApexcharts type='bar' height={284} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default WeeklyPaid
