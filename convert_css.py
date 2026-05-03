#!/usr/bin/env python3
"""
Convert index.css vanilla CSS properties to Tailwind @apply directives.
Keeps class names identical. Only converts inside @layer components blocks.
Global rules (*, html, body, button, :root, @keyframes, @media) stay as-is.
"""

import re

INPUT_FILE  = r"C:\MyPers\Projects\GetYouCollege\GetYourCollege\src\index.css"
OUTPUT_FILE = r"C:\MyPers\Projects\GetYouCollege\GetYourCollege\src\index.css"

# ---------------------------------------------------------------------------
# Mapping: (property, value_pattern) -> tailwind_class
# Order matters – more specific patterns first
# ---------------------------------------------------------------------------
PROPERTY_MAP = [
    # display
    ("display", "inline-flex",  "@apply inline-flex"),
    ("display", "flex",         "@apply flex"),
    ("display", "grid",         "@apply grid"),
    ("display", "block",        "@apply block"),
    ("display", "none",         "@apply hidden"),
    ("display", "inline-block", None),   # keep
    ("display", "inline",       None),

    # flex direction
    ("flex-direction", "column",        "@apply flex-col"),
    ("flex-direction", "row",           "@apply flex-row"),
    ("flex-direction", "row-reverse",   None),
    ("flex-direction", "column-reverse", None),

    # align-items
    ("align-items", "center",     "@apply items-center"),
    ("align-items", "flex-start", "@apply items-start"),
    ("align-items", "flex-end",   "@apply items-end"),
    ("align-items", "stretch",    "@apply items-stretch"),
    ("align-items", "baseline",   None),

    # justify-content
    ("justify-content", "center",        "@apply justify-center"),
    ("justify-content", "space-between", "@apply justify-between"),
    ("justify-content", "flex-start",    "@apply justify-start"),
    ("justify-content", "flex-end",      "@apply justify-end"),
    ("justify-content", "space-around",  None),

    # flex-wrap
    ("flex-wrap", "wrap",   "@apply flex-wrap"),
    ("flex-wrap", "nowrap", None),

    # flex
    ("flex", "1",  "@apply flex-1"),

    # flex-shrink
    ("flex-shrink", "0", "@apply shrink-0"),

    # position
    ("position", "fixed",    "@apply fixed"),
    ("position", "absolute", "@apply absolute"),
    ("position", "relative", "@apply relative"),
    ("position", "sticky",   "@apply sticky"),
    ("position", "static",   None),

    # inset / top / left / right / bottom
    ("inset", "0", "@apply inset-0"),
    ("top",   "0", "@apply top-0"),
    ("left",  "0", "@apply left-0"),
    ("right", "0", "@apply right-0"),
    ("bottom","0", "@apply bottom-0"),

    # overflow
    ("overflow",   "hidden",  "@apply overflow-hidden"),
    ("overflow",   "visible", "@apply overflow-visible"),
    ("overflow-x", "hidden",  "@apply overflow-x-hidden"),
    ("overflow-y", "auto",    "@apply overflow-y-auto"),
    ("overflow-x", "auto",    None),
    ("overflow-y", "hidden",  None),

    # width / height
    ("width",      "100%",   "@apply w-full"),
    ("height",     "100%",   "@apply h-full"),
    ("min-height", "100vh",  "@apply min-h-screen"),

    # cursor
    ("cursor", "pointer", "@apply cursor-pointer"),
    ("cursor", "default", "@apply cursor-default"),

    # pointer-events
    ("pointer-events", "none", "@apply pointer-events-none"),

    # user-select
    ("user-select",         "none", "@apply select-none"),
    ("-webkit-user-select", "none", None),

    # white-space
    ("white-space", "nowrap", "@apply whitespace-nowrap"),

    # text-align
    ("text-align", "center", "@apply text-center"),
    ("text-align", "left",   "@apply text-left"),
    ("text-align", "right",  "@apply text-right"),

    # font-weight
    ("font-weight", "400", "@apply font-normal"),
    ("font-weight", "500", "@apply font-medium"),
    ("font-weight", "600", "@apply font-semibold"),
    ("font-weight", "700", "@apply font-bold"),
    ("font-weight", "800", "@apply font-extrabold"),
    ("font-weight", "900", "@apply font-black"),

    # font-style
    ("font-style", "italic", "@apply italic"),
    ("font-style", "normal", None),

    # text-decoration
    ("text-decoration", "none",      "@apply no-underline"),
    ("text-decoration", "underline", "@apply underline"),

    # text-transform
    ("text-transform", "uppercase", "@apply uppercase"),
    ("text-transform", "lowercase", "@apply lowercase"),
    ("text-transform", "none",      "@apply normal-case"),
    ("text-transform", "capitalize", None),

    # background-color / background (simple colors)
    ("background-color", "white",       "@apply bg-white"),
    ("background-color", "#fff",        "@apply bg-white"),
    ("background-color", "#ffffff",     "@apply bg-white"),
    ("background-color", "transparent", "@apply bg-transparent"),
    ("background",       "white",       "@apply bg-white"),
    ("background",       "#fff",        "@apply bg-white"),

    # color
    ("color", "white",   "@apply text-white"),
    ("color", "#fff",    "@apply text-white"),
    ("color", "#ffffff", "@apply text-white"),

    # border
    ("border", "none",  "@apply border-0"),

    # border-radius
    ("border-radius", "50%",    "@apply rounded-full"),
    ("border-radius", "9999px", "@apply rounded-full"),
    ("border-radius", "100px",  "@apply rounded-full"),
    ("border-radius", "999px",  "@apply rounded-full"),

    # list-style
    ("list-style", "none", "@apply list-none"),

    # margin
    ("margin", "0 auto", "@apply mx-auto"),

    # max-width
    ("max-width", "1280px", "@apply max-w-[1280px]"),

    # box-sizing
    ("box-sizing", "border-box", "@apply box-border"),

    # scroll-behavior
    ("scroll-behavior", "smooth", "@apply scroll-smooth"),

    # -webkit-font-smoothing
    ("-webkit-font-smoothing", "antialiased", "@apply antialiased"),
]

