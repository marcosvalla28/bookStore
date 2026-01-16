const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    title: {
        type:String,
        required:true,
        trim: true
    },
    auth: {
        type:String,
        required:true,
        trim: true
    },
    price: {
        type:Number,
        required:true,
        min:0
    },
    description: {
        type:String,
        required:true,
        trim: true
    },
    genre:{
        type:String,
        required:true,
        enum: ['fantasia', 'policial', 'manga', 'cientifico', 'novela', 'terror', 'otros'],
        trim: true
    },
    publisher: {
        type:String,
        required:true,
        trim: true
    },
    stock: {
        type:Number,
        required:true,
        min: 0,
        default:0
    },
    images: [
        {
            type:String,
            required:true,
        
        }
    ]

},{
    timestamps:true
});

/* //VALIDACION : QUE MINIMO ME PIDA 1 IMAGEN Y MAXIMO HASTA 3 IMAGENES
productSchema.path('images').validate(function(value){
    return value.length >= 1 && value.length <= 3;
}, 'Debe haber entre 1 y 3 imagenes') */

module.exports = mongoose.model('Product', productSchema);