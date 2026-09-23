# Changelog

## 0.2.0

### Added

- Support for the new frontend system through `@ruivalim/catalog-cleanup/alpha`. Apps with package discovery pick the plugin up just by installing it, with a page at `/catalog-cleanup` and a sidebar entry.
- Tests.

### Fixed

- A failed delete now shows the error in the confirmation dialog. Before, it was only logged to the browser console and the dialog did nothing.
- The source type-checks again. An internal module re-exported a `LocationsResponse` type that did not exist, which the old build script silently ignored.
- The confirmation dialog no longer puts the focus on the Delete button, so pressing Enter does not delete by accident.

### Changed

- Uses the standard `CatalogApi` instead of a hand-written HTTP client.
- The delete buttons are disabled for users without the catalog's `catalog.location.delete` permission.
- `catalogCleanupViewPermission`, `catalogCleanupDeletePermission` and `catalogCleanupPermissions` are deprecated. Nothing ever checked them.
- Dependencies upgraded to Backstage 1.55. Requires Node.js 22 or 24.
- README rewritten in English.
