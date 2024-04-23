"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/rules/no-nodejs-runtime.ts
var require_no_nodejs_runtime = __commonJS({
  "src/rules/no-nodejs-runtime.ts"(exports2, module2) {
    "use strict";
    var rule = {
      create: (context) => {
        return {
          ExportNamedDeclaration: (node) => {
            const declaration = node.declaration;
            if (declaration?.type === "VariableDeclaration" && declaration.declarations.length === 1 && declaration.declarations[0]?.id.type === "Identifier" && declaration.declarations[0].id.name === "runtime" && declaration.declarations[0].init?.type === "Literal" && declaration.declarations[0].init?.value === "nodejs") {
              context.report({
                message: "The 'nodejs' runtime is not supported. Use 'edge' instead.",
                node: declaration.declarations[0].init,
                fix: (fixer) => declaration.declarations[0]?.init ? fixer.replaceText(declaration.declarations[0].init, "'edge'") : null
              });
            }
          }
        };
      },
      meta: {
        fixable: "code",
        docs: {
          url: "https://github.com/cloudflare/next-on-pages/blob/main/packages/eslint-plugin-next-on-pages/docs/rules/no-nodejs-runtime.md"
        }
      }
    };
    module2.exports = rule;
  }
});

// src/utils/extract-paths.ts
function extractPaths(fullPath) {
  const paths = [];
  const sections = fullPath.split("/");
  if (sections.length === 1)
    return paths;
  if (sections[0]) {
    paths.push(sections[0]);
  }
  sections.slice(1, -1).forEach((section, i) => {
    paths.push(`${paths[i]}/${section}`);
  });
  return paths;
}
var init_extract_paths = __esm({
  "src/utils/extract-paths.ts"() {
    "use strict";
  }
});

// ../../node_modules/comment-parser/es6/primitives.js
var Markers;
var init_primitives = __esm({
  "../../node_modules/comment-parser/es6/primitives.js"() {
    (function(Markers2) {
      Markers2["start"] = "/**";
      Markers2["nostart"] = "/***";
      Markers2["delim"] = "*";
      Markers2["end"] = "*/";
    })(Markers || (Markers = {}));
  }
});

// ../../node_modules/comment-parser/es6/util.js
function isSpace(source) {
  return /^\s+$/.test(source);
}
function splitCR(source) {
  const matches = source.match(/\r+$/);
  return matches == null ? ["", source] : [source.slice(-matches[0].length), source.slice(0, -matches[0].length)];
}
function splitSpace(source) {
  const matches = source.match(/^\s+/);
  return matches == null ? ["", source] : [source.slice(0, matches[0].length), source.slice(matches[0].length)];
}
function splitLines(source) {
  return source.split(/\n/);
}
function seedSpec(spec = {}) {
  return Object.assign({ tag: "", name: "", type: "", optional: false, description: "", problems: [], source: [] }, spec);
}
function seedTokens(tokens = {}) {
  return Object.assign({ start: "", delimiter: "", postDelimiter: "", tag: "", postTag: "", name: "", postName: "", type: "", postType: "", description: "", end: "", lineEnd: "" }, tokens);
}
var init_util = __esm({
  "../../node_modules/comment-parser/es6/util.js"() {
  }
});

// ../../node_modules/comment-parser/es6/parser/block-parser.js
function getParser({ fence = "```" } = {}) {
  const fencer = getFencer(fence);
  const toggleFence = (source, isFenced) => fencer(source) ? !isFenced : isFenced;
  return function parseBlock(source) {
    const sections = [[]];
    let isFenced = false;
    for (const line of source) {
      if (reTag.test(line.tokens.description) && !isFenced) {
        sections.push([line]);
      } else {
        sections[sections.length - 1].push(line);
      }
      isFenced = toggleFence(line.tokens.description, isFenced);
    }
    return sections;
  };
}
function getFencer(fence) {
  if (typeof fence === "string")
    return (source) => source.split(fence).length % 2 === 0;
  return fence;
}
var reTag;
var init_block_parser = __esm({
  "../../node_modules/comment-parser/es6/parser/block-parser.js"() {
    reTag = /^@\S+/;
  }
});

