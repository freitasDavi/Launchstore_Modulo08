module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)
        
        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const hour  = date.getHours()
        const minutes  = date.getMinutes()

        return {
            day,
            month,
            year,
            hour,
            minutes,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        } // iso
    },
    formatPrice(price) {
        return new Intl.NumberFormat('pt-Br', {
            style: 'currency',  // 1.000.00
            currency: 'BRL' //R$
        }).format(price/100)
    },
    formatCpfCnpj(value) {
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
    formatCep(value) {
        value = value.replace(/\D/g, "")

        if(value.length > 8)
            value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }
}



