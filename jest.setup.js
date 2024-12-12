// jest.setup.js
import { configure } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock CSS imports
jest.mock('\.(css|less|scss|sass)$', () => ({}));
configure({ testIdAttribute: 'data-testid' });