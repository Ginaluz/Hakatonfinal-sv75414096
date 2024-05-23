const express = require('express')
const app =  express()
const path = require('path')

app.set('view engine','pug')
app.set('views',path.join(__dirname, 'views'))


app.use(require ('./routes/index.routes'))

app.use(express.static(path.join(__dirname,'../public')))

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,'../public/index.html'));
})


app.listen(3001, ()=>{
    console.log('servidor esperando conexion')

})

