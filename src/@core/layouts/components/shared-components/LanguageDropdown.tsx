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
  lngAnchorEl?: null | HTMLElement
  closeUserDropdown?: () => void
}

const LanguageDropdown = ({ closeUserDropdown, lngAnchorEl, settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()

  // ** Vars
  const { layout } = settings

  const handleLangItemClick = (lang: 'en' | 'zh_CN' | 'zh_TW' | 'jp') => {
    i18n.changeLanguage(lang)
  }

  return (
    <OptionsMenu
      lngAnchorEl={lngAnchorEl}
      closeUserDropdown={closeUserDropdown}
      icon={<Icon icon='mdi:translate' />}
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
