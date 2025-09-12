import expresss from 'express'
const brandKitRouter=expresss.Router()
// import {createBrandKit, getBrandKitsbyId,getUserBrandKits} from '../controllers/brandkit.controller.js'
import brandKitController from '../controllers/brandkit.controller.js'

const { createBrandKit, getBrandKitsbyId, getUserBrandKits,deleteBrandKit } = brandKitController;

import {protect} from '../middleware/auth.middleware.js'

brandKitRouter.route('/').post(protect,createBrandKit).get(protect,getUserBrandKits);
brandKitRouter.route('/:id').get(protect,getBrandKitsbyId);
brandKitRouter.route('/:id').delete(protect,deleteBrandKit);

export default brandKitRouter;