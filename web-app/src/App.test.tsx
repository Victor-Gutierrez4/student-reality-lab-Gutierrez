import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-chartjs-2', () => ({
  Line: () => <div role="img" aria-label="Wage trend chart" />,
}));

test('renders the student wage data story', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', {
      name: /are student wages keeping up with inflation/i,
    })
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/ask a question about the wage data/i)).toBeInTheDocument();
  expect(screen.getByText(/nominal wages are up/i)).toBeInTheDocument();
});
