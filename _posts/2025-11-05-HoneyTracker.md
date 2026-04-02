---
layout: post
title: "Honey Tracker - Offline-First Cross-Platform App (Ionic + React)"
date: 2025-11-05 09:00:00 +1300
last_modified_at: 2026-4-01 17:16:05 +1300
categories: [project, mobile-app, PWA]
tags: [AWS, Ionic, React, TypeScript, PWA, Offline]
author: Nathan Drummond-Schwass
excerpt: "Honey Tracker is an offline-first app I built for beekeepers to record inspections and production data anywhere, then sync reliably to AWS when back online."
---

## Overview

Honey Tracker is an offline-first field app I built with Ionic + React for iOS, Android, and web. It helps beekeepers capture critical operations data in remote areas without depending on active internet signal.

Users can record hive inspections, pallet movements, batches, and barrels on-site. Data is saved locally in SQLite first, then synced to AWS Amplify when connectivity returns.

| ![Honey Tracker App Screenshot]({{'/src/images/devhoneyapp.png'}}) |
| :---: |
| *Login page for the Honey Tracker* |

## Why This Project Matters

Beekeeping teams often work in areas with poor or intermittent coverage. Traditional cloud-first workflows break in the field and create data gaps.

Honey Tracker solves this by prioritising reliability:
- Work continues fully offline
- Changes are queued safely and synced in order
- The app clearly communicates connection/sync state to users
- Teams get consistent records across devices once back online

## Key Features

- **Offline-first reliability**
Field updates are written locally and added to a sync queue. Once the network is stable, queued changes are replayed in order.
- **Cross-platform delivery**
Built once with Ionic + React and deployed to iOS, Android, and web, with Capacitor plugins for barcode scanning, geolocation, haptics, and device-native UX.
- **Secure access control**:
AWS Cognito handles authentication and session validity. Expired tokens trigger controlled sign-out to protect operational data.

## Tech Stack

- **Frontend**: Ionic Framework + React (TypeScript), CSS modules, Syncfusion components  
- **Native bridge**: Capacitor 7 (barcode scanning, network status, haptics, location)  
- **Offline storage**: SQLite via `@capacitor-community/sqlite` (with web fallback)  
- **Backend**: AWS Amplify Gen 2, AppSync (GraphQL), DynamoDB, Cognito  
- **Tooling**: VS Code, GitHub, ESLint, Vitest, Amplify Backend CLI

## Architecture Snapshot

Honey Tracker uses a practical layered approach for resilience:

- **Data layer**: Local services manage pallets, barrels, and batches in SQLite, including change tracking
- **Sync layer**: Offline-capable API workflow queues local writes and synchronises when online
- **Network layer**: Shared connectivity manager gates sync execution until network conditions are stable
- **Security layer**: Session/token monitoring validates Cognito auth state and signs users out when required

## Target Users

Designed for beekeepers and field operations teams who need to:

- Log hive inspections and pallet movements in remote apiaries
- Track honey production, barrel status, and batch provenance for compliance
- Coordinate multiple apiary locations with shared teams/devices
- Keep working without reliable cellular service and sync later
- Maintain consistent operational data across mobile, tablet, and desktop

## Project Evolution

- **Early Commits (Planning & Architecture):** 

The project initially focused heavily on documentation (Process Design and Product Requirement Documents) and standing up the core cloud infrastructure. Early issues revolved around configuring the foundational AWS DynamoDB tables for entities like Batches and Drums.
- **Mid-Stage (Core Offline Workflow):** 

Development then shifted towards the crucial offline-first requirements. This phase introduced core item management (creating, updating, and deleting Pallets, Barrels, and Batches) alongside the integration of native device features like the Barcode Scanner. A major focus here was implementing the robust offline storage capabilities and sync logic.
- **Recent Updates (Usability & Expanded Tracking):** 

The newest commits reflect a shift toward improving the beekeeper's daily workflow and expanding the app's scope. Recent additions include detailed "Hive Health" tracking, new "Work Journal" functionalities, enhanced site grouping, UI wireframing/mockups, support for reusable barcodes, and the introduction of Admin Tools.

## My Contribution

I designed and built Honey Tracker as a production-style offline-first workflow, with focus on:
- Reliable local-first data capture
- Deterministic sync behaviour
- Secure authentication/session handling
- Cross-platform consistency for real field usage