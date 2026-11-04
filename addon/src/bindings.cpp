#include "audio_utils.hpp"
#include <napi.h>
#include <span>

static Napi::Value ApplyGain(const Napi::CallbackInfo& info) {
  auto env{info.Env()};

  if (info.Length() < 2 || !info[0].IsTypedArray() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Expected (Float32Array, Number)").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto js_array{info[0].As<Napi::Float32Array>()};
  const auto gain{info[1].As<Napi::Number>().FloatValue()};

  const auto buffer{std::span<float>(js_array.Data(), js_array.ElementLength())};
  auto result{AudioUtils::apply_gain(buffer, gain)};

  auto response{Napi::Float32Array::New(env, result.size())};
  std::memcpy(response.Data(), result.data(), result.size() * sizeof(float));

  return response;
}

static Napi::Value Reverse(const Napi::CallbackInfo& info) {
  auto env{info.Env()};

  if (info.Length() < 1 || !info[0].IsTypedArray()) {
    Napi::TypeError::New(env, "Expected (Float32Array)").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto js_array{info[0].As<Napi::Float32Array>()};
  const auto buffer{std::span<float>(js_array.Data(), js_array.ElementLength())};

  auto result{AudioUtils::reverse(buffer)};
  auto response{Napi::Float32Array::New(env, result.size())};

  std::memcpy(response.Data(), result.data(), result.size() * sizeof(float));
  return response;
}

static Napi::Value Analyze(const Napi::CallbackInfo& info) {
  auto env{info.Env()};

  if (info.Length() < 1 || !info[0].IsTypedArray()) {
    Napi::TypeError::New(env, "Expected (Float32Array)").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto js_array{info[0].As<Napi::Float32Array>()};
  const auto buffer{std::span<float>(js_array.Data(), js_array.ElementLength())};

  auto [peak_amplitude, rms_energy, is_clipped]{AudioUtils::analyze(buffer)};

  auto statistics{Napi::Object::New(env)};
  statistics.Set("peakAmplitude", peak_amplitude);
  statistics.Set("rmsEnergy", rms_energy);
  statistics.Set("isClipped", is_clipped);

  return statistics;
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("applyGain", Napi::Function::New(env, ApplyGain));
  exports.Set("reverse", Napi::Function::New(env, Reverse));
  exports.Set("analyze", Napi::Function::New(env, Analyze));

  return exports;
}

NODE_API_MODULE(native_module, Init);