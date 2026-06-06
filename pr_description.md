🧹 [code health improvement description] Replace 'any' with 'unknown' in MetaPRPDesigner

🎯 **What:** The code health issue addressed was the use of the `any` type in the `filter` function parameter in `components/MetaPRPDesigner.tsx`.
💡 **Why:** This improves maintainability and type safety. It ensures the type is completely unknown and only allows accessing its properties after explicit validation with type guards and casting.
✅ **Verification:** I confirmed the change is safe by running the `vitest` tests (`bun x vitest run`), which continue to pass, verifying there are no functionality regressions.
✨ **Result:** The codebase is now safer by explicitly forcing the developer to perform type checking.
