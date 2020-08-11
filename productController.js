const { unlinkSync } = require('fs')

const Category = require('../models/category')
const Product = require('../models/product')
const File = require('../models/file')

const { formatPrice, date } = require('../../lib/utils')

module.exports = {
    async create(req, res) {
        try {
            const categories = await Category.findAll()
            return res.render("products/create.njk", { categories })

        } catch (err) {
            console.error(err)
        }
    },
    async post(req, res) {
        try {

            const keys = Object.keys(req.body)
        
            for( key of keys) {
                // req.body[key] == ""
                if (req.body[key] == "")
                    return res.send('Please fill all fields!')
            }

            if (req.files.length == 0)
                return res.send('Please, send at least on image')

            let { category_id, name, description, old_price, price, quantity, status } = req.body

            price = price.replace(/\D/g, "")

            const product_id = await Product.create( { 
                category_id, 
                user_id: req.session.userId , 
                name, 
                description, 
                old_price: old_price || price,  
                price, 
                quantity, 
                status: status || 1
            })

            const filesPromise = req.files.map(file => 
                File.create({ name: file.filename, path: file.path, product_id}))
            await Promise.all(filesPromise)

            // results = await Category.all()
            // const categories = results.rows
            
            return res.redirect(`products/${product_id}/edit`)
            
        } catch (err) {
            console.error(err)
        }
    },
    async show (req, res) {
        try {
            const product = await Product.find(req.params.id)
        
            if(!product) return res.send("Product not Found!")


            const { day, hour, minutes, month} = date(product.updated_at)

            product.published = {
                day: `${day}/${month}`,
                hour: `${hour}h${minutes}`
            }
            
            product.oldPrice = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            let files = await Product.files(product.id)
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("products/show", {product, files})

        } catch (err) {
            console.error(err)
        }

    },
    async edit(req, res) {
        try {
            const product = await Product.find(req.params.id)

            if(!product) return res.send("Product not found!")

            product.old_price = formatPrice(product.price)
            product.price = formatPrice(product.price)

            // get categories

            const categories = await Category.findAll()

            //  Get images
            let files = await Product.files(product.id)
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
            
            return res.render("products/edit", { product, categories, files})

        } catch (err) {
            console.error(err)
        }
        
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
        
            for( key of keys) {
                if (req.body[key] == "" && key != "removed_files")
                    return res.send('Please fill all fields!')
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                
                await Promise.all(removedFilesPromise)
            }

            if(req.files.length != 0) {

                // Validar se já não existem 6 imagens no total
                const oldFiles = await Product.files(req.body.id)
                const totalFiles = oldFiles.rows.length + req.files.length

                if(totalFiles <= 6) {
                    const newFilesPromise = req.files.map(file => 
                        File.create({...file, product_id: req.body.id}))
        
                    await Promise.all(newFilesPromise)
                }
            }


            req.body.price = req.body.price.replace(/\D/g, "")
            req.body.price = req.body.old_price.replace(/\D/g, "")
 
            if (req.body.old_price != req.body.price) {
                const oldProduct = await Product.find(req.body.id)
                req.body.old_price = oldProduct.price
            }

            await Product.update(req.body.id, { 
                category_id: req.body.category_id,
                name: req.body.name,
                description: req.body.description,
                old_price: req.body.old_price,
                price: req.body.price,
                quantity: req.body.quantity,
                status: req.body.status
            })

            return res.redirect(`/products/${req.body.id}`)

        } catch (err) {
            console.error(err)
        }

        
    },
    async delete(req, res) {
        try {
            //  dos produtos, pegar todas as imagens
            const files = await Product.files(req.body.id)
            await Product.delete(req.body.id)
            
            files.map(file => {
                try{ 
                    unlinkSync(file.path)
                } catch(err) {
                    console.error(err)
                } 
            })

            return res.redirect('/products/create')

        } catch (err) {
            console.error(err)
        }

    }
}