# Properties that we should NEVER convert (keep as raw CSS)
KEEP_RAW_PROPERTIES = {
    "background",        # complex gradients - we only convert simple ones
    "box-shadow",
    "backdrop-filter",
    "-webkit-backdrop-filter",
    "-webkit-background-clip",
    "background-clip",
    "-webkit-text-fill-color",
    "filter",
    "will-change",
    "animation",
    "transition",        # we handle simple ones specially
    "grid-template-columns",  # keep unless simple repeat
    "grid-template-rows",
    "grid-template-areas",
    "grid-template",
    "grid-area",
    "clip-path",
    "mask-image",
    "-webkit-mask-image",
    "transform",
    "content",
    "counter-increment",
    "stroke",
    "fill",
    "stroke-width",
    "stroke-linecap",
    "stroke-dashoffset",
    "scroll-snap-type",
    "scroll-snap-align",
    "font-variant",
    "-webkit-overflow-scrolling",
    "touch-action",
    "resize",
    "object-fit",
    "object-position",
    "mix-blend-mode",
    "opacity",           # keep as raw
    "visibility",
    "z-index",           # keep as raw (arbitrary values)
    "gap",               # keep as raw (arbitrary values handled specially)
    "column-gap",
    "row-gap",
    "padding",           # handled specially
    "margin",            # some handled, complex ones kept
    "border-radius",     # complex ones kept
    "font-size",         # keep as raw (clamp etc)
    "line-height",       # keep as raw
    "letter-spacing",    # keep as raw
    "background-image",
    "background-size",
    "background-attachment",
    "background-position",
}

# Simple transition mappings
TRANSITION_MAP = {
    "all 0.2s": "@apply transition-all duration-200",
    "all 0.3s": "@apply transition-all duration-300",
    "all 0.25s": "@apply transition-all duration-[250ms]",
    "all 0.2s ease": "@apply transition-all duration-200",
    "all 0.3s ease": "@apply transition-all duration-300",
    "all 0.25s ease": "@apply transition-all duration-[250ms]",
}

def is_simple_color(val):
    """Check if background value is a simple color (not gradient)."""
    val = val.strip().lower()
    return val in ("white", "#fff", "#ffffff", "transparent") and "gradient" not in val

def convert_property_value(prop, val, important_suffix=""):
    """
    Try to convert a single CSS property: value pair to a Tailwind @apply.
    Returns the @apply string or None if it should stay as raw CSS.
    """
    prop = prop.strip().lower()
    val_stripped = val.strip().rstrip(";").strip()
    # Remove !important from value for matching
    has_important = "!important" in val_stripped
    val_clean = val_stripped.replace("!important", "").strip()
    imp = " !important" if has_important else ""

    # ── Special cases first ──

    # transition: only convert simple ones
    if prop == "transition":
        for key, tw in TRANSITION_MAP.items():
            if val_clean.lower() == key:
                return tw + imp
        # cubic-bezier or complex → keep raw
        return None

    # background: only convert solid color shortcuts
    if prop in ("background", "background-color"):
        if is_simple_color(val_clean):
            if val_clean in ("white", "#fff", "#ffffff"):
                return "@apply bg-white" + imp
            if val_clean == "transparent":
                return "@apply bg-transparent" + imp
        return None  # keep complex backgrounds

    # color: white variants
    if prop == "color":
        if val_clean.lower() in ("white", "#fff", "#ffffff"):
            return "@apply text-white" + imp
        return None

    # border: none
    if prop == "border" and val_clean.lower() == "none":
        return "@apply border-0" + imp

    # border-radius: only simple full-circle values
    if prop == "border-radius":
        if val_clean in ("50%", "9999px", "100px", "999px"):
            return "@apply rounded-full" + imp
        return None

    # margin: only 0 auto
    if prop == "margin" and val_clean == "0 auto":
        return "@apply mx-auto" + imp

    # max-width: only 1280px
    if prop == "max-width" and val_clean == "1280px":
        return "@apply max-w-[1280px]" + imp

    # box-sizing: border-box
    if prop == "box-sizing" and val_clean == "border-box":
        return "@apply box-border" + imp

    # Now walk the PROPERTY_MAP
    for (p, v, tw) in PROPERTY_MAP:
        if prop == p and val_clean.lower() == v.lower():
            if tw is None:
                return None
            return tw + imp

    return None


