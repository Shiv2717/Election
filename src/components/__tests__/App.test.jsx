import React from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';

beforeAll(() => {
  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('App Component', () => {
  it('renders the main application title', () => {
    render(<App />);
    const titleElement = screen.getByRole('heading', { name: /The Indian Election Process/i });
    expect(titleElement).toBeDefined();
  });
});
