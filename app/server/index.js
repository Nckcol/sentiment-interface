const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db.json')
const db = low(adapter)

// Set some defaults
db.defaults({ sources: [], sentences: [] }).write()

const app = new Koa()
const router = new Router()

router.post('/api/source', async (ctx) => {
    // Add a post
    db.get('sources')
        .push({ 
            content: ctx.request.body.content
        })
        .write()
        
    ctx.body = {
        status: 'success',
        message: 'Successfull add source!'
    }
})
const text = require('./sentences.js')
const sentences = text.split('.')


router.get('/api/sentence', async (ctx) => {
    ctx.body = {
        status: 'success',
        message: '',
        data: sentences[Math.trunc(Math.random() * sentences.length)]
    }
})

router.get('/api/source', async (ctx) => {
    // Add a post
    let data = db.get('sources')
        
    ctx.body = {
        status: 'success',
        message: '',
        data: data
    }
})

app.use(cors())
app.use(bodyParser())
app.use(router.routes())

app.listen(3080, () => {
    console.log("Listen 3080!")
});