def should_skip_conversion(prop):
    """Some properties are always kept as raw CSS."""
    prop = prop.strip().lower()
    # We handle certain props ourselves above; the rest are skipped
    if prop in KEEP_RAW_PROPERTIES:
        return True
    return False


def convert_declarations_block(block_content):
    """
    Given the content between { and } of a CSS rule,
    convert qualifying property: value pairs to @apply.
    Returns new block content.
    """
    lines = block_content.split("\n")
    result_lines = []
    apply_classes = []  # collect @apply tokens for this block

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Skip empty lines, comments
        if not stripped or stripped.startswith("/*") or stripped.startswith("//"):
            result_lines.append(line)
            i += 1
            continue

        # Try to parse as "property: value;"
        # Handle multi-line values (unlikely for properties we care about)
        m = re.match(r'^(\s*)([\w-]+)\s*:\s*(.+?)\s*;?\s*$', line)
        if m:
            indent = m.group(1)
            prop = m.group(2).strip()
            val = m.group(3).strip()

            if should_skip_conversion(prop):
                result_lines.append(line)
                i += 1
                continue

            tw = convert_property_value(prop, val)
            if tw is not None:
                # Replace with @apply
                result_lines.append(f"{indent}{tw};")
            else:
                result_lines.append(line)
        else:
            result_lines.append(line)
        i += 1

    return "\n".join(result_lines)


# ── Global-level selectors that must stay outside @layer components ──
GLOBAL_SELECTORS = re.compile(
    r'^(\*|html|body|button|:root|@keyframes|@media|@charset|@import|@tailwind|@layer)',
    re.IGNORECASE
)


def is_global_rule(selector):
    """Return True if this selector/rule should live outside @layer components."""
    s = selector.strip()
    return bool(GLOBAL_SELECTORS.match(s))


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MAIN CONVERSION LOGIC
# We do a two-pass approach:
#  Pass 1: Read the whole file and split into "tokens" (rules, at-rules, etc.)
#  Pass 2: Convert declarations, then reassemble into the desired output format
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def parse_css_tokens(text):
    """
    Tokenize CSS into a list of tokens. Each token is a dict:
      { "type": "rule"|"at-rule"|"comment"|"whitespace",
        "raw": "...",
        "selector": "...",     # for rules
        "declarations": "...", # for rules
        "atrule": "...",       # for at-rules like @media @keyframes
        "block": "...",        # inner block content for nested at-rules
      }
    This is a simplified tokenizer (not a full CSS parser).
    """
    tokens = []
    pos = 0
    n = len(text)

    def peek(offset=0):
        p = pos + offset
        return text[p] if p < n else ""

    # We'll use a character-by-character approach with brace counting
    # to extract complete rules and at-rules.
    i = [0]  # mutable position

    def read_comment():
        start = i[0]
        i[0] += 2  # skip /*
        while i[0] < n - 1:
            if text[i[0]] == "*" and text[i[0]+1] == "/":
                i[0] += 2
                break
            i[0] += 1
        return text[start:i[0]]

    def read_string(quote_char):
        start = i[0]
        i[0] += 1  # skip opening quote
        while i[0] < n:
            c = text[i[0]]
            if c == "\\":
                i[0] += 2
                continue
            if c == quote_char:
                i[0] += 1
                break
            i[0] += 1
        return text[start:i[0]]

    def read_until_brace_or_semicolon():
        """Read until we hit { or ; (for the selector part)."""
        start = i[0]
        while i[0] < n:
            c = text[i[0]]
            if c in ("'", '"'):
                read_string(c)
                continue
            if c in ("{", ";"):
                break
            if text[i[0]:i[0]+2] == "/*":
                read_comment()
                continue
            i[0] += 1
        return text[start:i[0]]

    def read_block():
        """Read content between { and matching }, returning content inside braces."""
        assert text[i[0]] == "{"
        i[0] += 1  # skip {
        start = i[0]
        depth = 1
        while i[0] < n and depth > 0:
            c = text[i[0]]
            if c in ("'", '"'):
                read_string(c)
                continue
            if text[i[0]:i[0]+2] == "/*":
                read_comment()
                continue
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    end = i[0]
                    i[0] += 1  # skip }
                    return text[start:end]
            i[0] += 1
        return text[start:i[0]]

    while i[0] < n:
        # Skip whitespace
        if text[i[0]].isspace():
            start = i[0]
            while i[0] < n and text[i[0]].isspace():
                i[0] += 1
            tokens.append({"type": "whitespace", "raw": text[start:i[0]]})
            continue

        # Comment
        if text[i[0]:i[0]+2] == "/*":
            raw = read_comment()
            tokens.append({"type": "comment", "raw": raw})
            continue

        # At-rule
        if text[i[0]] == "@":
            start = i[0]
            selector_part = read_until_brace_or_semicolon()
            if i[0] < n and text[i[0]] == ";":
                # Simple at-rule like @import, @tailwind, @charset
                i[0] += 1
                raw = selector_part + ";"
                tokens.append({"type": "at-simple", "raw": raw, "selector": selector_part.strip()})
            elif i[0] < n and text[i[0]] == "{":
                block = read_block()
                raw = selector_part + "{" + block + "}"
                tokens.append({
                    "type": "at-block",
                    "raw": raw,
                    "selector": selector_part.strip(),
                    "block": block
                })
            else:
                tokens.append({"type": "at-simple", "raw": selector_part, "selector": selector_part.strip()})
            continue

        # Regular rule: selector { declarations }
        selector_part = read_until_brace_or_semicolon()
        if i[0] < n and text[i[0]] == "{":
            block = read_block()
            raw = selector_part + "{" + block + "}"
            tokens.append({
                "type": "rule",
                "raw": raw,
                "selector": selector_part.strip(),
                "declarations": block
            })
        elif i[0] < n and text[i[0]] == ";":
            # Stray declaration outside a rule? Keep as-is
            i[0] += 1
            tokens.append({"type": "raw", "raw": selector_part + ";"})
        else:
            if selector_part.strip():
                tokens.append({"type": "raw", "raw": selector_part})

    return tokens


