#!/bin/bash

# Restore package.json to use the original schema
sed -i 's/"schema": ".\/prisma\/schema.prisma.combined"/"schema": ".\/prisma\/schema.prisma"/g' package.json

# Clean up combined schema file if it exists
if [ -f "prisma/schema.prisma.combined" ]; then
  rm prisma/schema.prisma.combined
  echo "Removed combined schema file"
fi

echo "package.json restored to use the original schema" 