import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UsePhredditContext } from './src/components/phredditContext';
import TopBanner from './src/components/topbanner';

// Mock UsePhredditContext
jest.mock('./src/components/phredditContext', () => ({
  UsePhredditContext: jest.fn(),
}));

describe('Create Post button', () => {
  test('is disabled for guest users and enabled for registered users', () => {
    // Mock context for guest user
    UsePhredditContext.mockReturnValue({
      loadPage: jest.fn(),
      currentPage: 'home',
      user: null,
      setUser: jest.fn(),
      setSelectedUser: jest.fn(),
      setSelectedPost: jest.fn(),
    });

    // Render component for guest user and destructure rerender
    const { rerender } = render(<TopBanner />);
    let createPostButton = screen.getByRole('button', { name: /create post/i });
    expect(createPostButton).toBeDisabled();

    // Mock context for registered user
    UsePhredditContext.mockReturnValue({
      loadPage: jest.fn(),
      currentPage: 'homepage',
      user: { displayName: 'TestUser' },
      setUser: jest.fn(),
      setSelectedUser: jest.fn(),
      setSelectedPost: jest.fn(),
    });

    // Re-render component for registered user
    rerender(<TopBanner />);
    createPostButton = screen.getByRole('button', { name: /create post/i });
    expect(createPostButton).toBeEnabled();
  });
});