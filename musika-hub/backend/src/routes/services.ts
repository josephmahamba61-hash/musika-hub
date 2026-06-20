import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'List engineering services and view service details.' })
})

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create service endpoint is ready.' })
})

router.put('/:id', (req, res) => {
  res.json({ message: `Update service ${req.params.id} endpoint is ready.` })
})

router.delete('/:id', (req, res) => {
  res.status(204).send()
})

export default router
