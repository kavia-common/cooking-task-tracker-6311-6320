import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cooking tasks section', () => {
  render(<App />);
  expect(screen.getByText(/Cooking Tasks/i)).toBeInTheDocument();
});