def convert_declarations(declarations):
    """Convert property: value pairs inside a rule block."""
    return convert_declarations_block(declarations)


def is_class_selector(selector):
    """
    Returns True if selector starts with a dot (class selector) or
    contains class selectors (e.g., .foo:hover, .foo .bar, etc.)
    but is NOT a global element selector.
    """
    s = selector.strip()
    # Skip globals
    if re.match(r'^(\*|html|body|button)\b', s, re.IGNORECASE):
        return False
    if re.match(r'^:(root|not|is|where|has)\b', s, re.IGNORECASE):
        return False
    # Consider as class rule if it has a class selector somewhere
    if "." in s or "#" in s or "[" in s:
        return True
    # Element-only selectors like `h1, h2` – keep outside
    return False


def process_at_block_for_media_keyframes(selector, block):
    """
    For @media / @keyframes / @layer blocks: recursively process inner content.
    These stay at top level, but inner class rules get declarations converted.
    """
    if selector.lower().startswith("@keyframes"):
        # Keep entirely as-is
        return selector + " {\n" + block + "\n}"

    if selector.lower().startswith("@layer"):
        # Keep @layer as-is but convert inner declarations
        inner_tokens = parse_css_tokens(block)
        inner_out = []
        for t in inner_tokens:
            if t["type"] == "rule":
                new_decl = convert_declarations(t["declarations"])
                inner_out.append(t["selector"] + " {" + new_decl + "}")
            elif t["type"] == "at-block":
                inner_out.append(process_at_block_for_media_keyframes(t["selector"], t["block"]))
            else:
                inner_out.append(t["raw"])
        return selector + " {\n" + "".join(inner_out) + "\n}"

    if selector.lower().startswith("@media"):
        # Convert declarations inside but keep @media wrapper
        inner_tokens = parse_css_tokens(block)
        inner_out = []
        for t in inner_tokens:
            if t["type"] == "rule":
                new_decl = convert_declarations(t["declarations"])
                inner_out.append(t["selector"] + " {" + new_decl + "}")
            elif t["type"] == "at-block":
                inner_out.append(process_at_block_for_media_keyframes(t["selector"], t["block"]))
            else:
                inner_out.append(t["raw"])
        return selector + " {\n" + "".join(inner_out) + "\n}"

    # Other at-blocks: keep as-is
    return selector + " {\n" + block + "\n}"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Alternative: simpler line-by-line approach
# Given the complexity, let's use a line-by-line approach instead
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def convert_line_value(prop, raw_value):
    """
    Given a CSS property name and raw value string (may include !important),
    return either a Tailwind @apply string or None (keep raw).
    """
    has_important = "!important" in raw_value
    val = raw_value.replace("!important", "").strip().rstrip(";").strip()
    imp = " !important" if has_important else ""

    result = convert_property_value(prop, val)
    if result is not None:
        return result + imp
    return None