// ../../node_modules/comment-parser/es6/parser/source-parser.js
function getParser2({ startLine = 0, markers = Markers } = {}) {
  let block = null;
  let num = startLine;
  return function parseSource(source) {
    let rest = source;
    const tokens = seedTokens();
    [tokens.lineEnd, rest] = splitCR(rest);
    [tokens.start, rest] = splitSpace(rest);
    if (block === null && rest.startsWith(markers.start) && !rest.startsWith(markers.nostart)) {
      block = [];
      tokens.delimiter = rest.slice(0, markers.start.length);
      rest = rest.slice(markers.start.length);
      [tokens.postDelimiter, rest] = splitSpace(rest);
    }
    if (block === null) {
      num++;
      return null;
    }
    const isClosed = rest.trimRight().endsWith(markers.end);
    if (tokens.delimiter === "" && rest.startsWith(markers.delim) && !rest.startsWith(markers.end)) {
      tokens.delimiter = markers.delim;
      rest = rest.slice(markers.delim.length);
      [tokens.postDelimiter, rest] = splitSpace(rest);
    }
    if (isClosed) {
      const trimmed = rest.trimRight();
      tokens.end = rest.slice(trimmed.length - markers.end.length);
      rest = trimmed.slice(0, -markers.end.length);
    }
    tokens.description = rest;
    block.push({ number: num, source, tokens });
    num++;
    if (isClosed) {
      const result = block.slice();
      block = null;
      return result;
    }
    return null;
  };
}
var init_source_parser = __esm({
  "../../node_modules/comment-parser/es6/parser/source-parser.js"() {
    init_primitives();
    init_util();
  }
});

// ../../node_modules/comment-parser/es6/parser/spec-parser.js
function getParser3({ tokenizers }) {
  return function parseSpec(source) {
    var _a;
    let spec = seedSpec({ source });
    for (const tokenize of tokenizers) {
      spec = tokenize(spec);
      if ((_a = spec.problems[spec.problems.length - 1]) === null || _a === void 0 ? void 0 : _a.critical)
        break;
    }
    return spec;
  };
}
var init_spec_parser = __esm({
  "../../node_modules/comment-parser/es6/parser/spec-parser.js"() {
    init_util();
  }
});

// ../../node_modules/comment-parser/es6/parser/tokenizers/tag.js
function tagTokenizer() {
  return (spec) => {
    const { tokens } = spec.source[0];
    const match = tokens.description.match(/\s*(@(\S+))(\s*)/);
    if (match === null) {
      spec.problems.push({
        code: "spec:tag:prefix",
        message: 'tag should start with "@" symbol',
        line: spec.source[0].number,
        critical: true
      });
      return spec;
    }
    tokens.tag = match[1];
    tokens.postTag = match[3];
    tokens.description = tokens.description.slice(match[0].length);
    spec.tag = match[2];
    return spec;
  };
}
var init_tag = __esm({
  "../../node_modules/comment-parser/es6/parser/tokenizers/tag.js"() {
  }
});

// ../../node_modules/comment-parser/es6/parser/tokenizers/type.js
function typeTokenizer(spacing = "compact") {
  const join2 = getJoiner(spacing);
  return (spec) => {
    let curlies = 0;
    let lines = [];
    for (const [i, { tokens }] of spec.source.entries()) {
      let type = "";
      if (i === 0 && tokens.description[0] !== "{")
        return spec;
      for (const ch of tokens.description) {
        if (ch === "{")
          curlies++;
        if (ch === "}")
          curlies--;
        type += ch;
        if (curlies === 0)
          break;
      }
      lines.push([tokens, type]);
      if (curlies === 0)
        break;
    }
    if (curlies !== 0) {
      spec.problems.push({
        code: "spec:type:unpaired-curlies",
        message: "unpaired curlies",
        line: spec.source[0].number,
        critical: true
      });
      return spec;
    }
    const parts = [];
    const offset = lines[0][0].postDelimiter.length;
    for (const [i, [tokens, type]] of lines.entries()) {
      tokens.type = type;
      if (i > 0) {
        tokens.type = tokens.postDelimiter.slice(offset) + type;
        tokens.postDelimiter = tokens.postDelimiter.slice(0, offset);
      }
      [tokens.postType, tokens.description] = splitSpace(tokens.description.slice(type.length));
      parts.push(tokens.type);
    }
    parts[0] = parts[0].slice(1);
    parts[parts.length - 1] = parts[parts.length - 1].slice(0, -1);
    spec.type = join2(parts);
    return spec;
  };
}
function getJoiner(spacing) {
  if (spacing === "compact")
    return (t) => t.map(trim).join("");
  else if (spacing === "preserve")
    return (t) => t.join("\n");
  else
    return spacing;
}
var trim;
var init_type = __esm({
  "../../node_modules/comment-parser/es6/parser/tokenizers/type.js"() {
    init_util();
    trim = (x) => x.trim();
  }
});

