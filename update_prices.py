import re

html_file = 'index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Make Elite $3,500 and VIP $5,000
content = re.sub(r'(<div class="profile-category category-elite">Elite</div>[\s\S]*?<strong>Tarifa:</strong> )\$\d,\d\d\d MXN', r'\g<1>$3,500 MXN', content)
content = re.sub(r'(<div class="profile-category category-vip">VIP</div>[\s\S]*?<strong>Tarifa:</strong> )\$\d,\d\d\d MXN', r'\g<1>$5,000 MXN', content)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated prices')
