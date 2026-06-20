import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Get products, search and filter products.' })
})

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create product endpoint is ready.' })
})

router.put('/:id', (req, res) => {
  res.json({ message: `Update product ${req.params.id} endpoint is ready.` })
})

router.delete('/:id', (req, res) => {
  res.status(204).send()
})

export default router
