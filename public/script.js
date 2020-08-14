const Mask = {
    apply(input, func) {
        setTimeout(function() {
            input.value = Mask[func](input.value) //Mask.formatBRL
        }, 1 )
    },
    formatBRL(value) {
        value = value.replace(/\D/g, "")

        return value = new Intl.NumberFormat('pt-Br', {
            style: 'currency',  // 1.000.00
            currency: 'BRL' //R$
        }).format(value/100)

        e.target.value = value
    },
    cpfCnpj(value) {
        value = value.replace(/\D/g, "")

        if(value.length > 14)
            value = value.slice(0, -1)

        // check if it is cnpj - 11.222.333/0001-11
        if(value.length > 11) {

            //  Entra assim : 11222333000111
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            //  Sai assim 11.222333000111

            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            //  Sai assim 11.222.333000111

            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            // Sai assim 11.222.333/000111

            value = value.replace(/(\d{4})(\d)/, "$1-$2")
            // Sai assim 11.222.333/0001-11

        } else {
            // cpf
            //  entra assim 11122233345
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            //  sai assim 111.22233345

            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // sai assim 111.222.33345

            value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value
    },
    cep(value) {
        value = value.replace(/\D/g, "")

        if(value.length > 8)
            value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos_preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) {
            PhotosUpload.updateInputFiles()
            return
        }

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image() // mesma COISA QUE <img >
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.updateInputFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input , preview} = PhotosUpload
        const { files: fileList} = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }

        return false
    },
    getAllfiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
            div.classList.add('photo')

            div.onclick =  PhotosUpload.removePhoto

            div.appendChild(image)

            div.appendChild(PhotosUpload.getRemoveButton())

            return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const newFiles = Array.from(PhotosUpload.preview.children).filter(function(file) {
            if(file.classList.contains('photo') && !file.getAttribute('id')) return true
        })        

        const index = newFiles.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)

        PhotosUpload.updateInputFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode
        
        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if(removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }
        
        photoDiv.remove()
    },
    updateInputFiles() {
        PhotosUpload.input.files = PhotosUpload.getAllfiles()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview > img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox_target'),
    image: document.querySelector('.lightbox_target img'),
    closeButton: document.querySelector('.lightbox_target a.lightbox_close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },

    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"

    }
}

const Validate = {
    apply(input, func) {
            Validate.clearErrors(input)

            let results = Validate[func](input.value)
            input.value = results.value

            if(results.error) 
                Validate.displayError(input, results.error)

            
    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error")
        if(errorDiv)
            errorDiv.remove()
    }, 
    isEmail(value) {
        let error = null

        // abcdef
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 

        if (!value.match(mailFormat)) error = "Email Inválido"

        
        return {
            error,
            value
        }
    },
    isCpfCnpj(value) {
        let error = null 

        const cleanValues = value.replace(/\D/g, "")

        if(cleanValues.length > 11 && cleanValues.length !== 14) {
            error = "CNPJ incorreto"
        } else if (cleanValues.length < 12 && cleanValues.length !== 11) {
            error = "CPF Incorreto"
        }    

        return {
            error,
            value
        }
    },
    isCep(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if( cleanValues.length !== 8) {
            error = "CEP Incorreto"
        }

        return {
            error,
            value
        }
    },
    allFields(e) {
        const items = document.querySelectorAll('.item input, .item select, item textarea')
        
        for (item of items) {
            if ( item.value == "") {
                const message = document.createElement('div')
                message.classList.add('messages')
                message.classList.add('error')
                message.style.position = 'fixed'

                message.innerHTML = 'Todos os campos são obrigatórios.'
                document.querySelector('body').append(message)
                
                e.preventDefault()
            }
        }
    }
}