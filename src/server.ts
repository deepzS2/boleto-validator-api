import Logger from '@utils/logger'

import { PORT } from './config'
import app from './index'

app.listen(PORT, async () => {
	try {
		Logger.info(`Server initiated on http://localhost:${PORT}`)
	} catch (error) {
		Logger.error(`Something went wrong while trying to start server...`)
	}
})
