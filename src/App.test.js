import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app without crashing', () => {
    render(<App />);
    // Check that the navigation component is rendered
    const navigation = document.querySelector('nav');
    expect(navigation).toBeInTheDocument();
});