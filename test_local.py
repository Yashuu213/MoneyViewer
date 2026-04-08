import re
text = "Rs 100 Pizza 200 rupees Barger"
initial_segments = re.split(r'\s+(?:and|aur|plus)\s+|\s*,\s*', text.lower())
segments = []

for s in initial_segments:
    nums = list(re.finditer(r'(?<![a-zA-Z])\d+(?![a-zA-Z])', s))
    if len(nums) > 1:
        last_pos = 0
        for i in range(1, len(nums)):
            if nums[i].group().startswith('20') and len(nums[i].group()) == 4:
                continue
            split_pos = nums[i].start()
            segments.append(s[last_pos:split_pos].strip())
            last_pos = split_pos
        segments.append(s[last_pos:].strip())
    else:
        segments.append(s.strip())

for seg in segments:
    amt_match = re.search(r'(\d+)', seg)
    amount = float(amt_match.group(1)) if amt_match else 0
    clean_seg = re.sub(r'\b(rs|rupee|rupees)\b', '', seg).strip()
    desc_raw = clean_seg.replace(str(int(amount)), '').strip()
    desc_raw = re.sub(r'\s+', ' ', desc_raw).strip()
    print(f"Segment: '{seg}' -> Amount: {amount}, Desc: '{desc_raw}'")
