---
layout: post
title: "Honey Tracker - Offline-First Cross-Platform App (Ionic + React)"
date: 2025-11-05 09:00:00 +1300
last_modified_at: 2025-11-05 09:00:00 +1300
categories: [project, mobile-app, PWA]
tags: [AWS, Ionic, React, TypeScript, PWA, Offline]
author: Nathan Drummond-Schwass
excerpt: "Honey Tracker keeps beekeeper records flowing, even without signal, using Ionic, React, SQLite, and AWS Amplify."
---

## Overview

Honey Tracker is an offline-first field app built with Ionic and React for iOS, Android, and the web. Beekeepers can record hive inspections, pallet movements, batches, and barrels on-site, with everything stored locally in SQLite and synced to AWS Amplify when coverage returns. The interface guides users through poor signal areas, queues any offline changes, and catches up automatically once back online.

![Honey Tracker App Screenshot]({{'/src/images/devhoneyapp.png'}})

## Key Features

- **Reliable syncing**: Offline edits are held safely in a queue, then synced in order when the connection recovers.
- **Cross-platform shell**: Ionic and Capacitor provide barcode scanning, geolocation, haptics, and friendly toast alerts on phones, tablets, and desktop.
- **Account security**: Cognito keeps logins active and forces a logout if a token expires, so only trusted users reach the data.
- **Field-friendly tooling**: A movable debug console and network timeline help testers see what is happening behind the scenes when reception drops.

## Tech Stack

- **Frontend**: Ionic Framework with React, styled with CSS modules and Syncfusion components.
- **Native bridge**: Capacitor 7 with plugins for barcode scanning, network status, haptics, and location.
- **Offline storage**: SQLite via @capacitor-community/sqlite with a web-friendly fallback.
- **Backend**: AWS Amplify Gen 2 using AppSync (GraphQL), DynamoDB, and Cognito.
- **Tooling**: Visual Studio Code, GitHub, TypeScript, ESLint, Vitest, Amplify Backend CLI.

## Architecture

Honey Tracker keeps things simple but dependable:

- **Data layer**: Local services manage pallets, barrels, and batches in SQLite and keep a log of changes.
- **Sync layer**: Offline-capable APIs send updates to Amplify when online and hold them locally when offline.
- **Network layer**: A shared manager watches the connection and only triggers syncs when the signal is stable.
- **Security layer**: Token monitoring checks Cognito sessions and signs out promptly if access is revoked.



## Target Users

Designed specifically for beekeepers who need to:
- Log hive inspections and pallet movements in remote apiaries
- Track honey production, barrel status, and batch provenance for compliance
- Manage multiple apiary locations with shared teams and devices
- Continue operations without reliable cellular coverage, then sync when service returns
- Gain operational visibility across devices (mobile, tablet, desktop) with consistent data
