#include <napi.h>
#include "audio_utils.hpp"

std::span<const float> convert_buffer(const Napi::Buffer<std::uint8_t>& u_buffer) {
  const auto* data_ptr{reinterpret_cast<const float*>(u_buffer.Data())};
  std::size_t count{u_buffer.ByteLength() / sizeof(float)};
  
  return std::span<const float>(data_ptr, count);
}

static Napi::Value ApplyGain(const Napi::CallbackInfo& info) {
  auto env{info.Env()};

  if (info.Length() < 2 || !info[0].IsBuffer() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Expected (Buffer, Number)").ThrowAsJavaScriptException();
    return env.Null();
  }

  const auto u_buffer{info[0].As<Napi::Buffer<std::uint8_t>>()};
  const auto gain{info[1].As<Napi::Number>().FloatValue()};

  const auto buffer{convert_buffer(u_buffer)};
  auto result{AudioUtils::apply_gain(buffer, gain)};

  return Napi::Buffer<float>::New(env, result.data(), result.size());
}

static Napi::Value Reverse(const Napi::CallbackInfo& info) {
  auto env{info.Env()};

  if (info.Length() < 1 || !info[0].IsBuffer()) {
    Napi::TypeError::New(env, "Expected (Buffer)").ThrowAsJavaScriptException();
    return env.Null();
  }

  const auto u_buffer{info[0].As<Napi::Buffer<std::uint8_t>>()};
  const auto buffer{convert_buffer(u_buffer)};

  auto result{AudioUtils::reverse(buffer)};
  return Napi::Buffer<float>::New(env, result.data(), result.size());
}

static Napi::Value Analyze(const Napi::CallbackInfo& info) {
  auto env{info.Env()};

  if (info.Length() < 1 || !info[0].IsBuffer()) {
    Napi::TypeError::New(env, "Expected (Buffer)").ThrowAsJavaScriptException();
    return env.Null();
  }

  const auto u_buffer{info[0].As<Napi::Buffer<std::uint8_t>>()};
  const auto buffer{convert_buffer(u_buffer)};

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