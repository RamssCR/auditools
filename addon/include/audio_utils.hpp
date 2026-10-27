#pragma once
#include <kfr/base.hpp>
#include <span>

namespace AudioUtils {
  struct Statistics {
    double peak_amplitude{};
    double rms_energy{};
    bool is_clipped{};
  };

  kfr::univector<kfr::f32> apply_gain(std::span<const float> buffer, float gain);

  kfr::univector<kfr::f32> reverse(std::span<const float> buffer);

  Statistics analyze(std::span<const float> buffer);
}