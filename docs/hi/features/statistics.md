# Statistics

Statistics पेज (`/lingua/statistics`) सभी installed भाषाओं में translation coverage का real-time overview देता है।

```blade
{{-- अपने layout में link करें --}}
<a href="{{ route('lingua.statistics') }}">Translation Statistics</a>
```

## Overview Cards

पेज के ऊपर प्रत्येक installed language के लिए एक KPI card है:

| Metric | विवरण |
|---|---|
| **Total strings** | `language_lines` में कितनी keys हैं |
| **Translated** | इस locale के लिए non-empty value वाली keys |
| **Missing** | Total - Translated |
| **Coverage %** | Translated / Total × 100 |

## Group Breakdown

भाषा card पर click करने पर group-by-group breakdown दिखती है:

| Group | Total | Translated | Missing |
|---|---|---|---|
| auth | 12 | 12 | 0 |
| validation | 98 | 87 | 11 |
| pagination | 4 | 4 | 0 |
| … | … | … | … |

## Missing Keys Drill-down

किसी group की "Missing" count पर click करें — उस group की सभी untranslated keys की list दिखती है। वहाँ से directly Translations पेज पर जाकर उन्हें fill कर सकते हैं।

## Vendor Toggle

**Show vendor translations** toggle vendor-namespaced strings को statistics में include/exclude करता है। Vendor strings अलग track करना useful है क्योंकि उन्हें हमेशा translate नहीं करना होता।

## File Driver में Statistics

`file` driver में, statistics filesystem से count करते हैं — `language_lines` table नहीं होती। Coverage percentages available हैं लेकिन group drill-down limited हो सकती है।
