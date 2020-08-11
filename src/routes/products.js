const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const productController = require('../app/controllers/productController')
const searchController = require('../app/controllers/searchController')

const { olnyUsers } = require('../app/middlewares/session')

//  Search
routes.get('/search', searchController.index)

// Products
routes.get('/create', olnyUsers, productController.create)
routes.get('/:id', productController.show)
routes.get('/:id/edit', olnyUsers, productController.edit)

routes.post('/', olnyUsers, multer.array("photos", 6), productController.post)
routes.put('/', olnyUsers, multer.array("photos", 6), productController.put)
routes.delete('/', olnyUsers, productController.delete)


module.exports = routes