def process_css_text(text):
    """
    Main conversion: processes the CSS text and returns converted text.

    Strategy:
    - The file is a mix of global rules and class rules.
    - We need to wrap class rules in @layer components.
    - Global rules (*, html, body, button, :root, @keyframes, @media) stay at top.
    - We keep the original file structure but:
      1. Add the @tailwind directives at top
      2. Keep :root, *, html, body, button as-is
      3. Wrap class selector blocks in @layer components
      4. Convert qualifying declarations inside all rules (class or global)
      5. Keep @media and @keyframes outside @layer

    Actually, re-reading the requirements:
    "Wrap ALL class rules inside @layer components { } blocks"
    "Keep :root, *, html, body, button, @keyframes, @media rules OUTSIDE @layer (at the top level)"

    Since the file already has many rules and we need to group them into @layer components,
    the safest approach is:
    1. Extract all content
    2. Identify which rules are "global" and which are "class rules"
    3. Output: header + global rules + @layer components { all class rules } + media/keyframes at end

    But that would completely reorder the file. A simpler interpretation:
    "Wrap each class rule in @layer components { }" individually.
    """
    pass


def simple_declaration_convert(line, indent=""):
    """
    Given a single CSS declaration line like "  display: flex;",
    return the converted line or the original if no conversion applies.
    """
    # Match: optional-indent property: value ;
    m = re.match(r'^(\s*)([\w-]+)\s*:\s*(.+?)(\s*;?\s*)$', line)
    if not m:
        return line

    prefix = m.group(1)
    prop = m.group(2).strip()
    val_full = m.group(3)
    suffix = m.group(4)

    # Determine if there's a semicolon
    has_semi = ";" in val_full or ";" in suffix
    val_clean = val_full.rstrip(";").strip()

    has_important = "!important" in val_clean
    val_no_imp = val_clean.replace("!important", "").strip()
    imp_str = " !important" if has_important else ""

    result = convert_property_value(prop, val_no_imp)
    if result is not None:
        return prefix + result + imp_str + ";"
    return line


# ──────────────────────────────────────────────────────────────────────────
# The actual implementation: read file, convert line by line within blocks
# ──────────────────────────────────────────────────────────────────────────

