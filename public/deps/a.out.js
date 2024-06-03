var Module = typeof Module !== "undefined" ? Module : {};
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = function (status, toThrow) {
  throw toThrow;
};
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = true;
if (Module["ENVIRONMENT"]) {
  throw new Error(
    "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)"
  );
}
var scriptDirectory = "";
function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}
var read_, readBinary;
var nodeFS;
var nodePath;
if (ENVIRONMENT_IS_NODE) {
  if (!(typeof process === "object" && typeof require === "function"))
    throw new Error(
      "not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)"
    );
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = require("path").dirname(scriptDirectory) + "/";
  } else {
    scriptDirectory = __dirname + "/";
  }
  read_ = function shell_read(filename, binary) {
    if (!nodeFS) nodeFS = require("fs");
    if (!nodePath) nodePath = require("path");
    filename = nodePath["normalize"](filename);
    return nodeFS["readFileSync"](filename, binary ? null : "utf8");
  };
  readBinary = function readBinary(filename) {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };
  if (process["argv"].length > 1) {
    thisProgram = process["argv"][1].replace(/\\/g, "/");
  }
  arguments_ = process["argv"].slice(2);
  if (typeof module !== "undefined") {
    module["exports"] = Module;
  }
//   process["on"]("uncaughtException", function (ex) {
//     if (!(ex instanceof ExitStatus)) {
//       throw ex;
//     }
//   });
//   process["on"]("unhandledRejection", abort);
  quit_ = function (status) {
    process["exit"](status);
  };
  Module["inspect"] = function () {
    return "[Emscripten Module object]";
  };
} else {
  throw new Error("environment detection error");
}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
moduleOverrides = null;
if (Module["arguments"]) arguments_ = Module["arguments"];
if (!Object.getOwnPropertyDescriptor(Module, "arguments"))
  Object.defineProperty(Module, "arguments", {
    configurable: true,
    get: function () {
      abort("Module.arguments has been replaced with plain arguments_");
    },
  });
if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
if (!Object.getOwnPropertyDescriptor(Module, "thisProgram"))
  Object.defineProperty(Module, "thisProgram", {
    configurable: true,
    get: function () {
      abort("Module.thisProgram has been replaced with plain thisProgram");
    },
  });
if (Module["quit"]) quit_ = Module["quit"];
if (!Object.getOwnPropertyDescriptor(Module, "quit"))
  Object.defineProperty(Module, "quit", {
    configurable: true,
    get: function () {
      abort("Module.quit has been replaced with plain quit_");
    },
  });
assert(
  typeof Module["memoryInitializerPrefixURL"] === "undefined",
  "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"
);
assert(
  typeof Module["pthreadMainPrefixURL"] === "undefined",
  "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"
);
assert(
  typeof Module["cdInitializerPrefixURL"] === "undefined",
  "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"
);
assert(
  typeof Module["filePackagePrefixURL"] === "undefined",
  "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"
);
assert(
  typeof Module["read"] === "undefined",
  "Module.read option was removed (modify read_ in JS)"
);
assert(
  typeof Module["readAsync"] === "undefined",
  "Module.readAsync option was removed (modify readAsync in JS)"
);
assert(
  typeof Module["readBinary"] === "undefined",
  "Module.readBinary option was removed (modify readBinary in JS)"
);
assert(
  typeof Module["setWindowTitle"] === "undefined",
  "Module.setWindowTitle option was removed (modify setWindowTitle in JS)"
);
assert(
  typeof Module["TOTAL_MEMORY"] === "undefined",
  "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"
);
if (!Object.getOwnPropertyDescriptor(Module, "read"))
  Object.defineProperty(Module, "read", {
    configurable: true,
    get: function () {
      abort("Module.read has been replaced with plain read_");
    },
  });
if (!Object.getOwnPropertyDescriptor(Module, "readAsync"))
  Object.defineProperty(Module, "readAsync", {
    configurable: true,
    get: function () {
      abort("Module.readAsync has been replaced with plain readAsync");
    },
  });
