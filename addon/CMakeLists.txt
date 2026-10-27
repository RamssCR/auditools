cmake_minimum_required(VERSION 4.2)
project(AudioUtils VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(POSITION_INDEPENDENT_CODE ON)

# Library Settings (Core Code)
set(KFR_EXTENDED_OPTIMIZATIONS OFF CACHE BOOL "Enable if your CPU supports AVX-512, keep off for stable builds" FORCE)

include(FetchContent)
FetchContent_Declare(
  kfr
  GIT_REPOSITORY https://github.com/kfrlib/kfr.git
  GIT_TAG        7.0.1
  GIT_SHALLOW    TRUE
)
FetchContent_MakeAvailable(kfr)

add_library(CoreUtils STATIC src/audio_utils.cpp)

target_include_directories(CoreUtils PUBLIC include)
target_link_libraries(CoreUtils PRIVATE kfr)
target_compile_features(CoreUtils PRIVATE cxx_std_20)

# Library Settings (Node-API)
add_compile_definitions(NAPI_VERSION=4)

file(GLOB SOURCE_FILES "./src")

add_library(UtilsBindings SHARED src/bindings.cpp ${CMAKE_JS_SRC})
set_target_properties(UtilsBindings PROPERTIES PREFIX "" SUFFIX ".node")
target_include_directories(UtilsBindings PRIVATE ${CMAKE_JS_INC})
target_link_libraries(UtilsBindings PRIVATE CoreUtils ${CMAKE_JS_LIB})
target_compile_features(UtilsBindings PRIVATE cxx_std_20)

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()
