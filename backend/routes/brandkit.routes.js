import expresss from 'express'
const brandKitRouter=expresss.Router()
// import {createBrandKit, getBrandKitsbyId,getUserBrandKits} from '../controllers/brandkit.controller.js'
import brandKitController from '../controllers/brandkit.controller.js'

const { createBrandKit, getBrandKitsbyId, getUserBrandKits } = brandKitController;

import {protect} from '../middleware/auth.middleware.js'

brandKitRouter.route('/').post(protect,createBrandKit).get(protect,getUserBrandKits);
brandKitRouter.route('/:id').get(protect,getBrandKitsbyId);

export default brandKitRouter;