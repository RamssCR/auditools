# Auditools

![Status: Official](https://img.shields.io/badge/status-v1.0.0-purple?style=flat)

---

Auditools is a set of endpoints designed to manipulate WAV audio samples using
C++ and KFR to achieve such purpose, and connecting it to Node.js via the
`node-addon-api` dependency.

## Index
- [Installation](#installation)
- [Endpoints](#endpoints)

## Installation
Before installing the project, make sure to have the following programs installed:
- **Node.js** (v24 or higher)
- **CMake** (v3.25 or higher)
- **C++ Compiler** with C++20 support:
  - **Windows**: Visual Studio (MSVC) with C++ workload
  - **Linux**: `g++` (GCC 13 or higher) or `clang`
  - **macOS**: Xcode Command Line Tools

1. Clone the repository from GitHub.
```BASH
git clone git@github.com:RamssCR/auditools.git
```

2. Install the dependencies for the Node.js Web Service.
```BASH
npm install
```

3. Compile the native Node.js addon via `cmake-js`.
```BASH
npm run addon:compile
```

4. Add the environment variables needed to run the project. You can guide yourself with the `.env.example` file.

> [!NOTE]
> All environment variables are loaded with a default value, including the one for the addon name.
> One variable that can be modified is THROTTLE_MB_PER_SECOND so it returns buffer responses with more MB per second.

5. Run the project in development mode.
```BASH
npm run dev
```

## Endpoints
> [!NOTE]
> All endpoints here require the audio to be sent via form data and to be of WAV format.

### `/v1/audio/scale`
Applies gain to an audio buffer (raises or lowers its volume) and returns it back to the client.
The gain factor must be sent via headers as `x-gain-factor` as a decimal value.

The response here is of type `audio/wav`.

### `/v1/audio/reverse`
Reverses an audio content and returns it back to the client.

The response here is of type `audio/wav`.

### `/v1/audio/analyze`
Analyzes an audio's statistics like peak amplitude, RMS energy or if it's clipping.

Here's a response sample:
```JSON
{
  "success": true,
  "message": "Audio telemetry and statistics generated successfully",
  "data": {
    "peakAmplitude": 1,
    "rmsEnergy": 0.1831476390361786,
    "isClipped": true
  }
}
```