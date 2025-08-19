---
title: "{{ replace (strings.TrimLeft "0123456789- " .Name) "-" " " | title }}"
date: {{ .Date }}
---

