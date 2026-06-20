import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Fetch conversations and messages.' })
})

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Send message endpoint is ready.' })
})

export default router