if (!Object.getOwnPropertyDescriptor(Module, "readBinary"))
  Object.defineProperty(Module, "readBinary", {
    configurable: true,
    get: function () {
      abort("Module.readBinary has been replaced with plain readBinary");
    },
  });
var stackSave;
var stackRestore;
var stackAlloc;
stackSave = stackRestore = stackAlloc = function () {
  abort(
    "cannot use the stack before compiled code is ready to run, and has provided stack access"
  );
};
function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
if (!Object.getOwnPropertyDescriptor(Module, "wasmBinary"))
  Object.defineProperty(Module, "wasmBinary", {
    configurable: true,
    get: function () {
      abort("Module.wasmBinary has been replaced with plain wasmBinary");
    },
  });
var noExitRuntime;
if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
if (!Object.getOwnPropertyDescriptor(Module, "noExitRuntime"))
  Object.defineProperty(Module, "noExitRuntime", {
    configurable: true,
    get: function () {
      abort("Module.noExitRuntime has been replaced with plain noExitRuntime");
    },
  });
if (typeof WebAssembly !== "object") {
  abort(
    "No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead."
  );
}
var wasmMemory;
var wasmTable = new WebAssembly.Table({
  initial: 1,
  maximum: 1 + 0,
  element: "anyfunc",
});
var ABORT = false;
var EXITSTATUS = 0;
function assert(condition, text) {
  if (!condition) {
    abort("Assertion failed: " + text);
  }
}
function getCFunc(ident) {
  var func = Module["_" + ident];
  assert(
    func,
    "Cannot call unknown function " + ident + ", make sure it is exported"
  );
  return func;
}
function ccall(ident, returnType, argTypes, args, opts) {
  var toC = {
    string: function (str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    array: function (arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    },
  };
  function convertReturnValue(ret) {
    if (returnType === "string") return UTF8ToString(ret);
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== "array", 'Return type should not be "array".');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}
function cwrap(ident, returnType, argTypes, opts) {
  return function () {
    return ccall(ident, returnType, argTypes, arguments, opts);
  };
}
var UTF8Decoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var str = "";
    while (idx < endPtr) {
      var u0 = u8Array[idx++];
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = u8Array[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1);
        continue;
      }
      var u2 = u8Array[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        if ((u0 & 248) != 240)
          warnOnce(
            "Invalid UTF-8 leading byte 0x" +
              u0.toString(16) +
              " encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!"
          );
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (u8Array[idx++] & 63);
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
      }
    }
  }
  return str;
}
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
}
function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 192 | (u >> 6);
      outU8Array[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 224 | (u >> 12);
      outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      if (u >= 2097152)
        warnOnce(
          "Invalid Unicode code point 0x" +
            u.toString(16) +
            " encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF)."
        );
      outU8Array[outIdx++] = 240 | (u >> 18);
      outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 128 | (u & 63);
    }
  }
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(
    typeof maxBytesToWrite == "number",
    "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"
  );
  return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}
var UTF16Decoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
function writeArrayToMemory(array, buffer) {
  assert(
    array.length >= 0,
    "writeArrayToMemory array must have a length (should be an array or typed array)"
  );
  HEAP8.set(array, buffer);
}
var WASM_PAGE_SIZE = 65536;
function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module["HEAP8"] = HEAP8 = new Int8Array(buf);
  Module["HEAP16"] = HEAP16 = new Int16Array(buf);
  Module["HEAP32"] = HEAP32 = new Int32Array(buf);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
}
var STACK_BASE = 5244608,
  STACK_MAX = 1728,
  DYNAMIC_BASE = 5244608,
  DYNAMICTOP_PTR = 1568;
assert(STACK_BASE % 16 === 0, "stack must start aligned");
assert(DYNAMIC_BASE % 16 === 0, "heap must start aligned");
var TOTAL_STACK = 5242880;
if (Module["TOTAL_STACK"])
  assert(
    TOTAL_STACK === Module["TOTAL_STACK"],
    "the stack size can no longer be determined at runtime"
  );
