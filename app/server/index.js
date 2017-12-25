const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors')
const error = require('koa-json-error')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db.json')
const db = low(adapter)
const request = require('request-promise')

// Set some defaults
db.defaults({ sources: [], sentences: [] }).write()

const app = new Koa()


app.context.db = db

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

const getDataFromClassifier = (sentences) => {
    return Promise.all(
        sentences.map(
            one => {
                return request({
                    url: 'http://localhost:3011',
                    method: 'post',
                    headers: {
                        'Content-type': 'text/plain'
                    },
                    body: one
                })
                    .then(response => {
                        return Promise.resolve({
                            sentence: one,
                            emotion: response
                        })
                    })
            }
        )
    )
}

router.post('/api/classify', async (ctx) => {
    if (!ctx.request.body.text) {
        ctx.throw(400, 'Invalid request.');
    }

    const text = ctx.request.body.text

    const sentences = text.split('.')
        .filter(item => /[a-zA-Z]+/i.test(item))
        .map(
            item => {
                while (/^\s/i.test(item)) {
                   item = item.substr(1)
                }
                item += '. '
                return item
            }
        )

    const data = await getDataFromClassifier(sentences)

    ctx.body = {
        status: 'success',
        message: '',
        data: data
    }
})

router.post('/api/sentence', async (ctx) => {
    console.log('call nn python server')
    /* ctx.body = {
        status: 'success',
        message: '',
        data: sentences[Math.trunc(Math.random() * sentences.length)]
    } */
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

app.use(error())
app.use(cors())
app.use(bodyParser())
app.use(router.routes())

app.listen(3080, () => {
    console.log("Listen 3080!")
});