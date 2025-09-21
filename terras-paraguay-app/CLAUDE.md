# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based white-label real estate application specifically configured for "Terras Paraguay" - a company specializing in Paraguay real estate for Brazilian investors. The application is built using Create React App and showcases properties including houses, apartments, farms, ranches, and land.

## Build and Development Commands

- **Start Development Server**: `npm start` - Runs on http://localhost:3000
- **Build for Production**: `npm run build` - Creates optimized production build in `build/` folder
- **Run Tests**: `npm test` - Launches test runner in interactive watch mode
- **Eject Configuration**: `npm run eject` (irreversible - avoid unless necessary)

## Architecture and Key Components

### Main Application Files

- `src/App.js` - Main application component with multi-tenant support and property listing functionality
- `src/App-TerrasParaguay.js` - Specialized version specifically for Terras Paraguay branding
- `src/data/terrasParaguayData.js` - Contains Paraguay-specific property data and configuration
- `src/components/SearchSystem.js` - Search and filtering component

### Multi-Tenant Architecture

The application supports multiple real estate agencies through a tenant system:
- **Terras no Paraguay** (Paraguay focus) - Green theme, USD pricing, Portuguese/Spanish
- **Imobiliária Santos** (Brazil focus) - Blue theme, BRL pricing
- **Demo Imobiliária** (Demo) - Purple theme

Configuration is managed via `tenantConfig` object in App.js containing:
- Colors (primary, secondary, accent)
- Country/flag information
- Contact details (phone, WhatsApp, email)
- Currency formatting preferences

### Property Data Structure

Properties include comprehensive information:
- Basic details (price, location, area, rooms, bathrooms, parking)
- Property type (house, apartment, duplex, farm, ranch, land)
- Rating and review system
- Image galleries with carousel functionality
- Financing options and bank partnerships
- Realtor contact information
- Property features and neighborhood details

### Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS classes
- **Property Search**: Text search across title, location, and tags
- **Advanced Filtering**: By property type, purpose, price range, location
- **Property Modal**: Full-screen property details with image carousel, tabs (details/map/financing)
- **WhatsApp Integration**: Direct contact with realtors via WhatsApp
- **SEO Optimization**: Structured data and meta tags for search engines
- **Multi-currency Support**: USD/PYG for Paraguay, BRL for Brazil

## Styling Approach

- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **Dynamic Theming**: CSS-in-JS approach using style props for tenant-specific colors
- **Gradient Backgrounds**: Extensive use of gradients for premium look

## Data Management

- **Static Data**: Property information stored in JavaScript files
- **State Management**: React hooks (useState, useEffect) for component state
- **No External APIs**: Currently uses mock data, can be extended for API integration

## Contact and Communication

- **Multi-language Support**: Portuguese, Spanish, English, Guaraní
- **WhatsApp Integration**: Primary contact method with property-specific messaging
- **Phone Integration**: Click-to-call functionality
- **Email Contact**: Secondary contact method

## Paraguay-Specific Features

When working on Paraguay-focused functionality:
- Currency display shows both USD and Guaraní (PYG)
- Property types include farms/ranches with hectare measurements
- Financing options include local Paraguay banks
- Cultural elements (flag, language preferences)
- Investment benefits section highlighting Paraguay advantages

## Development Notes

- The codebase contains duplicate React imports in some files - clean up when editing
- Property images use Unsplash URLs - replace with actual property photos in production
- WhatsApp phone numbers should be properly formatted (remove spaces/special chars)
- Consider implementing proper error boundaries for production use
- The application is designed for easy white-labeling - tenant switching is seamless

## Testing

Uses standard Create React App testing setup with:
- Jest test runner
- React Testing Library
- Test files should follow `*.test.js` pattern