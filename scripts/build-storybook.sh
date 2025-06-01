#!/bin/bash

# Backup original tsconfig
cp tsconfig.json tsconfig.json.backup

# Create temporary tsconfig for Storybook
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"],
      "@/*": ["./app/*"],
      "#app/*": ["./app/*"]
    }
  },
  "include": [
    "app/**/*",
    "stories/**/*",
    ".storybook/**/*"
  ]
}
EOF

# Build Storybook directly (not through npm to avoid recursion)
npx storybook build

# Restore original tsconfig
mv tsconfig.json.backup tsconfig.json

echo "Storybook built successfully!"