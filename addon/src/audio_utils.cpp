#include "audio_utils.hpp"
#include <kfr/simd.hpp>
#include <algorithm>

namespace AudioUtils {
  kfr::univector<kfr::f32> apply_gain(std::span<float> buffer, float gain) {
    const auto view{kfr::make_univector(buffer)};
    
    kfr::univector<float> output(buffer.size());
    output = view * gain;

    return output;
  }

  kfr::univector<kfr::f32> reverse(std::span<float> buffer) {
    kfr::univector<float> output(buffer.size());

    std::copy(buffer.begin(), buffer.end(), output.begin());
    std::ranges::reverse(output);

    return output;
  }

  Statistics analyze(std::span<float> buffer) {
    if (buffer.empty()) return {0.0f, 0.0f, false};

    auto view{kfr::make_univector(buffer)};

    const auto [min_it, max_it]{std::ranges::minmax_element(buffer)};

    const float rms_energy{kfr::rms(view)};
    const auto peak_amplitude{std::max(std::abs(*min_it), std::abs(*max_it))};
    const auto is_clipped{peak_amplitude > 1.0f};

    return {
      .peak_amplitude{peak_amplitude},
      .rms_energy{rms_energy},
      .is_clipped{is_clipped}
    };
  }
}