// ../../node_modules/comment-parser/es6/parser/tokenizers/name.js
function nameTokenizer() {
  const typeEnd = (num, { tokens }, i) => tokens.type === "" ? num : i;
  return (spec) => {
    const { tokens } = spec.source[spec.source.reduce(typeEnd, 0)];
    const source = tokens.description.trimLeft();
    const quotedGroups = source.split('"');
    if (quotedGroups.length > 1 && quotedGroups[0] === "" && quotedGroups.length % 2 === 1) {
      spec.name = quotedGroups[1];
      tokens.name = `"${quotedGroups[1]}"`;
      [tokens.postName, tokens.description] = splitSpace(source.slice(tokens.name.length));
      return spec;
    }
    let brackets = 0;
    let name = "";
    let optional = false;
    let defaultValue;
    for (const ch of source) {
      if (brackets === 0 && isSpace(ch))
        break;
      if (ch === "[")
        brackets++;
      if (ch === "]")
        brackets--;
      name += ch;
    }
    if (brackets !== 0) {
      spec.problems.push({
        code: "spec:name:unpaired-brackets",
        message: "unpaired brackets",
        line: spec.source[0].number,
        critical: true
      });
      return spec;
    }
    const nameToken = name;
    if (name[0] === "[" && name[name.length - 1] === "]") {
      optional = true;
      name = name.slice(1, -1);
      const parts = name.split("=");
      name = parts[0].trim();
      if (parts[1] !== void 0)
        defaultValue = parts.slice(1).join("=").trim();
      if (name === "") {
        spec.problems.push({
          code: "spec:name:empty-name",
          message: "empty name",
          line: spec.source[0].number,
          critical: true
        });
        return spec;
      }
      if (defaultValue === "") {
        spec.problems.push({
          code: "spec:name:empty-default",
          message: "empty default value",
          line: spec.source[0].number,
          critical: true
        });
        return spec;
      }
      if (!isQuoted(defaultValue) && /=(?!>)/.test(defaultValue)) {
        spec.problems.push({
          code: "spec:name:invalid-default",
          message: "invalid default value syntax",
          line: spec.source[0].number,
          critical: true
        });
        return spec;
      }
    }
    spec.optional = optional;
    spec.name = name;
    tokens.name = nameToken;
    if (defaultValue !== void 0)
      spec.default = defaultValue;
    [tokens.postName, tokens.description] = splitSpace(source.slice(tokens.name.length));
    return spec;
  };
}
var isQuoted;
var init_name = __esm({
  "../../node_modules/comment-parser/es6/parser/tokenizers/name.js"() {
    init_util();
    isQuoted = (s) => s && s.startsWith('"') && s.endsWith('"');
  }
});

// ../../node_modules/comment-parser/es6/parser/tokenizers/description.js
function descriptionTokenizer(spacing = "compact", markers = Markers) {
  const join2 = getJoiner2(spacing);
  return (spec) => {
    spec.description = join2(spec.source, markers);
    return spec;
  };
}
function getJoiner2(spacing) {
  if (spacing === "compact")
    return compactJoiner;
  if (spacing === "preserve")
    return preserveJoiner;
  return spacing;
}
function compactJoiner(lines, markers = Markers) {
  return lines.map(({ tokens: { description } }) => description.trim()).filter((description) => description !== "").join(" ");
}
function preserveJoiner(lines, markers = Markers) {
  if (lines.length === 0)
    return "";
  if (lines[0].tokens.description === "" && lines[0].tokens.delimiter === markers.start)
    lines = lines.slice(1);
  const lastLine = lines[lines.length - 1];
  if (lastLine !== void 0 && lastLine.tokens.description === "" && lastLine.tokens.end.endsWith(markers.end))
    lines = lines.slice(0, -1);
  lines = lines.slice(lines.reduce(lineNo, 0));
  return lines.map(getDescription).join("\n");
}
var lineNo, getDescription;
var init_description = __esm({
  "../../node_modules/comment-parser/es6/parser/tokenizers/description.js"() {
    init_primitives();
    lineNo = (num, { tokens }, i) => tokens.type === "" ? num : i;
    getDescription = ({ tokens }) => (tokens.delimiter === "" ? tokens.start : tokens.postDelimiter.slice(1)) + tokens.description;
  }
});

