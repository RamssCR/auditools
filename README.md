# Auditools

![Status: Official](https://img.shields.io/badge/status-v1.0.0-purple?style=flat)

---

Auditools is a set of endpoints designed to manipulate WAV audio samples using C++ and the KFR
library to achieve such purpose, and connecting it to Node.js via the `node-addon-api` dependency.

## Index
- [Installation](#installation)
- [Why C++?](#why-c)
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

> [!NOTE]
> The project comes with a `.vscode` folder with a configuration to disable automatic CMake compilation after
> saving changes (in case you're using VSC). The compilation process must be done via `cmake-js` so it can inject
> its internal variables to our project.

4. Add the environment variables needed to run the project. You can guide yourself with the `.env.example` file.

> [!NOTE]
> All environment variables are loaded with a default value, including the one for the addon name.
> One variable that can be modified is THROTTLE_MB_PER_SECOND so it returns buffer responses with more MB per second.

5. Run the project in development mode.
```BASH
npm run dev
```

## Why C++?
Audio management is a heavy process overall, manipulating an array of millions of elements
via basic operations like using `for` loops takes multiple CPU cycles, specially if a song
is megabytes heavier.

Node.js has Worker Threads, yes, and while they're good for offloading CPU-heavy JSON
parsing, cryptography or asynchronous I/O tasks away from the main event loop, they can fall
short when it comes to high-throughput audio streams.

- Even inside a Worker Thread, JavaScript code is still executed by the V8 engine, its JIT
  compiler handles dynamic types, garbage collection and object tracking. In an audio pipeline
  where you're iterating over millions of floating-point samples sequentially. JS loops incur
  massive overhead compared to statically typed machine code.
- Modern CPUs have vector registers that can perform math operations on 4, 8 or 16 numbers
  simultaneously in a single clock cycle. While JS has some basic `SIMD` proposals or typed
  array optimization, they pale in comparison to a C++ library like **KFR**.
- Passing a 30MB buffer to a Worker Thread either requires structured cloning (which serializes
  and copies 30MB of memory, killing performance) or managing a `SharedArrayBuffer` with complex
  mutex locks. Even with shared memory, you're still processing those bytes using JS math loops.

By using C++ via `node-addon-api`, the pipeline gets the best of both worlds:

- **Zero-Copy Architecture**: By using a `Float32Array` data type, the Node.js layer doesn't copy
  data into C++, it hands a direct pointer (`Napi::Float32Array::Data()`) to the underlying buffer.
  C++ reads and writes directly to that memory instantaneously.
- **Hardware Acceleration**: KFR takes full advantage of the host CPU's vector extensions, executing
  gain adjustments, reversals and telemetry - to give some examples - passes across massive arrays
  at hardware speeds.
- **Predictable Performance**: By avoiding V8 Garbage Collector pauses during the math cycles, the
  web service (at least in Fastify) achieves **118ms to 130ms execution time** for a 30MB audio file
  while computing telemetry like peak amplitudes.

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