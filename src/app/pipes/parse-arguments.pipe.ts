import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseArguments'
})
export class ParseArgumentsPipe implements PipeTransform {
  transform(argString: string): any {
    try {
      if (!argString && argString !== '') return {};

      // remove zero-width/control unicode and trim
      let cleaned = argString.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

      // If it's a quoted JSON string (double-encoded), try unwrapping repeatedly
      // but limit attempts to avoid infinite loop
      for (let i = 0; i < 3; i++) {
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          try {
            cleaned = JSON.parse(cleaned);
            // After parsing we may get an object/array or still a string
            if (typeof cleaned !== 'string') break;
            // if it's still a string, continue loop to try to unwrap more
            cleaned = (cleaned as string).trim();
          } catch {
            // not a plain quoted JSON — stop unwrapping
            break;
          }
        } else {
          break;
        }
      }

      // If cleaned already is object/array, return it
      if (typeof cleaned === 'object') return cleaned;

      // If starts with { or [, find matching end index safely (respect strings and escapes)
      const s = String(cleaned);
      const startChar = s[0];
      if (startChar === '{' || startChar === '[') {
        const endIndex = this.findJsonEndIndex(s);
        if (endIndex >= 0) {
          const jsonCandidate = s.slice(0, endIndex + 1);
          return JSON.parse(jsonCandidate);
        }
      }

      // Fallback: try direct parse (for plain small JSON) — will throw if invalid
      return JSON.parse(s);
    } catch (e: any) {
      // Log helpful debug info: length and a window around the reported position if present
      try {
        console.error('ParseArgumentsPipe error:', e?.message ?? e, '\ninput length:', argString?.length);
        // If error message contains "position N" attempt to print context
        const matchPos = /position\s+(\d+)/i.exec(String(e?.message ?? ''));
        if (matchPos) {
          const pos = parseInt(matchPos[1], 10);
          const start = Math.max(0, pos - 80);
          const end = Math.min(argString.length, pos + 80);
          console.error('Context around error pos:', argString.slice(start, end));
        }
      } catch (logErr) {
        console.error('ParseArgumentsPipe logging failed', logErr);
      }

      return {};
    }
  }

  // Returns index of matching end for object/array, or -1 if cannot find.
  private findJsonEndIndex(s: string): number {
    const openChar = s[0];
    const closeChar = openChar === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = 0; i < s.length; i++) {
      const ch = s[i];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === '"') {
          inString = false;
        }
        continue;
      }

      if (ch === '"') {
        inString = true;
        continue;
      }

      if (ch === openChar) {
        depth++;
      } else if (ch === closeChar) {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
    }

    // not balanced
    return -1;
  }
}
