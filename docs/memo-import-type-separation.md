# Import type separation

Always separate value imports from type imports:

- Use `import { ... }` for values (functions, components, etc.)
- Use `import type { ... }` for types only

When both values and types are imported from the same module, use two separate statements:

```ts
// ✓ Good
import { accept, reject } from "../helpers/errorHandling";
import type { Result, SomeReason } from "../helpers/errorHandling";

// ✗ Avoid – mixing type and value in same import
import { accept, type Result, reject } from "../helpers/errorHandling";
```