// ../../node_modules/comment-parser/es6/parser/index.js
function getParser4({ startLine = 0, fence = "```", spacing = "compact", markers = Markers, tokenizers = [
  tagTokenizer(),
  typeTokenizer(spacing),
  nameTokenizer(),
  descriptionTokenizer(spacing)
] } = {}) {
  if (startLine < 0 || startLine % 1 > 0)
    throw new Error("Invalid startLine");
  const parseSource = getParser2({ startLine, markers });
  const parseBlock = getParser({ fence });
  const parseSpec = getParser3({ tokenizers });
  const joinDescription = getJoiner2(spacing);
  return function(source) {
    const blocks = [];
    for (const line of splitLines(source)) {
      const lines = parseSource(line);
      if (lines === null)
        continue;
      const sections = parseBlock(lines);
      const specs = sections.slice(1).map(parseSpec);
      blocks.push({
        description: joinDescription(sections[0], markers),
        tags: specs,
        source: lines,
        problems: specs.reduce((acc, spec) => acc.concat(spec.problems), [])
      });
    }
    return blocks;
  };
}
var init_parser = __esm({
  "../../node_modules/comment-parser/es6/parser/index.js"() {
    init_primitives();
    init_util();
    init_block_parser();
    init_source_parser();
    init_spec_parser();
    init_tag();
    init_type();
    init_name();
    init_description();
  }
});

// ../../node_modules/comment-parser/es6/stringifier/index.js
function join(tokens) {
  return tokens.start + tokens.delimiter + tokens.postDelimiter + tokens.tag + tokens.postTag + tokens.type + tokens.postType + tokens.name + tokens.postName + tokens.description + tokens.end + tokens.lineEnd;
}
function getStringifier() {
  return (block) => block.source.map(({ tokens }) => join(tokens)).join("\n");
}
var init_stringifier = __esm({
  "../../node_modules/comment-parser/es6/stringifier/index.js"() {
  }
});

// ../../node_modules/comment-parser/es6/transforms/align.js
var init_align = __esm({
  "../../node_modules/comment-parser/es6/transforms/align.js"() {
    init_primitives();
    init_util();
  }
});

// ../../node_modules/comment-parser/es6/transforms/indent.js
var init_indent = __esm({
  "../../node_modules/comment-parser/es6/transforms/indent.js"() {
    init_util();
  }
});

// ../../node_modules/comment-parser/es6/transforms/crlf.js
var init_crlf = __esm({
  "../../node_modules/comment-parser/es6/transforms/crlf.js"() {
    init_util();
  }
});

// ../../node_modules/comment-parser/es6/transforms/index.js
var init_transforms = __esm({
  "../../node_modules/comment-parser/es6/transforms/index.js"() {
  }
});

// ../../node_modules/comment-parser/es6/stringifier/inspect.js
var zeroWidth, fields;
var init_inspect = __esm({
  "../../node_modules/comment-parser/es6/stringifier/inspect.js"() {
    init_util();
    zeroWidth = {
      line: 0,
      start: 0,
      delimiter: 0,
      postDelimiter: 0,
      tag: 0,
      postTag: 0,
      name: 0,
      postName: 0,
      type: 0,
      postType: 0,
      description: 0,
      end: 0,
      lineEnd: 0
    };
    fields = Object.keys(zeroWidth);
  }
});

// ../../node_modules/comment-parser/es6/index.js
function parse(source, options = {}) {
  return getParser4(options)(source);
}
var stringify;
var init_es6 = __esm({
  "../../node_modules/comment-parser/es6/index.js"() {
    init_parser();
    init_description();
    init_name();
    init_tag();
    init_type();
    init_stringifier();
    init_align();
    init_indent();
    init_crlf();
    init_transforms();
    init_util();
    init_primitives();
    init_inspect();
    stringify = getStringifier();
  }
});

