import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { ApiService } from './services/api';

// Mock the API service
jest.mock('./services/api');

describe('App Component', () => {
  const mockData = [
    { id: 1, title: 'Test Title', description: 'Test Description' }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('React Backend Integration Example')).toBeInTheDocument();
  });

  it('loads and displays data from the API', async () => {
    // Mock successful API response
    (ApiService.getData as jest.Mock).mockResolvedValueOnce({
      data: mockData,
      status: 200
    });

    render(<App />);

    // Check loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    // Mock API error
    (ApiService.getData as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch data')
    );

    render(<App />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
    });
  });

  it('submits new item form', async () => {
    const newItem = {
      id: 2,
      title: 'New Title',
      description: 'New Description'
    };

    // Mock successful API responses
    (ApiService.getData as jest.Mock).mockResolvedValueOnce({
      data: [],
      status: 200
    });
    (ApiService.createData as jest.Mock).mockResolvedValueOnce({
      data: newItem,
      status: 201
    });

    render(<App />);

    // Fill in the form
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionInput = screen.getByPlaceholderText('Description');
    const submitButton = screen.getByText('Add Item');

    await userEvent.type(titleInput, 'New Title');
    await userEvent.type(descriptionInput, 'New Description');
    await userEvent.click(submitButton);

    // Verify API call
    expect(ApiService.createData).toHaveBeenCalledWith({
      title: 'New Title',
      description: 'New Description'
    });

    // Verify new item appears in the list
    await waitFor(() => {
      expect(screen.getByText('New Title')).toBeInTheDocument();
      expect(screen.getByText('New Description')).toBeInTheDocument();
    });
  });

  it('clears form after successful submission', async () => {
    // Mock successful API responses
    (ApiService.getData as jest.Mock).mockResolvedValueOnce({
      data: [],
      status: 200
    });
    (ApiService.createData as jest.Mock).mockResolvedValueOnce({
      data: { id: 1, title: 'New Title', description: 'New Description' },
      status: 201
    });

    render(<App />);

    // Fill in and submit the form
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionInput = screen.getByPlaceholderText('Description');
    const submitButton = screen.getByText('Add Item');

    await userEvent.type(titleInput, 'New Title');
    await userEvent.type(descriptionInput, 'New Description');
    await userEvent.click(submitButton);

    // Verify form is cleared
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });
});
