---
layout: post
title: "Honey Tracker - Offline-First Cross-Platform App (Ionic + React)"
date: 2025-8-25 10:00:00 +1200
categories: [project, mobile-app, PWA]
tags: [AWS, Ionic, JavaScript, TypeScript, PWA]
author: Nathan Drummond-Schwass
excerpt: "An offline-first cross-platform application for beekeepers with resilient data synchronisation capabilities, built with Ionic Framework and React."
---

## Overview

This project is an offline-first, cross-platform application for beekeepers, built with Ionic Framework and React for iOS, Android, and web. It lets users log hive inspections and production data in remote apiaries by storing information locally and automatically synchronising with a secure AWS Amplify (Gen 2) backend when connectivity is restored, providing resilient data sync and multi-device access.

![Honey Tracker App Screenshot]({{ '/src/images/devhoneyapp.png'}})




##  Key Features

- **Offline-First Design**: Continue working without internet connection
- **Data Synchronisation**: Automatic sync when connectivity returns
- **Cross-Platform**: Built with Ionic Framework and React for iOS, Android and Web
- **Cloud Integration**: Uses AWS Amplify (Gen 2) for backend services — authentication, APIs (GraphQL/REST), and hosting
- **Secure**: End-to-end encryption for data protection

## Tech Stack

- **Frontend**: Ionic Framework + React, JavaScript/TypeScript
- **Backend**: AWS Amplify (Gen 2) — Authentication (Cognito), GraphQL/REST APIs, and Hosting
- **Database**: Amazon DynamoDB (accessed via Amplify APIs)
- **Authentication**: Amazon Cognito (via Amplify Auth)
- **Development**: Visual Studio Code, GitHub

## Architecture

The application follows a modern offline-first architecture pattern, ensuring beekeepers can record critical hive inspection data even in remote locations with limited connectivity. Data is stored locally using browser storage mechanisms and automatically synchronised with the cloud backend when an internet connection becomes available.

## Target Users

Designed specifically for beekeepers who need to:
- Log hive inspections in remote apiaries
- Track honey production and hive health
- Manage multiple hive locations
- Access data across multiple devices
- Work reliably without constant internet connectivity
