#pragma once
#include <kfr/base.hpp>
#include <span>

namespace AudioUtils {
  struct Statistics {
    float peak_amplitude{};
    float rms_energy{};
    bool is_clipped{};
  };

  kfr::univector<kfr::f32> apply_gain(std::span<float> buffer, float gain);

  kfr::univector<kfr::f32> reverse(std::span<float> buffer);

  Statistics analyze(std::span<float> buffer);
}