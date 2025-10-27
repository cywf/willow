import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app without crashing', () => {
    render(<App />);
    // Check that the navigation component is rendered
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
});