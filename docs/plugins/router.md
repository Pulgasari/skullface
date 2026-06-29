# router

The `router` plugin implements a client-side Single Page Application (SPA) routing infrastructure. 

It features dynamic url segment parameter parsing, route state guards, and automated binding synchronization with the native HTML5 browser History API.

## API Reference

### Methods

#### `addRoute(route: Route): void`
Registers a structural navigation path configurations object inside the global router evaluation execution array pool.

#### `Maps(path: string): Promise<void>`
Evaluates the requested string target route layout path, resolves parameters, triggers intercept guards, executes execution callback targets, and updates browser state history structures.

#### `MapsByName(name: string, params?: Record<string, string>): Promise<void>`
Resolves a previously labeled target config entry via its identifier name key, formats dynamic placeholder variables using the provided dictionary data, and executes standard path navigation pipelines.

#### `currentPath(): string`
Returns the absolute structural string path representation representing the current layout viewport display state.

### Interfaces

```typescript
export interface Route {
  name?: string;
  path: string;
  component: (params?: Record<string, string>) => void;
  beforeEnter?: (params?: Record<string, string>) => boolean | Promise<boolean>;
}
```

## Examples

### Dynamic Routing and Parameter Parsing

```typescript
import { router } from '@skullface/plugins/router/frontend.ts';

// Add structural mapping targets matching param variable segment properties
router.addRoute({
  name: 'user-profile',
  path: '/user/:id/profile',
  component: (params) => {
    const userId = params?.id;
    renderUserProfilePage(userId);
  }
});

// Programmatic named navigation with implicit string variable injection
await router.navigateByName('user-profile', { id: '404' });
// Browser URL location updates to: /user/404/profile
```

### Guard Interception Pipelines

```typescript
import { router } from '@skullface/plugins/router/frontend.ts';

router.addRoute({
  path: '/dashboard',
  component: () => renderDashboardView(),
  // Halts evaluation or handles alternate routing steps before calling component pipelines
  beforeEnter: async () => {
    const sessionActive = await checkActiveSessionState();
    if (!sessionActive) {
      await router.navigate('/login');
      return false; // Rejects entry target execution loop
    }
    return true; // Authorizes navigation pipeline resolution
  }
});
```