var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
if (!Object.getOwnPropertyDescriptor(Module, "INITIAL_MEMORY"))
  Object.defineProperty(Module, "INITIAL_MEMORY", {
    configurable: true,
    get: function () {
      abort(
        "Module.INITIAL_MEMORY has been replaced with plain INITIAL_INITIAL_MEMORY"
      );
    },
  });
assert(
  INITIAL_INITIAL_MEMORY >= TOTAL_STACK,
  "INITIAL_MEMORY should be larger than TOTAL_STACK, was " +
    INITIAL_INITIAL_MEMORY +
    "! (TOTAL_STACK=" +
    TOTAL_STACK +
    ")"
);
assert(
  typeof Int32Array !== "undefined" &&
    typeof Float64Array !== "undefined" &&
    Int32Array.prototype.subarray !== undefined &&
    Int32Array.prototype.set !== undefined,
  "JS engine does not provide full typed array support"
);
if (Module["wasmMemory"]) {
  wasmMemory = Module["wasmMemory"];
} else {
  wasmMemory = new WebAssembly.Memory({
    initial: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
  });
}
if (wasmMemory) {
  buffer = wasmMemory.buffer;
}
INITIAL_INITIAL_MEMORY = buffer.byteLength;
assert(INITIAL_INITIAL_MEMORY % WASM_PAGE_SIZE === 0);
updateGlobalBufferAndViews(buffer);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
function writeStackCookie() {
  assert((STACK_MAX & 3) == 0);
  HEAPU32[(STACK_MAX >> 2) + 1] = 34821223;
  HEAPU32[(STACK_MAX >> 2) + 2] = 2310721022;
  HEAP32[0] = 1668509029;
}
function checkStackCookie() {
  var cookie1 = HEAPU32[(STACK_MAX >> 2) + 1];
  var cookie2 = HEAPU32[(STACK_MAX >> 2) + 2];
  if (cookie1 != 34821223 || cookie2 != 2310721022) {
    abort(
      "Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x" +
        cookie2.toString(16) +
        " " +
        cookie1.toString(16)
    );
  }
  if (HEAP32[0] !== 1668509029)
    abort(
      "Runtime error: The application has corrupted its heap memory area (address zero)!"
    );
}
function abortStackOverflow(allocSize) {
  abort(
    "Stack overflow! Attempted to allocate " +
      allocSize +
      " bytes on the stack, but stack has only " +
      (STACK_MAX - stackSave() + allocSize) +
      " bytes available!"
  );
}
(function () {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 25459;
  if (h8[0] !== 115 || h8[1] !== 99)
    throw "Runtime error: expected the system to be little-endian!";
})();
function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == "function") {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === "number") {
      if (callback.arg === undefined) {
        Module["dynCall_v"](func);
      } else {
        Module["dynCall_vi"](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function")
      Module["preRun"] = [Module["preRun"]];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  checkStackCookie();
  assert(!runtimeInitialized);
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  checkStackCookie();
  callRuntimeCallbacks(__ATMAIN__);
}
function postRun() {
  checkStackCookie();
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function")
      Module["postRun"] = [Module["postRun"]];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
assert(
  Math.imul,
  "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"
);
assert(
  Math.fround,
  "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"
);
assert(
  Math.clz32,
  "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"
);
assert(
  Math.trunc,
  "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"
);
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
var runDependencyTracking = {};
function addRunDependency(id) {
  runDependencies++;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== "undefined") {
      runDependencyWatcher = setInterval(function () {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err("still waiting on run dependencies:");
          }
          err("dependency: " + dep);
        }
        if (shown) {
          err("(end of list)");
        }
      }, 1e4);
    }
  } else {
    err("warning: run dependency added without ID");
  }
}
function removeRunDependency(id) {
  runDependencies--;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err("warning: run dependency removed without ID");
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
function abort(what) {
  if (Module["onAbort"]) {
    Module["onAbort"](what);
  }
  what += "";
  out(what);
  err(what);
  ABORT = true;
  EXITSTATUS = 1;
  var output = "abort(" + what + ") at " + stackTrace();
  what = output;
  throw new WebAssembly.RuntimeError(what);
}
var FS = {
  error: function () {
    abort(
      "Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1"
    );
  },
  init: function () {
    FS.error();
  },
  createDataFile: function () {
    FS.error();
  },
  createPreloadedFile: function () {
    FS.error();
  },
  createLazyFile: function () {
    FS.error();
  },
  open: function () {
    FS.error();
  },
  mkdev: function () {
    FS.error();
  },
  registerDevice: function () {
    FS.error();
  },
  analyzePath: function () {
    FS.error();
  },
  loadFilesFromDB: function () {
    FS.error();
  },
  ErrnoError: function ErrnoError() {
    FS.error();
  },
};
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
  return String.prototype.startsWith
    ? filename.startsWith(dataURIPrefix)
    : filename.indexOf(dataURIPrefix) === 0;
}
var wasmBinaryFile = "a.out.wasm";
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}
function getBinary() {
  try {
    if (wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    if (readBinary) {
      return readBinary(wasmBinaryFile);
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
  } catch (err) {
    abort(err);
  }
}
function getBinaryPromise() {
  if (
    !wasmBinary &&
    (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
    typeof fetch === "function"
  ) {
    return fetch(wasmBinaryFile, { credentials: "same-origin" })
      .then(function (response) {
        if (!response["ok"]) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response["arrayBuffer"]();
      })
      .catch(function () {
        return getBinary();
      });
  }
  return new Promise(function (resolve, reject) {
    resolve(getBinary());
  });
}
function createWasm() {
  var info = { env: asmLibraryArg, wasi_snapshot_preview1: asmLibraryArg };
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    Module["asm"] = exports;
    removeRunDependency("wasm-instantiate");
  }
  addRunDependency("wasm-instantiate");
  var trueModule = Module;
  function receiveInstantiatedSource(output) {
    assert(
      Module === trueModule,
      "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"
    );
    trueModule = null;
    receiveInstance(output["instance"]);
  }
  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise()
      .then(function (binary) {
        return WebAssembly.instantiate(binary, info);
      })
      .then(receiver, function (reason) {
        err("failed to asynchronously prepare wasm: " + reason);
        abort(reason);
      });
  }
  function instantiateAsync() {
    if (
      !wasmBinary &&
      typeof WebAssembly.instantiateStreaming === "function" &&
      !isDataURI(wasmBinaryFile) &&
      typeof fetch === "function"
    ) {
      fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function (
        response
      ) {
        var result = WebAssembly.instantiateStreaming(response, info);
        return result.then(receiveInstantiatedSource, function (reason) {
          err("wasm streaming compile failed: " + reason);
          err("falling back to ArrayBuffer instantiation");
          instantiateArrayBuffer(receiveInstantiatedSource);
        });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiatedSource);
    }
  }
  if (Module["instantiateWasm"]) {
    try {
      var exports = Module["instantiateWasm"](info, receiveInstance);
      return exports;
    } catch (e) {
      err("Module.instantiateWasm callback failed with error: " + e);
      return false;
    }
  }
  instantiateAsync();
  return {};
}
__ATINIT__.push({
  func: function () {
    ___wasm_call_ctors();
  },
});
function demangle(func) {
  warnOnce(
    "warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling"
  );
  return func;
}
function demangleAll(text) {
  var regex = /\b_Z[\w\d_]+/g;
  return text.replace(regex, function (x) {
    var y = demangle(x);
    return x === y ? x : y + " [" + x + "]";
  });
}
function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    try {
      throw new Error();
    } catch (e) {
      err = e;
    }
    if (!err.stack) {
      return "(no stack trace available)";
    }
  }
  return err.stack.toString();
}
function stackTrace() {
  var js = jsStackTrace();
  if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
  return demangleAll(js);
}
function ___handle_stack_overflow() {
  abort("stack overflow");
}
function _emscripten_get_heap_size() {
  return HEAPU8.length;
}
function emscripten_realloc_buffer(size) {
  try {
    wasmMemory.grow((size - buffer.byteLength + 65535) >> 16);
    updateGlobalBufferAndViews(wasmMemory.buffer);
    return 1;
  } catch (e) {
    console.error(
      "emscripten_realloc_buffer: Attempted to grow heap from " +
        buffer.byteLength +
        " bytes to " +
        size +
        " bytes, but got error: " +
        e
    );
  }
}
function _emscripten_resize_heap(requestedSize) {
  var oldSize = _emscripten_get_heap_size();
  assert(requestedSize > oldSize);
  var PAGE_MULTIPLE = 65536;
  var maxHeapSize = 2147483648 - PAGE_MULTIPLE;
  if (requestedSize > maxHeapSize) {
    err(
      "Cannot enlarge memory, asked to go up to " +
        requestedSize +
        " bytes, but the limit is " +
        maxHeapSize +
        " bytes!"
    );
    return false;
  }
  var minHeapSize = 16777216;
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(
      maxHeapSize,
      alignUp(
        Math.max(minHeapSize, requestedSize, overGrownHeapSize),
        PAGE_MULTIPLE
      )
    );
    var replacement = emscripten_realloc_buffer(newSize);
    if (replacement) {
      return true;
    }
  }
  err(
    "Failed to grow the heap from " +
      oldSize +
      " bytes to " +
      newSize +
      " bytes, not enough memory!"
  );
  return false;
}
var asmLibraryArg = {
  __handle_stack_overflow: ___handle_stack_overflow,
  emscripten_resize_heap: _emscripten_resize_heap,
  memory: wasmMemory,
  table: wasmTable,
};
var asm = createWasm();
Module["asm"] = asm;
var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["__wasm_call_ctors"].apply(null, arguments);
});
var _create_buffer = (Module["_create_buffer"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["create_buffer"].apply(null, arguments);
});
var _destroy_buffer = (Module["_destroy_buffer"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["destroy_buffer"].apply(null, arguments);
});
var _free_result = (Module["_free_result"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["free_result"].apply(null, arguments);
});
var _get_result_pointer = (Module["_get_result_pointer"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["get_result_pointer"].apply(null, arguments);
});
var _get_result_size = (Module["_get_result_size"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["get_result_size"].apply(null, arguments);
});
var _get_waveform_overview = (Module["_get_waveform_overview"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["get_waveform_overview"].apply(null, arguments);
});
var ___set_stack_limit = (Module["___set_stack_limit"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["__set_stack_limit"].apply(null, arguments);
});
var stackSave = (Module["stackSave"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["stackSave"].apply(null, arguments);
});
var stackAlloc = (Module["stackAlloc"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["stackAlloc"].apply(null, arguments);
});
var stackRestore = (Module["stackRestore"] = function () {
  assert(
    runtimeInitialized,
    "you need to wait for the runtime to be ready (e.g. wait for main() to be called)"
  );
  assert(
    !runtimeExited,
    "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"
  );
  return Module["asm"]["stackRestore"].apply(null, arguments);
});
Module["asm"] = asm;
if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString"))
  Module["intArrayFromString"] = function () {
    abort(
      "'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString"))
  Module["intArrayToString"] = function () {
    abort(
      "'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "ccall"))
  Module["ccall"] = function () {
    abort(
      "'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
Module["cwrap"] = cwrap;
if (!Object.getOwnPropertyDescriptor(Module, "setValue"))
  Module["setValue"] = function () {
    abort(
      "'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "getValue"))
  Module["getValue"] = function () {
    abort(
      "'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "allocate"))
  Module["allocate"] = function () {
    abort(
      "'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "getMemory"))
  Module["getMemory"] = function () {
    abort(
      "'getMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString"))
  Module["UTF8ArrayToString"] = function () {
    abort(
      "'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ToString"))
  Module["UTF8ToString"] = function () {
    abort(
      "'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array"))
  Module["stringToUTF8Array"] = function () {
    abort(
      "'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8"))
  Module["stringToUTF8"] = function () {
    abort(
      "'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF8"))
  Module["lengthBytesUTF8"] = function () {
    abort(
      "'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace"))
  Module["stackTrace"] = function () {
    abort(
      "'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun"))
  Module["addOnPreRun"] = function () {
    abort(
      "'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "addOnInit"))
  Module["addOnInit"] = function () {
    abort(
      "'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain"))
  Module["addOnPreMain"] = function () {
    abort(
      "'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "addOnExit"))
  Module["addOnExit"] = function () {
    abort(
      "'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun"))
  Module["addOnPostRun"] = function () {
    abort(
      "'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory"))
  Module["writeStringToMemory"] = function () {
    abort(
      "'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory"))
  Module["writeArrayToMemory"] = function () {
    abort(
      "'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory"))
  Module["writeAsciiToMemory"] = function () {
    abort(
      "'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "addRunDependency"))
  Module["addRunDependency"] = function () {
    abort(
      "'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "removeRunDependency"))
  Module["removeRunDependency"] = function () {
    abort(
      "'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createFolder"))
  Module["FS_createFolder"] = function () {
    abort(
      "'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createPath"))
  Module["FS_createPath"] = function () {
    abort(
      "'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createDataFile"))
  Module["FS_createDataFile"] = function () {
    abort(
      "'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createPreloadedFile"))
  Module["FS_createPreloadedFile"] = function () {
    abort(
      "'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createLazyFile"))
  Module["FS_createLazyFile"] = function () {
    abort(
      "'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createLink"))
  Module["FS_createLink"] = function () {
    abort(
      "'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createDevice"))
  Module["FS_createDevice"] = function () {
    abort(
      "'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "FS_unlink"))
  Module["FS_unlink"] = function () {
    abort(
      "'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "dynamicAlloc"))
  Module["dynamicAlloc"] = function () {
    abort(
      "'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "loadDynamicLibrary"))
  Module["loadDynamicLibrary"] = function () {
    abort(
      "'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "loadWebAssemblyModule"))
  Module["loadWebAssemblyModule"] = function () {
    abort(
      "'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "getLEB"))
  Module["getLEB"] = function () {
    abort(
      "'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables"))
  Module["getFunctionTables"] = function () {
    abort(
      "'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables"))
  Module["alignFunctionTables"] = function () {
    abort(
      "'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions"))
  Module["registerFunctions"] = function () {
    abort(
      "'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "addFunction"))
  Module["addFunction"] = function () {
    abort(
      "'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "removeFunction"))
  Module["removeFunction"] = function () {
    abort(
      "'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper"))
  Module["getFuncWrapper"] = function () {
    abort(
      "'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint"))
  Module["prettyPrint"] = function () {
    abort(
      "'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "makeBigInt"))
  Module["makeBigInt"] = function () {
    abort(
      "'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "dynCall"))
  Module["dynCall"] = function () {
    abort(
      "'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting"))
  Module["getCompilerSetting"] = function () {
    abort(
      "'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "print"))
  Module["print"] = function () {
    abort(
      "'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "printErr"))
  Module["printErr"] = function () {
    abort(
      "'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0"))
  Module["getTempRet0"] = function () {
    abort(
      "'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0"))
  Module["setTempRet0"] = function () {
    abort(
      "'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "callMain"))
  Module["callMain"] = function () {
    abort(
      "'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "abort"))
  Module["abort"] = function () {
    abort(
      "'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stringToNewUTF8"))
  Module["stringToNewUTF8"] = function () {
    abort(
      "'stringToNewUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "emscripten_realloc_buffer"))
  Module["emscripten_realloc_buffer"] = function () {
    abort(
      "'emscripten_realloc_buffer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "ENV"))
  Module["ENV"] = function () {
    abort(
      "'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "setjmpId"))
  Module["setjmpId"] = function () {
    abort(
      "'setjmpId' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_CODES"))
  Module["ERRNO_CODES"] = function () {
    abort(
      "'ERRNO_CODES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_MESSAGES"))
  Module["ERRNO_MESSAGES"] = function () {
    abort(
      "'ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "DNS"))
  Module["DNS"] = function () {
    abort(
      "'DNS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "GAI_ERRNO_MESSAGES"))
  Module["GAI_ERRNO_MESSAGES"] = function () {
    abort(
      "'GAI_ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "Protocols"))
  Module["Protocols"] = function () {
    abort(
      "'Protocols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "Sockets"))
  Module["Sockets"] = function () {
    abort(
      "'Sockets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "UNWIND_CACHE"))
  Module["UNWIND_CACHE"] = function () {
    abort(
      "'UNWIND_CACHE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgs"))
  Module["readAsmConstArgs"] = function () {
    abort(
      "'readAsmConstArgs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_q"))
  Module["jstoi_q"] = function () {
    abort(
      "'jstoi_q' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_s"))
  Module["jstoi_s"] = function () {
    abort(
      "'jstoi_s' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "PATH"))
  Module["PATH"] = function () {
    abort(
      "'PATH' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "PATH_FS"))
  Module["PATH_FS"] = function () {
    abort(
      "'PATH_FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "SYSCALLS"))
  Module["SYSCALLS"] = function () {
    abort(
      "'SYSCALLS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "syscallMmap2"))
  Module["syscallMmap2"] = function () {
    abort(
      "'syscallMmap2' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "syscallMunmap"))
  Module["syscallMunmap"] = function () {
    abort(
      "'syscallMunmap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "flush_NO_FILESYSTEM"))
  Module["flush_NO_FILESYSTEM"] = function () {
    abort(
      "'flush_NO_FILESYSTEM' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "JSEvents"))
  Module["JSEvents"] = function () {
    abort(
      "'JSEvents' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "demangle"))
  Module["demangle"] = function () {
    abort(
      "'demangle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "demangleAll"))
  Module["demangleAll"] = function () {
    abort(
      "'demangleAll' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "jsStackTrace"))
  Module["jsStackTrace"] = function () {
    abort(
      "'jsStackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace"))
  Module["stackTrace"] = function () {
    abort(
      "'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64"))
  Module["writeI53ToI64"] = function () {
    abort(
      "'writeI53ToI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Clamped"))
  Module["writeI53ToI64Clamped"] = function () {
    abort(
      "'writeI53ToI64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Signaling"))
  Module["writeI53ToI64Signaling"] = function () {
    abort(
      "'writeI53ToI64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Clamped"))
  Module["writeI53ToU64Clamped"] = function () {
    abort(
      "'writeI53ToU64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Signaling"))
  Module["writeI53ToU64Signaling"] = function () {
    abort(
      "'writeI53ToU64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromI64"))
  Module["readI53FromI64"] = function () {
    abort(
      "'readI53FromI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromU64"))
  Module["readI53FromU64"] = function () {
    abort(
      "'readI53FromU64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "convertI32PairToI53"))
  Module["convertI32PairToI53"] = function () {
    abort(
      "'convertI32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "convertU32PairToI53"))
  Module["convertU32PairToI53"] = function () {
    abort(
      "'convertU32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "Browser"))
  Module["Browser"] = function () {
    abort(
      "'Browser' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "FS"))
  Module["FS"] = function () {
    abort(
      "'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "MEMFS"))
  Module["MEMFS"] = function () {
    abort(
      "'MEMFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "TTY"))
  Module["TTY"] = function () {
    abort(
      "'TTY' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "PIPEFS"))
  Module["PIPEFS"] = function () {
    abort(
      "'PIPEFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "SOCKFS"))
  Module["SOCKFS"] = function () {
    abort(
      "'SOCKFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "GL"))
  Module["GL"] = function () {
    abort(
      "'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGet"))
  Module["emscriptenWebGLGet"] = function () {
    abort(
      "'emscriptenWebGLGet' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetTexPixelData"))
  Module["emscriptenWebGLGetTexPixelData"] = function () {
    abort(
      "'emscriptenWebGLGetTexPixelData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetUniform"))
  Module["emscriptenWebGLGetUniform"] = function () {
    abort(
      "'emscriptenWebGLGetUniform' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetVertexAttrib"))
  Module["emscriptenWebGLGetVertexAttrib"] = function () {
    abort(
      "'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "AL"))
  Module["AL"] = function () {
    abort(
      "'AL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "SDL"))
  Module["SDL"] = function () {
    abort(
      "'SDL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_gfx"))
  Module["SDL_gfx"] = function () {
    abort(
      "'SDL_gfx' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "GLUT"))
  Module["GLUT"] = function () {
    abort(
      "'GLUT' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "EGL"))
  Module["EGL"] = function () {
    abort(
      "'EGL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "GLFW_Window"))
  Module["GLFW_Window"] = function () {
    abort(
      "'GLFW_Window' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "GLFW"))
  Module["GLFW"] = function () {
    abort(
      "'GLFW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "GLEW"))
  Module["GLEW"] = function () {
    abort(
      "'GLEW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "IDBStore"))
  Module["IDBStore"] = function () {
    abort(
      "'IDBStore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "runAndAbortIfError"))
  Module["runAndAbortIfError"] = function () {
    abort(
      "'runAndAbortIfError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "warnOnce"))
  Module["warnOnce"] = function () {
    abort(
      "'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stackSave"))
  Module["stackSave"] = function () {
    abort(
      "'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stackRestore"))
  Module["stackRestore"] = function () {
    abort(
      "'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc"))
  Module["stackAlloc"] = function () {
    abort(
      "'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString"))
  Module["AsciiToString"] = function () {
    abort(
      "'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii"))
  Module["stringToAscii"] = function () {
    abort(
      "'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString"))
  Module["UTF16ToString"] = function () {
    abort(
      "'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16"))
  Module["stringToUTF16"] = function () {
    abort(
      "'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16"))
  Module["lengthBytesUTF16"] = function () {
    abort(
      "'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString"))
  Module["UTF32ToString"] = function () {
    abort(
      "'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32"))
  Module["stringToUTF32"] = function () {
    abort(
      "'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32"))
  Module["lengthBytesUTF32"] = function () {
    abort(
      "'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8"))
  Module["allocateUTF8"] = function () {
    abort(
      "'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8OnStack"))
  Module["allocateUTF8OnStack"] = function () {
    abort(
      "'allocateUTF8OnStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
    );
  };
Module["writeStackCookie"] = writeStackCookie;
Module["checkStackCookie"] = checkStackCookie;
Module["abortStackOverflow"] = abortStackOverflow;
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL"))
  Object.defineProperty(Module, "ALLOC_NORMAL", {
    configurable: true,
    get: function () {
      abort(
        "'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
      );
    },
  });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK"))
  Object.defineProperty(Module, "ALLOC_STACK", {
    configurable: true,
    get: function () {
      abort(
        "'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
      );
    },
  });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_DYNAMIC"))
  Object.defineProperty(Module, "ALLOC_DYNAMIC", {
    configurable: true,
    get: function () {
      abort(
        "'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
      );
    },
  });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NONE"))
  Object.defineProperty(Module, "ALLOC_NONE", {
    configurable: true,
    get: function () {
      abort(
        "'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)"
      );
    },
  });
var calledRun;
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}
dependenciesFulfilled = function runCaller() {
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller;
};
function run(args) {
  args = args || arguments_;
  if (runDependencies > 0) {
    return;
  }
  writeStackCookie();
  preRun();
  if (runDependencies > 0) return;
  function doRun() {
    if (calledRun) return;
    calledRun = true;
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
    assert(
      !Module["_main"],
      'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'
    );
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(function () {
      setTimeout(function () {
        Module["setStatus"]("");
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
  checkStackCookie();
}
Module["run"] = run;
if (Module["preInit"]) {
  if (typeof Module["preInit"] == "function")
    Module["preInit"] = [Module["preInit"]];
  while (Module["preInit"].length > 0) {
    Module["preInit"].pop()();
  }
}
noExitRuntime = true;
run();
