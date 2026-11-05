# Changelog
All notable updates of this application will be documented in this file.

This project is based on [Keep a Changelog](https://keepachangelog.com/1.0.0/)
and it follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-05
### Added

- Creation of auditools' backend in Node.js using Fastify as HTTP framework.
- Creation of auditools' service in C++ using KFR as DSP framework, including audio reversal, telemetry and gain application.
- Creation of auditools' native addon in C++ and `node-addon-api`.
- Configured audio endpoints to return an `audio/wav` `Content-Type`.