#include "audio_utils.hpp"
#include <kfr/simd.hpp>

namespace AudioUtils {
  kfr::univector<kfr::f32> apply_gain(std::span<const float> buffer, float gain) {
    const auto view{kfr::make_univector(buffer)};
    
    kfr::univector<float> output(buffer.size());
    output = view * gain;

    return output;
  }

  kfr::univector<kfr::f32> reverse(std::span<const float> buffer) {}

  Statistics analyze(std::span<const float> buffer) {}
}