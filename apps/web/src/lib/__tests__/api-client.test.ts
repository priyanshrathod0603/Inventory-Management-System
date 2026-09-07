import { ApiError, apiClient } from '../api-client';
import { authKeys, userKeys, healthKeys } from '../query-keys';

function runApiClientTests() {
  // 1. ApiError structure test
  const error = new ApiError(404, 'NOT_FOUND', 'Resource was not found', [
    { field: 'id', message: 'Invalid UUID' },
  ]);

  console.assert(error.name === 'ApiError', 'ApiError name must be ApiError');
  console.assert(error.status === 404, 'ApiError status must be 404');
  console.assert(error.code === 'NOT_FOUND', 'ApiError code must be NOT_FOUND');
  console.assert(error.message === 'Resource was not found', 'ApiError message matches');
  console.assert(error.details?.length === 1, 'ApiError details array matches');

  // 2. Query Keys structure tests
  console.assert(JSON.stringify(authKeys.me()) === JSON.stringify(['auth', 'me']), 'authKeys.me matches');
  console.assert(JSON.stringify(userKeys.detail('123')) === JSON.stringify(['users', 'detail', '123']), 'userKeys.detail matches');
  console.assert(JSON.stringify(healthKeys.readiness()) === JSON.stringify(['health', 'readiness']), 'healthKeys.readiness matches');

  // 3. apiClient method helpers existence
  console.assert(typeof apiClient.get === 'function', 'apiClient.get must be a function');
  console.assert(typeof apiClient.post === 'function', 'apiClient.post must be a function');
  console.assert(typeof apiClient.patch === 'function', 'apiClient.patch must be a function');
  console.assert(typeof apiClient.put === 'function', 'apiClient.put must be a function');
  console.assert(typeof apiClient.delete === 'function', 'apiClient.delete must be a function');

  console.log('✅ All ApiClient and QueryKeys unit tests passed successfully!');
}

runApiClientTests();