// src/rules/no-unsupported-configs.ts
var require_no_unsupported_configs = __commonJS({
  "src/rules/no-unsupported-configs.ts"(exports2, module2) {
    "use strict";
    init_extract_paths();
    init_es6();
    var configs = [
      { name: "experimental/appDir", support: "\u2705" },
      { name: "assetPrefix", support: "\u{1F504}" },
      { name: "basePath", support: "\u2705" },
      { name: "compress", support: "N/A" },
      { name: "devIndicators", support: "N/A" },
      { name: "distDir", support: "N/A" },
      { name: "env", support: "\u2705" },
      { name: "eslint", support: "\u2705" },
      { name: "exportPathMap", support: "N/A" },
      { name: "generateBuildId", support: "\u2705" },
      { name: "generateEtags", support: "\u{1F504}" },
      { name: "headers", support: "\u2705" },
      { name: "httpAgentOptions", support: "N/A" },
      { name: "images", support: "\u2705" },
      { name: "incrementalCacheHandlerPath", support: "\u{1F504}" },
      { name: "logging", support: "N/A" },
      { name: "experimental/mdxRs", support: "\u2705" },
      { name: "onDemandEntries", support: "N/A" },
      { name: "experimental/optimizePackageImports", support: "N/A" },
      { name: "output", support: "N/A" },
      { name: "pageExtensions", support: "\u2705" },
      { name: "experimental/ppr", support: "\u274C" },
      { name: "poweredByHeader", support: "\u{1F504}" },
      { name: "productionBrowserSourceMaps", support: "\u{1F504}" },
      { name: "reactStrictMode", support: "\u274C" },
      { name: "redirects", support: "\u2705" },
      { name: "rewrites", support: "\u2705" },
      // Runtime Config
      { name: "serverRuntimeConfig", support: "\u274C" },
      { name: "publicRuntimeConfig", support: "\u274C" },
      { name: "experimental/serverActions", support: "\u2705" },
      { name: "serverComponentsExternalPackages", support: "N/A" },
      { name: "trailingSlash", support: "\u2705" },
      { name: "transpilePackages", support: "\u2705" },
      { name: "experimental/turbo", support: "\u{1F504}" },
      { name: "typedRoutes", support: "\u2705" },
      { name: "typescript", support: "\u2705" },
      { name: "experimental/urlImports", support: "\u2705" },
      { name: "webpack", support: "\u2705" },
      { name: "experimental/webVitalsAttribution", support: "\u2705" }
    ];
    function filterAndExtractConfigs(support) {
      const comparisonFn = (config2) => Array.isArray(support) ? support.includes(config2.support) : config2.support === support;
      return configs.filter(comparisonFn).map((config2) => config2.name);
    }
    var supportedConfigs = new Set(filterAndExtractConfigs("\u2705"));
    var indefinitelyUnsupportedConfigs = new Set(
      filterAndExtractConfigs(["\u274C", "N/A"])
    );
    var currentlyUnsupportedConfigs = new Set(filterAndExtractConfigs("\u{1F504}"));
    var nestedConfigPaths = new Set(
      [
        ...supportedConfigs,
        ...indefinitelyUnsupportedConfigs,
        ...currentlyUnsupportedConfigs
      ].flatMap(extractPaths)
    );
    var ruleSchema = {
      type: "object",
      properties: {
        includeCurrentlyUnsupported: {
          type: "boolean",
          default: true
        },
        includeUnrecognized: {
          type: "boolean",
          default: false
        }
      }
    };
    var rule = {
      create: (context) => {
        const code = context.sourceCode;
        const exportedConfigName = context.filename.match(/next\.config\.m?js$/) ? getConfigVariableName(code) : null;
        const options = context.options[0] ?? {
          includeCurrentlyUnsupported: ruleSchema.properties.includeCurrentlyUnsupported.default,
          includeUnrecognized: ruleSchema.properties.includeUnrecognized.default
        };
        return {
          VariableDeclaration: (node) => {
            if (!exportedConfigName) {
              return;
            }
            if (node.declarations[0]?.id.type === "Identifier" && node.declarations[0].id.name === exportedConfigName && node.declarations[0].init?.type === "ObjectExpression") {
              const nextConfigProps = node.declarations[0].init.properties.filter(
                (p) => p.type === "Property"
              );
              checkConfigPropsRecursively(nextConfigProps, context, options);
            }
          },
          ExpressionStatement: (node) => {
            const exportedValue = extractModuleExportValue(node);
            if (exportedValue?.type === "ObjectExpression") {
              const nextConfigProps = exportedValue.properties.filter(
                (p) => p.type === "Property"
              );
              checkConfigPropsRecursively(nextConfigProps, context, options);
            }
          }
        };
      },
      meta: {
        schema: [ruleSchema],
        fixable: "code",
        docs: {
          url: "https://github.com/cloudflare/next-on-pages/blob/main/packages/eslint-plugin-next-on-pages/docs/rules/no-unsupported-configs.md"
        }
      }
    };
    function checkConfigPropsRecursively(nextConfigProps, context, options, propPath = "") {
      nextConfigProps.forEach((prop) => {
        if (prop.type !== "Property" || prop.key.type !== "Identifier")
          return;
        const fullPropName = `${propPath}${prop.key.name}`;
        if (prop.value.type === "ObjectExpression" && nestedConfigPaths.has(fullPropName)) {
          const props = prop.value.properties.filter(
            (p) => p.type === "Property"
          );
          checkConfigPropsRecursively(props, context, options, `${fullPropName}/`);
          return;
        }
        if (indefinitelyUnsupportedConfigs.has(fullPropName)) {
          context.report({
            message: `The "${fullPropName}" configuration is not supported by next-on-pages (and is unlikely to be supported in the future).`,
            node: prop.key
          });
          return;
        }
        if (currentlyUnsupportedConfigs.has(fullPropName)) {
          if (options.includeCurrentlyUnsupported) {
            context.report({
              message: `The "${fullPropName}" configuration is not currently supported by next-on-pages.`,
              node: prop.key
            });
          }
          return;
        }
        if (options.includeUnrecognized && !supportedConfigs.has(fullPropName)) {
          context.report({
            message: `The "${fullPropName}" configuration is not recognized by next-on-pages (it might or might not be supported).`,
            node: prop.key
          });
          return;
        }
      });
    }
    function getConfigVariableName(code) {
      const { ast } = code;
      for (const node of ast.body) {
        const exportedValue = extractModuleExportValue(node);
        if (exportedValue?.type === "Identifier") {
          return exportedValue.name;
        }
        const esmExportedValue = extractESMExportValue(node);
        if (esmExportedValue?.type === "Identifier") {
          return esmExportedValue.name;
        }
      }
      const nodeAfterNextConfigComment = getNodeAfterNextConfigTypeComment(code);
      if (nodeAfterNextConfigComment?.type === "VariableDeclaration" && nodeAfterNextConfigComment.declarations.length === 1 && nodeAfterNextConfigComment.declarations[0]?.id.type === "Identifier") {
        return nodeAfterNextConfigComment.declarations[0]?.id.name;
      }
      return null;
    }
    function getNodeAfterNextConfigTypeComment(code) {
      return code.ast.body.find((node) => {
        const comments = code.getCommentsBefore(node);
        return comments.find((comment) => {
          const parsedComment = parse(`/*${comment.value}*/`)[0];
          return parsedComment?.tags.find(
            ({ tag, type }) => tag === "type" && /^import\s*\(\s*(['"])next\1\s*\)\s*\.\s*NextConfig$/.test(type)
          );
        });
      }) ?? null;
    }
    function extractModuleExportValue(node) {
      if (node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression" && node.expression.left.type === "MemberExpression" && node.expression.left.object.type === "Identifier" && node.expression.left.object.name === "module" && node.expression.left.property.type === "Identifier" && node.expression.left.property.name === "exports") {
        return node.expression.right;
      }
      return null;
    }
    function extractESMExportValue(node) {
      if (node.type === "ExportDefaultDeclaration") {
        return node.declaration;
      }
      return null;
    }
    module2.exports = rule;
  }
});

// src/utils/ast-traversal.ts
function getProgramNode(node) {
  let currentNode = node;
  if (currentNode.type === "Program") {
    return currentNode;
  }
  while (currentNode.parent) {
    currentNode = currentNode.parent;
    if (currentNode.type === "Program") {
      return currentNode;
    }
  }
  return null;
}
function traverseAST(allVisitorKeys, node, visitor) {
  const queue = [node];
  while (queue.length) {
    const currentNode = queue.shift();
    visitor(currentNode);
    const visitorKeys = allVisitorKeys[currentNode.type];
    if (!visitorKeys) {
      continue;
    }
    visitorKeys.forEach((visitorKey) => {
      const child = currentNode[visitorKey];
      if (!child) {
        return;
      }
      if (Array.isArray(child)) {
        for (const item of child) {
          queue.push(item);
        }
        return;
      }
      queue.push(child);
    });
  }
}
var init_ast_traversal = __esm({
  "src/utils/ast-traversal.ts"() {
    "use strict";
  }
});

// src/rules/no-app-nodejs-dynamic-ssg.ts
var require_no_app_nodejs_dynamic_ssg = __commonJS({
  "src/rules/no-app-nodejs-dynamic-ssg.ts"(exports2, module2) {
    "use strict";
    init_ast_traversal();
    var rule = {
      create: (context) => {
        const insideAppRouter = context.filename.includes("/app/");
        const insideAppApiRoute = context.filename.includes("/app/api");
        const isPage = context.filename.match(/page\.[jt]sx/);
        if (!insideAppRouter || !isPage || insideAppApiRoute) {
          return {};
        }
        let exportRuntimeEdgeFound = false;
        let dynamicParamsFalseFound = false;
        return {
          ExportNamedDeclaration: (node) => {
            const declaration = node.declaration;
            if (declaration?.type === "FunctionDeclaration" && declaration.id?.name === "generateStaticParams") {
              const program = getProgramNode(node);
              if (!program) {
                return;
              }
              traverseAST(context.sourceCode.visitorKeys, program, (node2) => {
                if (node2.type === "ExportNamedDeclaration") {
                  if (node2.declaration?.type === "VariableDeclaration" && node2.declaration.declarations.length === 1 && node2.declaration.declarations[0]?.id.type === "Identifier" && node2.declaration.declarations[0].id.name === "runtime" && node2.declaration.declarations[0].init?.type === "Literal" && node2.declaration.declarations[0].init?.value === "edge") {
                    exportRuntimeEdgeFound = true;
                  }
                  if (node2.declaration?.type === "VariableDeclaration" && node2.declaration.declarations.length === 1 && node2.declaration.declarations[0]?.id.type === "Identifier" && node2.declaration.declarations[0].id.name === "dynamicParams" && node2.declaration.declarations[0].init?.type === "Literal" && node2.declaration.declarations[0].init.value === false) {
                    dynamicParamsFalseFound = true;
                  }
                }
              });
              if (!exportRuntimeEdgeFound && !dynamicParamsFalseFound) {
                context.report({
                  message: "`generateStaticParams` cannot be used without opting in to the edge runtime or opting out of Dynamic segment handling",
                  node: declaration.id
                });
              }
            }
          }
        };
      },
      meta: {
        fixable: "code",
        docs: {
          url: "https://github.com/cloudflare/next-on-pages/blob/main/packages/eslint-plugin-next-on-pages/docs/rules/no-app-nodejs-dynamic-ssg.md"
        }
      }
    };
    module2.exports = rule;
  }
});

// src/rules/no-pages-nodejs-dynamic-ssg.ts
var require_no_pages_nodejs_dynamic_ssg = __commonJS({
  "src/rules/no-pages-nodejs-dynamic-ssg.ts"(exports2, module2) {
    "use strict";
    init_ast_traversal();
    var rule = {
      create: (context) => {
        const insidePagesRouter = context.filename.includes("/pages/");
        const insidePagesApiRoute = context.filename.includes("/pages/api");
        const isJTsx = context.filename.match(/\.[jt]sx$/);
        if (!insidePagesRouter || !isJTsx || insidePagesApiRoute) {
          return {};
        }
        let exportRuntimeEdgeFound = false;
        let nonFalseFallbackValue = null;
        return {
          ExportNamedDeclaration: (node) => {
            const declaration = node.declaration;
            if (declaration?.type === "FunctionDeclaration" && declaration.id?.name === "getStaticPaths") {
              traverseAST(
                context.sourceCode.visitorKeys,
                declaration.body,
                (node2) => {
                  if (node2.type === "ReturnStatement") {
                    if (node2.argument?.type === "ObjectExpression") {
                      nonFalseFallbackValue = getNonFalseFallbackPropIfPresent(
                        node2.argument
                      );
                      return;
                    }
                    if (node2.argument?.type === "Identifier") {
                      const identifierName = node2.argument.name;
                      const body = declaration.body;
                      traverseAST(
                        context.sourceCode.visitorKeys,
                        body,
                        (node3) => {
                          if (node3.type === "VariableDeclaration") {
                            const targetDeclaration = node3.declarations.find(
                              (declaration2) => declaration2.id.type === "Identifier" && declaration2.id.name === identifierName && declaration2.init?.type === "ObjectExpression"
                            );
                            if (targetDeclaration) {
                              nonFalseFallbackValue = getNonFalseFallbackPropIfPresent(
                                targetDeclaration.init
                              );
                            }
                          }
                        }
                      );
                      return;
                    }
                  }
                }
              );
              const program = getProgramNode(node);
              if (!program) {
                return;
              }
              traverseAST(context.sourceCode.visitorKeys, program, (node2) => {
                if (node2.type === "ExportNamedDeclaration") {
                  if (isExperimentalEdgeRuntimeExport(node2) || isConfigExperimentalEdgeRuntimeExport(node2)) {
                    exportRuntimeEdgeFound = true;
                    return;
                  }
                  isConfigExperimentalEdgeRuntimeExport(node2);
                }
              });
              if (nonFalseFallbackValue && !exportRuntimeEdgeFound) {
                context.report({
                  message: "`getStaticPaths` cannot set `fallback` to anything but `false` without opting in to the edge runtime",
                  node: nonFalseFallbackValue
                });
              }
            }
          }
        };
      },
      meta: {
        fixable: "code",
        docs: {
          url: "https://github.com/cloudflare/next-on-pages/blob/main/packages/eslint-plugin-next-on-pages/docs/rules/no-pages-nodejs-dynamic-ssg.md"
        }
      }
    };
    function getNonFalseFallbackPropIfPresent(node) {
      const fallbackProp = node.properties.find(
        (prop) => prop.type === "Property" && prop.key.type === "Identifier" && prop.key.name === "fallback"
      );
      if (fallbackProp?.value.type === "Literal" && fallbackProp?.value.value !== false) {
        return fallbackProp.value;
      }
      return null;
    }
    function isExperimentalEdgeRuntimeExport(node) {
      return node.declaration?.type === "VariableDeclaration" && node.declaration.declarations.length === 1 && node.declaration.declarations[0]?.id.type === "Identifier" && node.declaration.declarations[0].id.name === "runtime" && node.declaration.declarations[0].init?.type === "Literal" && node.declaration.declarations[0].init?.value === "experimental-edge";
    }
    function isConfigExperimentalEdgeRuntimeExport(node) {
      if (node.declaration?.type === "VariableDeclaration" && node.declaration.declarations.length === 1 && node.declaration.declarations[0]?.id.type === "Identifier" && node.declaration.declarations[0].id.name === "config" && node.declaration.declarations[0].init?.type === "ObjectExpression") {
        const configObj = node.declaration.declarations[0].init;
        const runtimeProp = configObj.properties.find(
          (prop) => prop.type === "Property" && prop.key.type === "Identifier" && prop.key.name === "runtime"
        );
        if (runtimeProp?.value.type === "Literal" && runtimeProp?.value.value === "experimental-edge") {
          return true;
        }
      }
      return false;
    }
    module2.exports = rule;
  }
});

// src/index.ts
var import_no_nodejs_runtime = __toESM(require_no_nodejs_runtime());
var import_no_unsupported_configs = __toESM(require_no_unsupported_configs());
var import_no_app_nodejs_dynamic_ssg = __toESM(require_no_app_nodejs_dynamic_ssg());
var import_no_pages_nodejs_dynamic_ssg = __toESM(require_no_pages_nodejs_dynamic_ssg());
var config = {
  rules: {
    "no-nodejs-runtime": import_no_nodejs_runtime.default,
    "no-unsupported-configs": import_no_unsupported_configs.default,
    "no-app-nodejs-dynamic-ssg": import_no_app_nodejs_dynamic_ssg.default,
    "no-pages-nodejs-dynamic-ssg": import_no_pages_nodejs_dynamic_ssg.default,
    // the following rule is no longer needed/applicable, it has been converted into a noop (so that it doesn't introduce a breaking change)
    // it should be removed in the next package major release
    "no-app-not-found-runtime": () => ({})
  },
  configs: {
    recommended: {
      plugins: ["eslint-plugin-next-on-pages"],
      rules: {
        "next-on-pages/no-nodejs-runtime": "error",
        "next-on-pages/no-unsupported-configs": "error",
        "next-on-pages/no-app-nodejs-dynamic-ssg": "error",
        "next-on-pages/no-pages-nodejs-dynamic-ssg": "error"
      }
    }
  }
};
module.exports = config;
