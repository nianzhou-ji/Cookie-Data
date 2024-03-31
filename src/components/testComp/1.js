// 原始的SRT字幕字符串
const originalSubtitles = `
system_info: n_threads = 8 / 12 | AVX = 0 | AVX2 = 0 | AVX512 = 0 | FMA = 0 | NEON = 0 | ARM_FMA = 0 | METAL = 0 | F16C = 0 | FP16_VA = 0 | WASM_SIMD = 1 | BLAS = 0 | SSE3 = 0 | SSSE3 = 0 | VSX = 0 | CUDA = 0 | COREML = 0 | OPENVINO = 0
operator(): processing 432000 samples, 27.0 sec, 8 threads, 1 processors, lang = en, task = transcribe ...
[00:00:00.000 --> 00:00:03.420] What's wrong with writing questions?
[00:00:03.420 --> 00:00:05.920] Well, they told us only about that.
[00:00:05.920 --> 00:00:13.560] Specifically, the formula popped off the Eiffel page.
[00:00:13.560 --> 00:00:20.700] MyM Dino home in a gsuspze method is called X conscious data.
[00:00:20.700 --> 00:00:23.800] I also have an actual version of X.
[00:00:23.800 --> 00:00:25.380] The X- logging becomes a product called X video.
[00:00:25.380 --> 00:00:27.380] I call X, Y or X.
`;

// 将原始字幕按行分割，然后处理每一行
const lines = originalSubtitles.trim().split('\n');
let output = '';
let counter = 1; // 用于序号计数

lines.forEach((line, index) => {
    // 使用正则表达式解析时间和字幕文本
    const match = line.match(/\[(.*?)\] (.*)/);
    if (match) {
        const [_, time, text] = match;
        // 转换时间格式
        const newTime = time.replace(/\./g, ',').replace(/ --> /g, ' --> ');
        // 组合新的字幕格式
        output += `${counter}\n${newTime}\n${text}\n\n`;
        counter++;
    }
});

// 打印转换后的字幕
console.log(output);