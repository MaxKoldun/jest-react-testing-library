/* eslint-disable testing-library/await-async-query */
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from './components/Profile';
import Loader from './components/Loader';
import ErrorHandler from './components/ErrorHandler';
import App from './App.js';
import useFetch from './hooks/useFetch';
import mockUser from './__mocks__/user';

const mockFetchData = jest.fn();
const mockError = new Error('User is not found');

jest.mock('./hooks/useFetch.js', () => jest.fn());

describe('Test App.js', () => {
    beforeEach(() => {
        useFetch.mockImplementation(() => ({
            response  : null,
            error     : null,
            loading   : false,
            fetchData : mockFetchData
        }));
    });

    it('Should render a Profile component', async () => {
        useFetch.mockImplementation(() => ({ response: mockUser }));
        render(<App />);
        const { title, first, last } = mockUser.results[0].name;
        const name = `${title} ${first} ${last}`;
        const img = await screen.findByAltText(name);

        expect(await screen.findByText(name)).toBeInTheDocument();
        expect(img.src).toBe( mockUser.results[0].picture.large);
    });

    it('Should trigger fetchData if loading is false', () => {
        render(<App />);

        fireEvent.click(screen.getByText('Fetch'));

        expect(mockFetchData).toHaveBeenCalledTimes(1);
    });

    it('Shouldn\'t trigger fetchData if loading is true', () => {
        useFetch.mockImplementation(() => ({ loading: true }));
        render(<App />);

        fireEvent.click(screen.getByText('Fetch'));

        expect(mockFetchData).toHaveBeenCalledTimes(0);
    });

    it('Should render a Loading component', async () => {
        useFetch.mockImplementation(() => ({ loading: true }));
        render(<App />);

        expect(await screen.findByText('Loading...')).toBeInTheDocument();
    });

    it('Should render a ErrorHandler component', async () => {
        useFetch.mockImplementation(() => ({ error: mockError }));
        render(<App />);

        expect(await screen.findByText(mockError.message)).toBeInTheDocument();
    });
});
