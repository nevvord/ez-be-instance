#!/bin/bash

# Create temporary schema file
cat > prisma/schema.prisma.combined << EOL
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

EOL

# Append all model files
cat prisma/models/*.prisma >> prisma/schema.prisma.combined

# Update package.json to use the combined schema
sed -i 's/"schema": ".\/prisma\/schema.prisma"/"schema": ".\/prisma\/schema.prisma.combined"/g' package.json

echo "Combined schema created at prisma/schema.prisma.combined"
echo "package.json updated to use the combined schema" 