def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        original = f.read()

    lines = original.split("\n")

    # We'll track context:
    # - Are we inside an @keyframes block? (don't convert)
    # - Are we inside a comment block?
    # - Are we inside a regular CSS rule block?

    output_lines = []
    in_comment = False
    brace_depth = 0
    in_keyframes = False
    in_rule_block = False
    keyframes_depth = 0
    current_selector = ""
    selector_buffer = []  # collect selector lines before {

    # Track whether current selector is a "class" selector for @layer wrapping
    layer_open = False
    pending_layer_close = False

    # We'll use a different, simpler approach:
    # Just convert declaration lines within blocks. Don't restructure.
    # The @layer wrapping requirement will be done by wrapping groups.

    # Even simpler: since the task says "wrap ALL class rules inside @layer components blocks",
    # and the file has hundreds of rules, we'll:
    # 1. Output the preamble (import, tailwind directives, :root, *, html, body, button)
    # 2. Open ONE @layer components { block
    # 3. Output all class rules (with converted declarations)
    # 4. Close the @layer block
    # 5. Output all @media and @keyframes blocks at the end
    #
    # This means we need to separate the content into:
    # - "global" section (before first class rule)
    # - class rules
    # - @media/@keyframes (collected throughout)

    # Let's parse the entire file into segments

    i = 0
    n = len(lines)

    # Output sections
    preamble_lines = []      # @import, @tailwind, :root, *, html, body, button
    class_rule_lines = []    # all class rules (to be wrapped in @layer)
    media_kf_lines = []      # @media, @keyframes

    # State machine
    STATE_GLOBAL = "global"
    STATE_IN_GLOBAL_RULE = "in_global_rule"
    STATE_IN_CLASS_RULE = "in_class_rule"
    STATE_IN_MEDIA = "in_media"
    STATE_IN_KEYFRAMES = "in_keyframes"

    state = STATE_GLOBAL
    depth = 0
    rule_buffer = []
    current_sel = ""

    # We need to handle the fact that @media blocks contain class rules
    # For @media: we output them at end, converting inner declarations

    def is_global_selector(sel):
        sel = sel.strip()
        if not sel:
            return False
        # Pure element selectors, pseudo-elements on elements, :root
        patterns = [
            r'^\*\s*$',
            r'^html\b',
            r'^body\b',
            r'^button\b',
            r'^:root\b',
            r'^h[1-6]\b',
            r'^p\b',
            r'^a\b',
            r'^img\b',
            r'^table\b',
            r'^input\b',
            r'^select\b',
            r'^textarea\b',
            r'^ul\b',
            r'^ol\b',
            r'^li\b',
            r'^div\b',  # bare div - treat as global
            r'^span\b',
        ]
        for pat in patterns:
            if re.match(pat, sel, re.IGNORECASE):
                return True
        # Comma-separated: if all parts are global
        parts = [p.strip() for p in sel.split(",")]
        if len(parts) > 1:
            all_global = all(is_global_selector(p) for p in parts)
            return all_global
        return False

    def count_braces(s):
        return s.count("{") - s.count("}")

    # Instead of a complex state machine, let's use a different approach:
    # Walk through the original text character by character to find top-level blocks

    # Read the entire text and find top-level tokens
    raw = original

    # Remove the @import line (we'll add our own at the top)
    # Find first line
    first_line = lines[0].strip()

    PREAMBLE = """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=Caveat:wght@700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

"""

    # We'll do a simpler structural approach:
    # 1. Parse the whole file to find top-level rules
    # 2. Categorize them
    # 3. Reassemble

    class CSSParser:
        def __init__(self, text):
            self.text = text
            self.pos = 0
            self.n = len(text)

        def peek(self, ahead=0):
            p = self.pos + ahead
            return self.text[p] if p < self.n else ""

        def skip_whitespace(self):
            while self.pos < self.n and self.text[self.pos].isspace():
                self.pos += 1

        def read_comment(self):
            start = self.pos
            self.pos += 2
            while self.pos < self.n - 1:
                if self.text[self.pos] == "*" and self.text[self.pos+1] == "/":
                    self.pos += 2
                    break
                self.pos += 1
            return self.text[start:self.pos]

        def read_string(self):
            q = self.text[self.pos]
            start = self.pos
            self.pos += 1
            while self.pos < self.n:
                c = self.text[self.pos]
                if c == "\\":
                    self.pos += 2
                    continue
                if c == q:
                    self.pos += 1
                    break
                self.pos += 1
            return self.text[start:self.pos]

        def read_until(self, stop_chars):
            start = self.pos
            while self.pos < self.n:
                c = self.text[self.pos]
                if c in stop_chars:
                    break
                if c in ("'", '"'):
                    self.read_string()
                    continue
                if self.text[self.pos:self.pos+2] == "/*":
                    self.read_comment()
                    continue
                if c == "(":
                    # read until matching )
                    depth = 0
                    while self.pos < self.n:
                        cc = self.text[self.pos]
                        if cc == "(": depth += 1
                        elif cc == ")":
                            depth -= 1
                            self.pos += 1
                            if depth == 0: break
                            continue
                        elif cc in ("'", '"'):
                            self.read_string()
                            continue
                        self.pos += 1
                    continue
                self.pos += 1
            return self.text[start:self.pos]

        def read_block(self):
            """Read { ... } with nesting."""
            assert self.text[self.pos] == "{", f"Expected {{ at {self.pos}, got {self.text[self.pos]!r}"
            start = self.pos
            self.pos += 1
            depth = 1
            while self.pos < self.n and depth > 0:
                c = self.text[self.pos]
                if c in ("'", '"'):
                    self.read_string()
                    continue
                if self.text[self.pos:self.pos+2] == "/*":
                    self.read_comment()
                    continue
                if c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                self.pos += 1
            return self.text[start:self.pos]

        def parse(self):
            """Returns list of top-level tokens."""
            tokens = []
            while self.pos < self.n:
                self.skip_whitespace()
                if self.pos >= self.n:
                    break

                # Comment
                if self.text[self.pos:self.pos+2] == "/*":
                    raw = self.read_comment()
                    tokens.append({"type": "comment", "raw": raw})
                    continue

                # At-rule
                if self.text[self.pos] == "@":
                    sel = self.read_until("{;")
                    if self.pos < self.n and self.text[self.pos] == ";":
                        self.pos += 1
                        raw = sel + ";"
                        tokens.append({"type": "at-simple", "raw": raw, "sel": sel.strip()})
                    elif self.pos < self.n and self.text[self.pos] == "{":
                        block = self.read_block()
                        raw = sel + block
                        tokens.append({"type": "at-block", "raw": raw, "sel": sel.strip(), "block": block[1:-1]})
                    else:
                        tokens.append({"type": "raw", "raw": sel})
                    continue

                # Rule: selector { declarations }
                sel = self.read_until("{")
                if self.pos < self.n and self.text[self.pos] == "{":
                    block = self.read_block()
                    raw = sel + block
                    tokens.append({"type": "rule", "raw": raw, "sel": sel.strip(), "block": block[1:-1]})
                else:
                    if sel.strip():
                        tokens.append({"type": "raw", "raw": sel})

            return tokens

    # Parse the file
    parser = CSSParser(raw)
    tokens = parser.parse()

    # Now process tokens
    # Categories:
    # 1. at-simple: @import, @tailwind → preamble (skip original @import, we add our own)
    # 2. :root → preamble
    # 3. *, html, body, button → preamble
    # 4. @keyframes → media_kf section
    # 5. @media → media_kf section (with converted inner declarations)
    # 6. @layer → class_rule section (or handle separately)
    # 7. class rules → class_rule section
    # 8. comments → associate with following content

    preamble_parts = []
    class_parts = []
    media_kf_parts = []

    # Helper to convert declarations inside a block of text
    def convert_single_declaration(prop, val_raw, indent=""):
        """Convert one property: value pair. Returns the converted line."""
        has_imp = "!important" in val_raw
        val_clean = val_raw.replace("!important", "").rstrip(";").strip()
        imp = " !important" if has_imp else ""

        tw = convert_property_value(prop, val_clean)
        if tw is not None:
            return indent + tw + imp + ";"
        else:
            return None  # keep original

    def convert_declarations_text(block_text):
        """Convert property declarations in a text block.
        Handles both multi-line and inline (semicolon-separated) declarations."""
        # First, check if the block has inline declarations (multiple on one line)
        # We'll normalize by splitting on semicolons while being careful about
        # parentheses (functions like url(), linear-gradient(), etc.)

        def split_declarations(text):
            """Split a CSS declarations block into individual declaration strings."""
            declarations = []
            current = ""
            paren_depth = 0
            i = 0
            while i < len(text):
                c = text[i]
                if c == "(" :
                    paren_depth += 1
                    current += c
                elif c == ")":
                    paren_depth -= 1
                    current += c
                elif c == ";" and paren_depth == 0:
                    current = current.strip()
                    if current:
                        declarations.append(current)
                    current = ""
                elif c == "/" and i + 1 < len(text) and text[i+1] == "*":
                    # CSS comment - find end
                    end = text.find("*/", i + 2)
                    if end == -1:
                        current += text[i:]
                        break
                    current += text[i:end+2]
                    i = end + 2
                    continue
                elif c == "{":
                    # Nested rule inside block (shouldn't happen in declarations)
                    # Skip to matching }
                    depth = 1
                    current += c
                    i += 1
                    while i < len(text) and depth > 0:
                        cc = text[i]
                        current += cc
                        if cc == "{": depth += 1
                        elif cc == "}": depth -= 1
                        i += 1
                    continue
                else:
                    current += c
                i += 1
            current = current.strip()
            if current:
                declarations.append(current)
            return declarations

        # Check if block has multiple declarations inline (no newlines between them)
        lines = block_text.split("\n")

        result_lines = []
        for line in lines:
            stripped = line.strip()
            if not stripped:
                result_lines.append(line)
                continue
            if stripped.startswith("/*") or stripped.startswith("//"):
                result_lines.append(line)
                continue

            # Check if line contains multiple declarations (multiple property:value;)
            # by counting semicolons and colons
            # A declaration looks like: prop: value;
            decl_pattern = re.compile(r'([\w-]+)\s*:\s*', re.IGNORECASE)
            matches = list(decl_pattern.finditer(stripped))

            if len(matches) > 1 and ";" in stripped:
                # Multiple declarations on one line - split them
                indent = len(line) - len(line.lstrip())
                prefix = " " * indent

                # Split by semicolons (respecting parens)
                decls = split_declarations(stripped)
                converted = []
                for decl in decls:
                    decl = decl.strip()
                    if not decl:
                        continue
                    # Parse prop: value
                    dm = re.match(r'^([\w-]+)\s*:\s*(.+)$', decl)
                    if dm:
                        prop = dm.group(1).strip()
                        val_raw = dm.group(2).strip()
                        converted_line = convert_single_declaration(prop, val_raw, prefix)
                        if converted_line is not None:
                            converted.append(converted_line)
                        else:
                            converted.append(prefix + decl + ";")
                    else:
                        converted.append(prefix + decl + (";"))
                result_lines.extend(converted)
            else:
                # Single declaration line
                m = re.match(r'^(\s*)([\w-]+)\s*:\s*(.+?)\s*;?\s*$', line)
                if m:
                    indent_str = m.group(1)
                    prop = m.group(2).strip()
                    val_raw = m.group(3).strip()

                    converted_line = convert_single_declaration(prop, val_raw, indent_str)
                    if converted_line is not None:
                        result_lines.append(converted_line)
                    else:
                        result_lines.append(line)
                else:
                    result_lines.append(line)

        return "\n".join(result_lines)

    def convert_at_block_inner(sel, block):
        """
        For @media and @keyframes blocks: recursively handle inner content.
        @keyframes: keep as-is
        @media: convert inner declarations
        """
        sel_lower = sel.strip().lower()

        if sel_lower.startswith("@keyframes") or sel_lower.startswith("@-webkit-keyframes"):
            return sel + " {" + block + "}"

        if sel_lower.startswith("@media") or sel_lower.startswith("@supports"):
            # Parse inner tokens and convert declarations
            inner = CSSParser(block)
            inner_tokens = inner.parse()
            out = []
            for t in inner_tokens:
                if t["type"] == "rule":
                    new_block = convert_declarations_text(t["block"])
                    out.append(t["sel"] + " {" + new_block + "}")
                elif t["type"] == "at-block":
                    out.append(convert_at_block_inner(t["sel"], t["block"]))
                elif t["type"] == "comment":
                    out.append(t["raw"])
                else:
                    out.append(t["raw"])
            return sel + " {\n" + "".join(out) + "\n}"

        # Other at-blocks
        return sel + " {" + block + "}"

    # Separate preamble from everything else
    # We want: first @import → our replacement, :root and *, html, body, button rules → preamble
    # Everything else: class rules → @layer components, @media/@keyframes → end

    pending_comment = []

    for tok in tokens:
        t = tok["type"]
        raw = tok["raw"]

        if t == "comment":
            pending_comment.append(raw)
            continue

        flush_comment = "\n".join(pending_comment) + ("\n" if pending_comment else "")
        pending_comment = []

        if t == "at-simple":
            sel = tok["sel"]
            if sel.startswith("@import"):
                # Skip - we add our own
                preamble_parts.append(flush_comment)
                continue
            elif sel.startswith("@tailwind") or sel.startswith("@charset"):
                preamble_parts.append(flush_comment)
                preamble_parts.append(raw + "\n")
                continue
            else:
                preamble_parts.append(flush_comment)
                preamble_parts.append(raw + "\n")
                continue

        if t == "at-block":
            sel = tok["sel"].strip()
            sel_lower = sel.lower()
            block = tok["block"]

            if sel_lower.startswith("@keyframes") or sel_lower.startswith("@-webkit-keyframes"):
                media_kf_parts.append("\n" + flush_comment + raw + "\n")
                continue
            elif sel_lower.startswith("@media") or sel_lower.startswith("@supports"):
                converted = convert_at_block_inner(sel, block)
                media_kf_parts.append("\n" + flush_comment + converted + "\n")
                continue
            elif sel_lower.startswith("@layer"):
                # Keep @layer but convert inner
                inner = CSSParser(block)
                inner_tokens = inner.parse()
                out = []
                for it in inner_tokens:
                    if it["type"] == "rule":
                        nb = convert_declarations_text(it["block"])
                        out.append(it["sel"] + " {" + nb + "}")
                    elif it["type"] == "at-block":
                        out.append(convert_at_block_inner(it["sel"], it["block"]))
                    else:
                        out.append(it["raw"])
                class_parts.append("\n" + flush_comment + sel + " {\n" + "".join(out) + "\n}\n")
                continue
            else:
                # Other at-blocks (e.g., @font-face)
                preamble_parts.append(flush_comment + raw + "\n")
                continue

        if t == "rule":
            sel = tok["sel"].strip()
            block = tok["block"]
            new_block = convert_declarations_text(block)

            # Determine if it's a global rule
            # Global: :root, *, html, body, button (and their pseudo-classes)
            sel_base = re.sub(r':\S+', '', sel).strip()  # remove pseudo-classes
            sel_parts = [p.strip() for p in sel_base.split(",")]

            def is_preamble_selector(s):
                s = s.strip()
                return bool(re.match(r'^(:root|\*|html|body|button)(\s*[:{.].*)?$', s, re.IGNORECASE))

            all_preamble = all(is_preamble_selector(p) for p in sel_parts if p)

            if all_preamble:
                preamble_parts.append(flush_comment + sel + " {" + new_block + "}\n")
            else:
                class_parts.append("\n" + flush_comment + sel + " {" + new_block + "}\n")
            continue

        # raw
        preamble_parts.append(flush_comment + raw)

    # Flush remaining comments
    if pending_comment:
        class_parts.append("\n".join(pending_comment))

    # ── Assemble output ──
    output_parts = []

    # 1. Our fixed preamble
    output_parts.append(PREAMBLE)

    # 2. Original preamble rules (sans @import)
    for p in preamble_parts:
        if p.strip():
            output_parts.append(p)

    # 3. @layer components { all class rules }
    if class_parts:
        output_parts.append("\n@layer components {\n")
        for cp in class_parts:
            output_parts.append(cp)
        output_parts.append("\n}\n")

    # 4. @media and @keyframes at end
    for mk in media_kf_parts:
        output_parts.append(mk)

    result = "".join(output_parts)

    with open(OUTPUT_FILE, "w", encoding="utf-8", newline="\n") as f:
        f.write(result)

    print(f"Done! Output written to {OUTPUT_FILE}")
    print(f"Input lines: {len(lines)}")
    print(f"Output lines: {len(result.split(chr(10)))}")


if __name__ == "__main__":
    main()
