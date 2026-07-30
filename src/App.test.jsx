import { render, screen } from '@testing-library/react'
import App from './App'

test('renders Som Energia heading', () => {
  render(<App />)
  const logo = screen.getByAltText(/Cuca de Som Energia/i)
  expect(logo).toBeInTheDocument()
})
