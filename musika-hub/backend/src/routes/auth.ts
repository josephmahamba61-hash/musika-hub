import { Router } from 'express'

const router = Router()

router.post('/register', (req, res) => {
  res.status(201).json({ message: 'Register endpoint is ready.' })
})

router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login endpoint is ready.' })
})

router.post('/forgot-password', (req, res) => {
  res.status(200).json({ message: 'Forgot password endpoint is ready.' })
})

export default router
