// server.js
const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware')

const printBody = proxyRes => {
  return new Promise((resolve, reject) => {
    let body = []
    proxyRes.on('data', function (chunk) {
      body.push(chunk)
    })
    proxyRes.on('end', function () {
      body = Buffer.concat(body).toString()
      console.log('[DEBUG]body:', body)
    })
  })
}

const devProxy = {
  '/api': {
    onProxyReq: (proxyReq, req, res) => {
      // console.log('[DEBUG]proxyReq:', res)
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('[DEBUG]proxyRes:', req.url)
      printBody(proxyRes)
    },
    onError: (err, req, res) => {
      console.log('[DEBUG]Error: ', err)
    },
    target: 'https://telehire.cn/',
    changeOrigin: true
  }
}

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dev
})
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()

    if (dev && devProxy) {
      Object.keys(devProxy).forEach(function (context) {
        server.use(createProxyMiddleware(context, devProxy[context]))
      })
    }

    server.all('*', (req, res) => {
      handle(req, res)
    })

    server.listen(port, err => {
      if (err) {
        throw err
      }
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.log(err)
  })
