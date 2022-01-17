import mockUser    from '../__mocks__/user';
import useFetch    from './useFetch';
import { renderHook, act } from '@testing-library/react-hooks';
import api from '../singleton/api';

jest.mock('../singleton/api', () => ({ apiClient: { get: jest.fn() } }));

describe('Test hook useFetch', () => {
    beforeEach(() => {
        api.apiClient.get.mockImplementation(() => Promise.resolve(mockUser));
    });

    it('Should fetch a value', async  () => {
        const { result } = renderHook(() => useFetch());

        await act(async () => {
            await result.current.fetchData()
        });

        expect(result.current.response).toBe(mockUser);
    });

    it('Should throw an error during fetching', async () => {
        const mockError = new Error('User is not found');

        api.apiClient.get.mockImplementation(() => Promise.reject(mockError));

        const { result } = renderHook(() => useFetch());

        await act(async () => {
            await result.current.fetchData()
        });
        
        expect(result.current.error).toBe(mockError);
    });
});
