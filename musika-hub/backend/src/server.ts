import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import serviceRoutes from './routes/services'
import supplierRoutes from './routes/suppliers'
import messageRoutes from './routes/messages'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/messages', messageRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'musika-hub-api' })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`MUSIKA HUB API running on http://localhost:${port}`)
})
