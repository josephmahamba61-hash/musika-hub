import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'List supplier directory and company profiles.' })
})

router.get('/:id', (req, res) => {
  res.json({ message: `Supplier profile ${req.params.id} ready.` })
})

export default router
