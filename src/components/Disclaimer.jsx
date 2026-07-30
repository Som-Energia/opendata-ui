import React from 'react'
import Alert from '@material-ui/lab/Alert'
import { useTranslation } from 'react-i18next'

const Disclaimer = () => {
    const { t } = useTranslation()

    return (
        <Alert severity="warning" style={{ justifyContent: 'center' }}>
            {t('DISCLAIMER')}
        </Alert>
    )
}

export default Disclaimer
