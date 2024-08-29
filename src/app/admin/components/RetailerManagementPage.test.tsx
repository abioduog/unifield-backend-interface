import { render, screen } from '@testing-library/react';
import RetailerManagementPage from './RetailerManagementPage';

test('renders retailer management page', () => {
  render(<RetailerManagementPage />);
  const titleElement = screen.getByText(/Retailer Management/i);
  expect(titleElement).toBeInTheDocument();
});