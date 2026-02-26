import { render, screen } from '@testing-library/react';
import App from './App';

test('renders registration screen', () => {
  render(<App />);
  expect(screen.getByText(/register to play/i)).toBeInTheDocument();
});
