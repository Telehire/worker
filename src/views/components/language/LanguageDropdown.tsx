// ** React Imports
import { ReactNode } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
  children?: ReactNode
}

const LanguageDropdown = ({ settings, saveSettings, children }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()

  // ** Vars
  const { layout } = settings

  const handleLangItemClick = (lang: 'en' | 'zh_CN' | 'zh_TW' | 'jp') => {
    console.log(location)
    // if(lang === 'zh_CN') {
    //   location.href = `https://www.telehire.cn?language=${lang}`
    // } else {
    //   location.href = `https://www.telehire.net?language=${lang}`
    // }
    location.search = `language=${lang}`
    // i18n.changeLanguage(lang)
    // if(!location.search) {
    //   location.href = location.href + `?language=${lang}`
    // } else {
    //   const search = location.search
    //   const searchArr = search.split('&');
    //   const tempIndex = searchArr.findIndex(v => v.indexOf('language=')>0);
    //   if(tempIndex !== -1) {
    //     if(tempIndex === 0) {
    //       searchArr.splice(tempIndex, 1, `/?language=${lang}`)
    //     }else {
    //       searchArr.splice(tempIndex, 1, `language=${lang}`)
    //     }
    //     location.href = location.origin + searchArr.join('&')
    //   } else {
    //     location.href = location.href + `&language=${lang}`
    //   }
    // }
  }

  return (
    <OptionsMenu
      icon={children || <Icon icon='mdi:translate' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
      iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      options={[
        {
          text: '中文简',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'zh_CN',
            onClick: () => {
              handleLangItemClick('zh_CN')
              saveSettings(settings)
            }
          }
        },
        {
          text: '中文繁',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'zh_TW',
            onClick: () => {
              handleLangItemClick('zh_TW')
              saveSettings(settings)
            }
          }
        },
        {
          text: 'English',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'en',
            onClick: () => {
              handleLangItemClick('en')
              saveSettings(settings)
            }
          }
        },
        {
          text: '日本语',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'jp',
            onClick: () => {
              handleLangItemClick('jp')
              saveSettings(settings)
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
